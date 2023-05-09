import { Group, GroupSet, User } from '@prisma/client';
import { UseMutateFunction } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useCallback, useState } from 'react';
import { GroupCreateData, GroupWithStudents } from 'types/models/Group';
import { GroupSetForDragAndDrop } from 'types/models/GroupSet';
interface GroupManagerProps {
  initialGroupSet: GroupSetForDragAndDrop;
  teacherId: string;
  groupSet: GroupSetForDragAndDrop;
  createGroup: UseMutateFunction<
    Group,
    AxiosError<unknown, any>,
    GroupCreateData,
    unknown
  >;
  showToast: (
    message: string,
    variant: 'success' | 'warning' | 'error'
  ) => void;
  deleteGroup: UseMutateFunction<
    GroupSet,
    AxiosError<unknown, any>,
    any,
    unknown
  >;
}
export const useGroupManager = ({
  initialGroupSet,
  teacherId,
  groupSet,
  createGroup,
  showToast,
  deleteGroup,
}: GroupManagerProps) => {
  const [copiedGroupSet, setCopiedGroupSet] = useState(initialGroupSet);

  const addNewGroup = useCallback(() => {
    // TODO: move newGroupName to Backend
    const newGroupName = `Group ${copiedGroupSet?.groups.length + 1}`;
    createGroup(
      {
        groupSetId: groupSet.id,
        createdBy: teacherId,
        displayName: newGroupName,
        classroomId: groupSet.classroomId as string,
      },
      {
        onSuccess: async (data: any) => {
          copiedGroupSet?.groups.push(data);
          setCopiedGroupSet({ ...copiedGroupSet });
        },
        onError: (error: any) => {
          showToast(error.response?.data?.message || error.message, 'error');
        },
      }
    );
  }, [copiedGroupSet]);

  const isGroupNameUsed = useCallback(
    (groupId: string, name: string) => {
      // filter out the group being updated from the array
      const filteredGroups = copiedGroupSet?.groups.filter(
        (group) => group.id !== groupId
      );

      return filteredGroups.some((group) => group.displayName === name);
    },
    [copiedGroupSet]
  );

  const handleGroupName = useCallback(
    (groupId: string, newGroupName: string, isEditing: boolean) => {
      // Find the group to update
      const groupToUpdateIndex = copiedGroupSet?.groups.findIndex(
        (group) => group?.id === groupId
      );

      // Check if the group exists
      if (groupToUpdateIndex === -1) {
        showToast('Group does not exist', 'error');
        return;
      }

      // Create a new copy of copiedGroupSet and groups
      const newCopiedGroupSet = { ...copiedGroupSet };
      newCopiedGroupSet.groups = [...newCopiedGroupSet.groups];

      if (isEditing) {
        // check if there is a group in edit mode already
        const isGroupInEditMode = newCopiedGroupSet.groups.some(
          (group) => group['isEditing']
        );
        if (isGroupInEditMode) {
          showToast('There is already a Group in edit mode', 'error');
          return;
        }
        newCopiedGroupSet.groups[groupToUpdateIndex]['isEditing'] = isEditing;
      } else {
        // check if group name is already used
        if (isGroupNameUsed(groupId, newGroupName)) {
          showToast('Group name already exists', 'error');
          return;
        }

        // Update the group name
        newCopiedGroupSet.groups[groupToUpdateIndex].displayName =
          newGroupName.trim();
        newCopiedGroupSet.groups[groupToUpdateIndex]['isEditing'] = isEditing;
      }

      // Update the state with the new object
      setCopiedGroupSet(newCopiedGroupSet);
    },
    [copiedGroupSet, showToast, isGroupNameUsed]
  );
  const handleDeleteGroup = useCallback(
    (groupId: string) => {
      // Find the group index to delete
      const groupIndex = copiedGroupSet?.groups.findIndex(
        (group) => group.id === groupId
      );

      // Check if the group exists
      if (groupIndex === -1) {
        showToast('Group does not exist', 'error');
        return;
      }

      deleteGroup(
        { groupsetId: copiedGroupSet.id, groupId: groupId },
        {
          onSuccess: () => {
            setCopiedGroupSet((prevState: any) => {
              const groups = prevState.groups.filter(
                (_: Group, i: number) => i !== groupIndex
              );
              const unassignedStudents = [
                ...prevState.unassignedStudents,
                ...prevState.groups[groupIndex].students,
              ];
              return { ...prevState, groups, unassignedStudents };
            });

            showToast('Group deleted successfully', 'success');
          },
          onError: (error: any) => {
            showToast(error.response?.data?.message || error.message, 'error');
          },
        }
      );
    },
    [copiedGroupSet]
  );
  const moveStudentToGroup = useCallback(
    (studentId: string, groupId: string) => {
      const unassignedStudent = copiedGroupSet?.unassignedStudents.find(
        (s) => s?.id === studentId
      );
      const group = copiedGroupSet?.groups.find((g) => g.id === groupId);
      if (!unassignedStudent || !group) {
        return showToast('Invalid student or group', 'error');
      }
      if ((group.students.length || 0) >= 4) {
        return showToast('Group is full', 'error');
      }

      setCopiedGroupSet((prevState: any) => {
        const newUnassignedStudents = prevState.unassignedStudents.filter(
          (s: Partial<User>) => s?.id !== studentId
        );
        const newGroups = prevState.groups.map((g: GroupWithStudents) => {
          if (g.id === groupId) {
            return { ...g, students: [...g.students, unassignedStudent] };
          }
          return g;
        });
        return {
          ...prevState,
          unassignedStudents: newUnassignedStudents,
          groups: newGroups,
        };
      });
    },
    [copiedGroupSet, showToast]
  );
  const moveStudentToStudentList = useCallback(
    (studentId: string, groupId: string) => {
      const group = copiedGroupSet?.groups.find((g) => g.id === groupId);

      if (group) {
        const student = group?.students?.find((s: any) => s.id === studentId);
        if (student) {
          setCopiedGroupSet((prevState: any) => ({
            ...prevState,
            unassignedStudents: [...prevState.unassignedStudents, student],
            groups: prevState.groups.map((g: GroupWithStudents) =>
              g.id === groupId
                ? {
                    ...g,
                    students: g.students.filter((s) => s.id !== studentId),
                  }
                : g
            ),
          }));
        }
      }
    },
    [copiedGroupSet]
  );

  const moveStudentBetweenGroups = useCallback(
    (
      studentId: string,
      sourceGroupId: string,
      destinationGroupId: string,
      index: number
    ) => {
      const sourceGroup = copiedGroupSet?.groups.find(
        (g) => g.id === sourceGroupId
      );
      const destinationGroup = copiedGroupSet?.groups.find(
        (g) => g.id === destinationGroupId
      );
      if (destinationGroup && destinationGroup.students.length >= 4) {
        return showToast('Group is full', 'error');
      }
      if (sourceGroup && destinationGroup) {
        const student = sourceGroup?.students.find(
          (s: Partial<User>) => s?.id === studentId
        );
        setCopiedGroupSet((prevState: any) => ({
          ...prevState,
          groups: prevState.groups.map((g: GroupWithStudents) =>
            g.id === sourceGroupId
              ? {
                  ...g,
                  students: g.students.filter((s) => s?.id !== studentId),
                }
              : g.id === destinationGroupId
              ? {
                  ...g,
                  students: [
                    ...g.students.slice(0, index),
                    student,
                    ...g.students.slice(index),
                  ],
                }
              : g
          ),
        }));
      }
    },
    [copiedGroupSet, showToast]
  );

  return {
    copiedGroupSet,
    setCopiedGroupSet,
    addNewGroup,
    handleGroupName,
    isGroupNameUsed,
    handleDeleteGroup,
    moveStudentToGroup,
    moveStudentToStudentList,
    moveStudentBetweenGroups,
  };
};
