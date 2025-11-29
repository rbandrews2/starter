import React from 'react';

interface WorkOrderCardProps {
  id: string;
  title: string;
  location: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignee: string;
  assigneeImage: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  onClick: () => void;
}

const WorkOrderCard: React.FC<WorkOrderCardProps> = ({
  title, location, status, assignee, assigneeImage, dueDate, priority, onClick
}) => {
  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    'in-progress': 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    completed: 'bg-yellow-500/30 text-yellow-200 border-yellow-500/50'
  };

const priorityColors = {
    low: 'border-l-gray-500',
    medium: 'border-l-amber-400',
    high: 'border-l-red-500'
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-black/40 backdrop-blur-md border border-amber-500/30 rounded-lg shadow-[0_0_20px_rgba(255,179,0,0.1)] p-5 hover:shadow-[0_0_30px_rgba(255,179,0,0.2)] transition-all cursor-pointer border-l-4 ${priorityColors[priority]} hover:border-amber-500/50`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-white text-lg">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[status]}`}>
          {status.replace('-', ' ')}
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-3">{location}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={assigneeImage} alt={assignee} className="w-8 h-8 rounded-full object-cover border-2 border-amber-500/30" />
          <span className="text-sm text-gray-300">{assignee}</span>
        </div>
        <span className="text-xs text-gray-500">Due: {dueDate}</span>
      </div>
    </div>
  );
};

export default WorkOrderCard;
