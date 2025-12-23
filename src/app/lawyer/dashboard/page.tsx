'use client'

import React from "react";


const DashboardLayout: React.FC = () => {
  return (
    <div>
      {/* Main Content */}
      <div className="bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Welcome back!
        </h2>
        <p>Your dashboard content goes here.</p>
      </div>
    </div>
  );
};

export default DashboardLayout;
