import React from 'react';

export function StatCard({ title, value, icon: Icon, color = "blue", trend, trendValue }) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    yellow: "text-yellow-600 bg-yellow-50",
    red: "text-red-600 bg-red-50",
    purple: "text-purple-600 bg-purple-50",
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl transition-colors duration-300 ${colorMap[color] || colorMap.blue}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        {trendValue && (
          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}%
          </span>
        )}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">{value}</h2>
      </div>
    </div>
  );
}
