import React from 'react';

const ActionCard = ({ icon: Icon, title, description, buttonText, onClick, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    green: 'bg-green-100 text-green-600 hover:bg-green-200',
    orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
    purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    teal: 'bg-teal-100 text-teal-600 hover:bg-teal-200',
    red: 'bg-red-100 text-red-600 hover:bg-red-200',
    indigo: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200',
  };

  const buttonColorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    orange: 'bg-orange-500 hover:bg-orange-600',
    purple: 'bg-purple-600 hover:bg-purple-700',
    teal: 'bg-teal-600 hover:bg-teal-700',
    red: 'bg-red-600 hover:bg-red-700',
    indigo: 'bg-indigo-600 hover:bg-indigo-700',
  };

  return (
    <div className="dashboard-action-card bg-white rounded-xl p-6 border border-gray-100 cursor-pointer group">
      <div className="text-center">
        {Icon && (
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${colorClasses[color] || 'bg-gray-100 text-gray-600'} transition-colors`}>
            <Icon className="w-8 h-8" />
          </div>
        )}
        <h4 className="font-bold text-gray-800 mb-2">{title}</h4>
        <p className="text-gray-500 text-sm mb-4">{description}</p>
        <button
          onClick={onClick}
          className={`${buttonColorClasses[color] || 'bg-gray-600 hover:bg-gray-700'} text-white px-4 py-2 rounded-lg font-semibold transition-colors w-full`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ActionCard;
