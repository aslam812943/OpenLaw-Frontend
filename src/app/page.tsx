
'use client'

import { Scale, Shield, Users, Gavel, FileText, Award, BookOpen, ArrowRight, CheckCircle, Star } from 'lucide-react';
import UserHeader from '../components/Header'


function Home() {
  return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">

      {/* Header */}
      <header className="w-full z-20 fixed top-0 left-0 bg-white/70 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <UserHeader />
        </div>
      </header>

    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 overflow-hidden">
    
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-green-50 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Background Icons */}
      <div className="absolute top-20 left-20 animate-float opacity-20">
        <Shield className="w-8 h-8 text-green-400" />
      </div>
      <div className="absolute top-40 right-32 animate-float animation-delay-1000 opacity-20">
        <Gavel className="w-10 h-10 text-green-400" />
      </div>
      <div className="absolute bottom-32 left-40 animate-float animation-delay-2000 opacity-20">
        <Users className="w-9 h-9 text-green-400" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-7xl flex items-center justify-between gap-16">

          {/* Left Side - Modern Card-Based Layout */}
          <div className="flex-1 space-y-6 animate-slide-in-left">
            <div className="space-y-4 mt-25 ml-8">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Connect with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Expert Lawyers
                </span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                Your trusted platform for professional legal guidance. Find the right attorney for your needs in seconds.
              </p>
            </div>

            <div className="space-y-4 ml-8">
              {/* Feature Card 1 */}
              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100 hover:border-green-300 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">Quick Matching</h3>
                    <p className="text-sm text-gray-600 mt-1">Smart algorithm matches you with the perfect lawyer in minutes</p>
                  </div>
                </div>
              </div>

              {/* Feature Card 2 */}
              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100 hover:border-green-300 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">Verified Credentials</h3>
                    <p className="text-sm text-gray-600 mt-1">All lawyers are fully licensed and verified by bar associations</p>
                  </div>
                </div>
              </div>

              {/* Feature Card 3 */}
              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100 hover:border-green-300 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                    <Gavel className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">Multiple Practice Areas</h3>
                    <p className="text-sm text-gray-600 mt-1">Corporate, Family, Criminal, Intellectual Property, and more</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side - Lawyers Image with 3D Animated Circle */}
          <div className="flex-1 relative flex items-center justify-center mr-20">

            {/* 3D Rotating Circle with Icons */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[500px] h-[500px]">

                {/* Animated rotating circle with 3D perspective */}
                <div className="absolute inset-0 animate-rotate-3d" style={{ transformStyle: 'preserve-3d' }}>

                  {/* Icon 1 - Top (0 degrees) */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8" style={{ transform: 'translateZ(50px)' }}>
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse-slow hover:scale-110 transition-transform">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Icon 2 - Top Right (45 degrees) */}
                  <div className="absolute top-[15%] right-[15%] translate-x-6 -translate-y-6" style={{ transform: 'translateZ(40px) rotateY(20deg)' }}>
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-xl animate-pulse-slow animation-delay-500 hover:scale-110 transition-transform">
                      <Scale className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Icon 3 - Right (90 degrees) */}
                  <div className="absolute top-1/2 right-0 translate-x-8 -translate-y-1/2" style={{ transform: 'translateZ(50px) rotateY(40deg)' }}>
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse-slow animation-delay-1000 hover:scale-110 transition-transform">
                      <Gavel className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Icon 4 - Bottom Right (135 degrees) */}
                  <div className="absolute bottom-[15%] right-[15%] translate-x-6 translate-y-6" style={{ transform: 'translateZ(40px) rotateY(20deg)' }}>
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-xl animate-pulse-slow animation-delay-1500 hover:scale-110 transition-transform">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Icon 5 - Bottom (180 degrees) */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8" style={{ transform: 'translateZ(50px)' }}>
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse-slow animation-delay-2000 hover:scale-110 transition-transform">
                      <Award className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Icon 6 - Bottom Left (225 degrees) */}
                  <div className="absolute bottom-[15%] left-[15%] -translate-x-6 translate-y-6" style={{ transform: 'translateZ(40px) rotateY(-20deg)' }}>
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-xl animate-pulse-slow animation-delay-2500 hover:scale-110 transition-transform">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Icon 7 - Left (270 degrees) */}
                  <div className="absolute top-1/2 left-0 -translate-x-8 -translate-y-1/2" style={{ transform: 'translateZ(50px) rotateY(-40deg)' }}>
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse-slow animation-delay-3000 hover:scale-110 transition-transform">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Icon 8 - Top Left (315 degrees) */}
                  <div className="absolute top-[15%] left-[15%] -translate-x-6 -translate-y-6" style={{ transform: 'translateZ(40px) rotateY(-20deg)' }}>
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-xl animate-pulse-slow animation-delay-3500 hover:scale-110 transition-transform">
                      <Scale className="w-8 h-8 text-white" />
                    </div>
                  </div>

                </div>

                {/* Orbiting Circle Line */}
                <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="1"
                    strokeDasharray="6 6"
                    opacity="0.4"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="95"
                    fill="none"
                    stroke="url(#gradient2)"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                    opacity="0.2"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>

              </div>
            </div>

            {/* Center Content - Lawyer Group */}
          <div className="relative z-10 animate-float-slow flex items-center justify-center">
  <div className="relative">
    {/* Soft background glow behind image */}
    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 blur-3xl rounded-full"></div>

    {/* Actual Image */}
    <img
      src="/Untitled design.png"  // 🟢 your image path here
      alt="Expert Lawyers Team"
      className="relative z-10 w-60 h-60 object-cover rounded-3xl shadow-2xl border border-green-100"
    />
  </div>
</div>

          </div>

        </div>
      </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes rotate-3d {
          0% { transform: rotateY(0deg) rotateX(0deg); }
          25% { transform: rotateY(90deg) rotateX(5deg); }
          50% { transform: rotateY(180deg) rotateX(0deg); }
          75% { transform: rotateY(270deg) rotateX(-5deg); }
          100% { transform: rotateY(360deg) rotateX(0deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.95); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        .animate-rotate-3d { animation: rotate-3d 20s linear infinite; }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-slide-in-left { animation: slide-in-left 0.8s ease-out; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1500 { animation-delay: 1.5s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-2500 { animation-delay: 2.5s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-3500 { animation-delay: 3.5s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}

export default Home;
