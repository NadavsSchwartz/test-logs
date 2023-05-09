import React, { useCallback, useState } from 'react';

import {
  EngineeringNotebookStep,
  FeelingsTracker,
  Kudos,
} from '@/lib/Assignments/Log/LogItems';
import { useVirtualizer } from '@tanstack/react-virtual';

import LogFilter from '@/lib/Assignments/Log/LogFilter';
import LogToolbar from '@/lib/Assignments/Log/LogToolbar';
import useInfiniteLogs from '@/lib/react-query/assignments/useLog';
import { FiInfo } from 'react-icons/fi';
import Spinner from '../Loading/Spinner';
import AssignmentLogTooltipModal from '../Modals/assignmentLogTooltipModal';

interface Props {
  assignmentId: string;
  assignmentSetId: string;
}

const Log: React.FC<Props> = ({ assignmentId, assignmentSetId }) => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  //states
  const [isMinimized, setIsMinimized] = useState(true);
  const [tooltipModalOpen, setTooltipModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    selectedStudents: [],
    selectedTeams: [],
    selectedActivityTypes: [
      'engineeringNotebookSteps',
      'kudos',
      'feelingsTracker',
    ],
  });
  const {
    data: logData,
    isLoading: isLoadingLogs,
    isFetching: IsFetchingLogs,
    isFetchingNextPage,
    remove,
    fetchNextPage,
    hasNextPage,
    isRefetching: isRefetchingLogs,
    refetch,
  } = useInfiniteLogs({
    assignmentId,
    assignmentSetId,
    filters,
  });

  const mergedLogs = React.useMemo(() => {
    return (logData?.pages ?? []).flatMap((page) => {
      return page?.logs
        ?.flatMap(
          (log: {
            feelingsTracker: any[];
            group: any;
            kudos: any[];
            engineeringNotebookSteps: any[];
          }) => [
              ...log.feelingsTracker.map((item) => ({
                ...item,
                group: log.group,
              })),
              ...log.kudos.map((item) => ({ ...item, group: log.group })),
              ...log.engineeringNotebookSteps.map((item) => ({
                ...item,
                group: log.group,
              })),
            ]
        )
        .sort(
          (
            a: { createdAt: string | number | Date },
            b: { createdAt: string | number | Date }
          ) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
        );
    });
  }, [logData]);


  const isLoading = isLoadingLogs || IsFetchingLogs || isRefetchingLogs;

  const rowRenderer = useCallback(
    (index: number, start: number, size: number) => {
      const item = mergedLogs[index];
      if (!item) {
        return null;
      }

      return (
        <>
          <div
            data-index={index}
            key={index}
            ref={rowVirtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${start}px)`,
              padding: '10px 0',
            }}
          >
            {'iteration' in item ? (
              <EngineeringNotebookStep step={item} />
            ) : 'isPositive' in item ? (
              <Kudos kudo={item} />
            ) : (
              <FeelingsTracker feeling={item} />
            )}
          </div>
        </>
      );
    },
    [mergedLogs]
  );

  console.log('mergedLogs', mergedLogs.length);
  React.useEffect(() => {
    if (filters) {
      refetch();
    }
  }, [filters]);
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? mergedLogs.length + 1 : mergedLogs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 2,
  });

  React.useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= mergedLogs.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    mergedLogs.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
    filters,
  ]);

  return (
    <div
      className={` fixed bottom-0 mr-1 right-0  z-50 transition-all duration-300`}
    >
      <div
        className={`bg-white w-80 rounded-t-xl shadow-lg relative transition-all  duration-300 border-2 ${isMinimized ? 'h-16' : 'h-full'
          }`}
      >
        {isLoading && !logData ? (
          <div className="pt-3">
            <Spinner />
          </div>
        ) : (
          <>
            <LogToolbar
              isMinimized={isMinimized}
              refetch={() => refetch()}
              toggleMinimize={() => setIsMinimized(!isMinimized)}
            />
            <div
              className={`transition-all duration-300 bg-slate-100 max-h-[70%] px-6 py-2 overflow-auto ${isMinimized ? 'opacity-0' : 'opacity-100'
                }`}
            >
              <div className="flex justify-between py-2 cursor-pointer">
                <div className="pt-1 ">
                  <FiInfo
                    size={20}
                    onClick={() => setTooltipModalOpen(!tooltipModalOpen)}
                  />
                </div>
                <div className="flex overflow-auto ">
                  <LogFilter
                    logs={logData ?? []}
                    onFilterSubmit={({
                      selectedStudentFilters,
                      selectedTeamFilters,
                      selectedActivityTypesFilters,
                    }) => {
                      setFilters({
                        selectedStudents: selectedStudentFilters,
                        selectedTeams: selectedTeamFilters,
                        selectedActivityTypes: selectedActivityTypesFilters,
                      });
                    }}
                  />
                </div>
              </div>
              <div
                className="block min-h-96 relative overflow-auto"
                ref={parentRef}
                style={{ height: '300px' }}
              >
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}`,
                    position: 'relative',
                    width: '100%',
                  }}
                >
                  {rowVirtualizer
                    .getVirtualItems()
                    .map(({ index, start, size }) => {
                      const isLoaderRow = index > mergedLogs.length - 1;
                      return (
                        <>
                          <div key={index} data-index={index}>
                            {rowRenderer(index, start, size)}
                          </div>
                          <div
                            key={`loader-${index}`}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              transform: `translateY(${start}px)`,
                              padding: '10px 0',
                            }}
                          >
                            {isLoaderRow && <Spinner />}
                          </div>
                        </>
                      );
                    })}
                </div>
              </div>{' '}
            </div>
          </>
        )}
      </div>

      <AssignmentLogTooltipModal
        open={tooltipModalOpen}
        onClose={() => setTooltipModalOpen(!tooltipModalOpen)}
      />
    </div>
  );
};

export default Log;

// React.useEffect(() => {
//   if (logData && logData.pages && logData.pages.length > 0) {
//     const allTeams = logData.pages.flatMap(({ logs }) =>
//       logs.map((log) => log.group?.id)
//     );
//     const allStudents = logData.pages.flatMap(({ logs }) =>
//       logs.flatMap((log) => log.group.students.map((student) => student.id))
//     );

//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       selectedTeams:
//         prevFilters.selectedTeams.length === 0
//           ? allTeams
//           : prevFilters.selectedTeams,
//       selectedStudents:
//         prevFilters.selectedStudents.length === 0
//           ? allStudents
//           : prevFilters.selectedStudents,
//     }));
//   }
// }, [logData]);
