import React from 'react';

const StatCard = ({ icon: Icon, value, label, description, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
    teal: 'bg-teal-100 text-teal-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="dashboard-stat-card bg-white rounded-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
          {description && (
            <p className="text-gray-400 text-xs mt-1">{description}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
              <span className="text-gray-400 text-xs">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${colorClasses[color] || 'bg-gray-100 text-gray-600'}`}>
            <Icon className="w-8 h-8" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
