'use client'

import React, { useState } from 'react';


export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
   

      
      <main
        // className={`flex-1 transition-all duration-300 ${
        //   collapsed ? 'ml-20' : 'ml-64'
        // } p-8`}
      >
        <h1 className="text-3xl font-semibold text-white">
          Admin Dashboard
        </h1>
        <p className="mt-4 text-gray-600">
          Welcome to the admin panel. Manage users, lawyers, payments, and more.
        </p>
      </main>
    </div>
  );
}
