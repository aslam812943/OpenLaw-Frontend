import React from "react";
import Header from "../../components/LawyersHeader";
import Sidebar from "../../components/LawyerSidebar";

const DashboardLayout: React.FC = () => {
  return (
    <div>
      <Header lawyerName="Muhammad Aslam" />
      <Sidebar />

      {/* Main Content */}
      <main className="ml-0 lg:ml-64 mt-16 p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Welcome back!
        </h2>
        <p>Your dashboard content goes here.</p>
      </main>
    </div>
  );
};

export default DashboardLayout;
