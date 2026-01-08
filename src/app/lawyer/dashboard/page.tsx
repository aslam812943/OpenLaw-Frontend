'use client'

import React from "react";

const DashboardLayout: React.FC = () => {
  return (
    <div>
      <div className="bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 px-6 pt-6">
          Welcome back!
        </h2>
        <div className="px-6">
          <p>Your dashboard.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
