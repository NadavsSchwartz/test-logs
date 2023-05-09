import { FiTarget } from 'react-icons/fi';
import { GoSearch, GoSmiley } from 'react-icons/go';
import { HiOutlineCloud, HiUsers } from 'react-icons/hi';
import { IoContract } from 'react-icons/io5';
import { Dialog, DialogContent } from '../Dialog';
const AssignmentLogTooltipModal: React.FC<{
  onClose: () => void;
  open: boolean;
}> = ({ open, onClose, ...props }) => {
  const tooltipMenu = [
    {
      displayName: 'Reflection',
      icon: HiOutlineCloud,
    },
    {
      displayName: 'Feeling',
      icon: GoSmiley,
    },
    {
      displayName: 'Collaboration',
      icon: HiUsers,
    },
    {
      displayName: 'Results',
      icon: GoSearch,
    },
    {
      displayName: 'Objectives',
      icon: FiTarget,
    },
    {
      displayName: 'Constraints',
      icon: IoContract,
    },
  ];

  return (
    <Dialog
      {...props}
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent>
        {tooltipMenu.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 mb-1">
            <item.icon className="h-6 w-6" />
            <span className="text-lg">{item.displayName}</span>
          </div>
        ))}

        <span
          className="absolute -top-6 -right-1 flex justify-center rounded-full w-11  cursor-pointer  outline-none z-50 pt-1"
          onClick={() => onClose()}
        >
          <span className=" text-3xl leading-6 select-none ">&times;</span>
        </span>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentLogTooltipModal;
