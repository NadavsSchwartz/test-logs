import { useCallback, useEffect, useState } from 'react';

const useLogFilters = (logs, onFilterSubmit) => {
  const [filters, setFilters] = useState({
    selectedTeams: [],
    selectedActivityTypes: [
      'engineeringNotebookSteps',
      'kudos',
      'feelingsTracker',
    ],
    selectedStudents: [],
  });

  const filteredLogs = logs.filter((log) => {
    const studentId = log?.sender?.id || log?.student?.id || '';
    const teamId = log?.group?.id || '';

    const isStudentSelected =
      filters?.selectedStudents.length === 0 ||
      filters?.selectedStudents?.includes(studentId);
    const isTeamSelected =
      filters?.selectedTeams?.length === 0 ||
      filters?.selectedTeams?.includes(teamId);
    const isActivityTypeSelected =
      (log?.iteration &&
        filters?.selectedActivityTypes?.includes('engineeringNotebookSteps')) ||
      (log?.isPositive && filters?.selectedActivityTypes?.includes('kudos')) ||
      (log?.type && filters.selectedActivityTypes.includes('feelingsTracker'));

    return isStudentSelected && isTeamSelected && isActivityTypeSelected;
  });
  useEffect(() => {
    if (logs && logs.length > 0) {
      onFilterSubmit(
        filters.selectedStudents,
        filters.selectedTeams,
        filters.selectedActivityTypes
      );
    }
  }, [logs, filters]);

  const handleFilterChange = useCallback(
    (
      selectedStudentFilters,
      selectedTeamFilters,
      selectedActivityTypesFilters
    ) => {
      setFilters({
        selectedStudents:
          selectedStudentFilters.length > 0 ? selectedStudentFilters : [],
        selectedTeams:
          selectedTeamFilters.length > 0 ? selectedTeamFilters : [],
        selectedActivityTypes:
          selectedActivityTypesFilters.length > 0
            ? selectedActivityTypesFilters
            : ['engineeringNotebookSteps', 'kudos', 'feelingsTracker'],
      });

      onFilterSubmit(
        selectedStudentFilters,
        selectedTeamFilters,
        selectedActivityTypesFilters
      );
    },
    [setFilters, onFilterSubmit]
  );

  return {
    filteredLogs,
    handleFilterChange,
  };
};

export default useLogFilters;
