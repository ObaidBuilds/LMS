import React from "react";

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
    <div className="flex items-center">
      <div className={`p-3 ${color} rounded-xl mr-4`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

export default StatCard;
