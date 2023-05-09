import Button from '@/components/Button';
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/Forms/menubar';
import React, { useMemo, useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import {
  FiCheckSquare,
  FiChevronDown,
  FiChevronRight,
  FiMinusSquare,
  FiPlusSquare,
  FiSquare,
} from 'react-icons/fi';
import { AssignmentSetLogData } from 'types/models/Assignment';
type GroupType = {
  id: string;
  displayName: string;
  students: StudentType[];
};

type StudentType = {
  id: string;
  firstName: string;
  lastName: string;
};
interface LogFilterProps {
  logs: AssignmentSetLogData;
  onFilterSubmit: (filters: {
    selectedStudentFilters: string[];
    selectedTeamFilters: string[];
    selectedActivityTypesFilters: string[];
  }) => void;
}
const LogFilter: React.FC<LogFilterProps> = ({ logs, onFilterSubmit }) => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const teamNodes = useMemo(() => {
    const uniqueGroups = new Set();
    const uniqueStudents = new Set();
    return logs?.pages
      ?.flatMap((page) => page?.logs || [])
      ?.flatMap(({ group }: any) => {
        if (!group || uniqueGroups.has(group.id)) return [];
        uniqueGroups.add(group.id);
        const uniqueGroupStudents = group.students.filter(
          (student: StudentType) => {
            if (uniqueStudents.has(student.id)) return false;
            uniqueStudents.add(student.id);
            return true;
          }
        );

        return [
          {
            value: group.id,
            label: group.displayName,
            children: uniqueGroupStudents.map((student: StudentType) => ({
              value: student.id,
              label: `${student.firstName} ${student.lastName}`,
            })),
          },
        ];
      });
  }, [logs]);

  const activityTypeNodes = [
    {
      value: 'engineeringNotebookSteps',
      label: 'Engineering Notebook Steps',
    },
    { value: 'kudos', label: 'Kudos' },
    { value: 'feelingsTracker', label: 'Feelings Tracker' },
  ];

  const [selectedFilters, setSelectedFilters] = useState<{
    teams: string[];
    students: string[];
    activityTypes: string[];
  }>({
    teams: [],
    students: [],
    activityTypes: [],
  });

  const handleSubmit = () => {
    const { teams, students, activityTypes } = selectedFilters;
    console.log('teams BEFORE', teams);
    console.log('students BEFORE', students);
    console.log('activityTypes BEFORE', activityTypes);
    if (students.length && activityTypes.length) {
      onFilterSubmit({
        selectedStudentFilters: students,
        selectedTeamFilters: teams,
        selectedActivityTypesFilters: activityTypes,
      });
    } else {
      alert('Please select at least one student and one activity type.');
    }
  };
  return (
    <Menubar className="w-fit">
      <MenubarMenu>
        <MenubarTrigger>
          <span className="pr-1">Filter</span>
          <FiChevronDown size={16} />
        </MenubarTrigger>
        <MenubarContent>
          <div className="flex flex-row justify-between align-middle">
            <Button
              onClick={() =>
                setSelectedFilters({
                  teams: [],
                  students: [],
                  activityTypes: [],
                })
              }
              color="minimal"
              className="max-h-6"
            >
              Clear Filters
            </Button>
            <Button
              onClick={handleSubmit}
              color="minimal"
              className="max-h-6 text-[#007BFF]"
            >
              See Results
            </Button>
          </div>
          <MenubarSub>
            <MenubarSubTrigger>Teams</MenubarSubTrigger>
            <MenubarSubContent>
              <CheckboxTree
                nodes={teamNodes}
                expanded={expanded}
                checked={selectedFilters.students}
                checkModel="all"
                onCheck={(checked, node) => {
                  let newChecked = [...checked];
                  let teams = [...selectedFilters.teams];
                  if (node.isChild) {
                    const parentNode = node.parent;
                    console.log('childrenNode', node);
                    if (!checked.length && teams.includes(parentNode.value)) {
                      teams = teams.filter((t) => t !== parentNode.value);
                    } else if (!teams.includes(parentNode.value)) {
                      teams = [...teams, parentNode.value];
                    }
                    // remove team ids from students
                    newChecked = newChecked.filter((c) => !teams.includes(c));
                    console.log('newChecked', newChecked);
                    console.log('teams', teams);
                    setSelectedFilters((prevState) => ({
                      ...prevState,
                      students: newChecked,
                      teams: teams,
                    }));
                  } else {
                    if (checked.includes(node.value)) {
                      newChecked = newChecked.filter((c) => c !== node.value);
                      teams = teams.filter((t) => t !== node.value);
                    } else {
                      newChecked = [...newChecked, node.value];
                    }
                    setSelectedFilters((prevState) => ({
                      ...prevState,
                      students: newChecked,
                      teams,
                    }));
                  }
                  setExpanded(expanded);
                }}
                onExpand={(expanded) => setExpanded(expanded)}
                showNodeIcon={false}
                icons={{
                  check: <FiCheckSquare size={15} />,
                  uncheck: <FiSquare />,
                  expandClose: <FiChevronRight size={15} />,
                  expandOpen: <FiChevronDown size={15} />,
                  expandAll: <FiPlusSquare size={15} />,
                  collapseAll: <FiMinusSquare size={15} />,
                  parentClose: <FiChevronRight size={15} />,
                  parentOpen: <FiChevronDown size={15} />,
                  leaf: <FiChevronRight size={15} />,
                  halfCheck: <FiSquare />,
                }}
              />
            </MenubarSubContent>
          </MenubarSub>

          <MenubarSub>
            <MenubarSubTrigger>Activity Types</MenubarSubTrigger>
            <MenubarSubContent>
              <CheckboxTree
                nodes={activityTypeNodes}
                expanded={expanded}
                checked={selectedFilters.activityTypes}
                onCheck={(checked) => {
                  setSelectedFilters((prevState) => ({
                    ...prevState,
                    activityTypes: checked,
                  }));
                }}
                onExpand={(expanded) => setExpanded(expanded)}
                showNodeIcon={false}
                icons={{
                  check: <FiCheckSquare size={15} />,
                  uncheck: <FiSquare />,
                  expandClose: <FiChevronRight size={15} />,
                  expandOpen: <FiChevronDown size={15} />,
                  expandAll: <FiPlusSquare size={15} />,
                  collapseAll: <FiMinusSquare size={15} />,
                  parentClose: <FiChevronRight size={15} />,
                  parentOpen: <FiChevronDown size={15} />,
                  leaf: <FiChevronRight size={15} />,
                  halfCheck: <FiSquare />,
                }}
              />
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default LogFilter;
