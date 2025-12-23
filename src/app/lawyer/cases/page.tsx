'use client'


import { useRouter } from 'next/navigation';

const cases = () => {
  const router = useRouter()
  return (
    <div>
      {/* Main Content */}
      <div className="bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Welcome back!
        </h2>
        <p>Your cases content goes here.</p>
        <button className='bg-red' onClick={() => router.push('/lawyer/slotShedule')}>Schedule</button>
      </div>
    </div>
  );
};



export default cases