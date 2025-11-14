'use client'

import Header from '../../../components/LawyersHeader'
 import Sidebar from '../../../components/LawyerSidebar'
 import { useRouter } from 'next/navigation';
 
 const cases  = ()=>{
    const router  = useRouter()
  return (
    <div>
       <Header lawyerName="Muhammad Aslam" />
      <Sidebar />

      {/* Main Content */}
      <main className="ml-0 lg:ml-64 mt-16 p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Welcome back!
        </h2>
        <p>Your cases content goes here.</p>
        <button className='bg-red' onClick={()=>router.push('/lawyer/slotShedule')}>Schedule</button>
      </main>
    </div>
  );
};



export default cases