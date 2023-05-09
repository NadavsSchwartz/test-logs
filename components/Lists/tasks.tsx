import QueryKeys from '@/lib/react-query/queryKeys';
import { useDeleteTask } from '@/lib/react-query/tasks/useDeleteTask';
import { Tasks } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { AiFillDelete } from 'react-icons/ai';
import { List, ListItem, ListItemText, ListItemTitle } from '.';
import showToast from '../Alert/toast';
import Button from '../Button';
type TasksProps = {
  tasks: Tasks[];
};

const TasksList = (props: TasksProps) => {
  const { mutate: deleteTask, isLoading, error } = useDeleteTask();

  const queryClient = useQueryClient();

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId, {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.TASKS]);
        showToast('Task deleted successfully', 'success');
      },
      onError: () => {
        showToast(error?.message || 'something went wrong', 'error');
      },
    });
  };
  return (
    <div className="w-full px-4" data-testid="tasks-list">
      <List>
        {props.tasks.map((task) => (
          <ListItem key={task.id} className="hover:bg-orange-100 hover:rounded">
            <div className="w-full">
              <ListItemTitle component="h3">
                <span data-testid="task-display-name">{task.displayName}</span>
                <span> &#183; </span>
                <span className="rounded py-0.5 px-[6px] bg-green-100 text-green-800 text-xs">
                  {task.grade}
                </span>
                <span className="hidden xs:inline-flex px-1"> &#183; </span>
                <span className="hidden xs:inline-flex px-1 rounded py-0.5 bg-green-100 text-green-800 text-xs">
                  {task?.type?.replace(/_/g, ' ')}
                </span>
              </ListItemTitle>
              <ListItemText className="capitalize">
                {task.unit?.replace(/-/g, ' ')}
              </ListItemText>
            </div>

            {/* --potential tags for tasks--
            <div className="flex items-center justify-end">
                <div className="inline-flex items-center text-sm font-medium relative justify-center min-h-[32px] min-w-[36px] w-fit scrollbar-width:1px  rounded-md border border-gray-200 text-brand-900 bg-white hover:bg-gray-100 mr-3 ml-2 px-1 text-black">
                  tag1
                </div>
                <div className="inline-flex items-center text-sm font-medium relative justify-center min-h-[32px] min-w-[36px] w-fit scrollbar-width:1px  rounded-md border border-gray-200 text-brand-900 bg-white hover:bg-gray-100 mr-3 ml-2 px-1 text-black">
                  tag2
                </div>
                <div className="inline-flex items-center text-sm font-medium relative justify-center min-h-[32px] min-w-[36px] w-fit scrollbar-width:1px  rounded-md border border-gray-200 text-brand-900 bg-white hover:bg-gray-100 mr-3 ml-2 px-1 text-black">
                  extralongtag3
                </div>
              </div> */}
            <div className="inline-flex items-center text-black">
              <ListItemText className="hidden xs:flex pr-3">
                {dayjs(task.createdAt).format('MM/DD/YYYY')}
              </ListItemText>

              <Button
                color="destructive"
                size="icon"
                StartIcon={AiFillDelete}
                onClick={() => handleDeleteTask(task.id)}
                loading={isLoading}
              />
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TasksList;
