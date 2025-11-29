import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp }) => {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-amber-500/30 rounded-lg shadow-[0_0_20px_rgba(255,179,0,0.1)] p-6 hover:shadow-[0_0_30px_rgba(255,179,0,0.2)] transition-all hover:border-amber-500/50">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trendUp ? 'text-yellow-300' : 'text-red-400'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="text-amber-400 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
