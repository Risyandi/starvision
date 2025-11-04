import React from 'react';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex gap-2 border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-3 font-medium transition lowercase ${
            activeTab === tab.id
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-2 text-sm bg-gray-200 px-2 py-1 rounded-full">
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;