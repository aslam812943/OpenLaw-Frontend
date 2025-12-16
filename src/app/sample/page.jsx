'use client';
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Search, CheckCircle, Scale, Users, FileText, Briefcase, Globe, Home, ArrowRight, Star, Menu, X, Facebook, Twitter, Linkedin, Instagram, Phone, Mail, MapPin, ChevronRight } from 'lucide-react';

const LawyerLandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-emerald-800" strokeWidth={2.5} />
              <span className="text-xl font-bold text-slate-900 tracking-tight">Lawyer</span>
            </div>

            {/* Desktop Menu - Centered */}
            <div className="hidden md:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Overview</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Contact</a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button className="bg-emerald-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-all">
                Consultation
              </button>
              <button className="border border-slate-200 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all">
                Log in
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 absolute w-full left-0 px-4 py-6 shadow-xl space-y-4 z-50">
            <a href="#" className="block text-base font-medium text-slate-600">Overview</a>
            <a href="#" className="block text-base font-medium text-slate-600">Pricing</a>
            <a href="#" className="block text-base font-medium text-slate-600">Contact</a>
            <div className="pt-4 flex flex-col gap-3">
              <button className="w-full bg-emerald-800 text-white py-3 rounded-lg font-semibold">Consultation</button>
              <button className="w-full border border-slate-200 text-slate-700 py-3 rounded-lg font-semibold">Log in</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[400px] lg:min-h-[550px] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/bgimage.png"
            alt="Lawyer Consultation"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay for better text readability */}
          {/* <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/50 to-transparent"></div> */}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl ml-50 mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-2xl">
            <h1 className="text-2xl lg:text-5xl font-bold text-black leading-[1.1] mb-8 tracking-tight">
              Friendy your lawyer <br />
              <span className="text-black">consultation platform</span>
            </h1>

            {/* Search Box */}
            <div className="relative max-w-lg w-500 mb-10 shadow-[0_8px_30px_rgb(0,0,0,0.3)] rounded-lg bg-white">
              <div className="flex items-center">
                <div className="pl-4 text-slate-400">
                  <Search className="h-5 w-10" />
                </div>
                <input
                  type="text"
                  className="block w-full px-4 py-4 bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus:ring-0 text-base rounded-lg"
                  placeholder="What legal help do you need?"
                />
                {/* <button className="mr-2 bg-emerald-800 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-emerald-700 transition-all">
                  Find
                </button> */}
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    className="h-12 w-13 rounded-full border-2 border-white object-cover"
                    src='/profile.jpg'
                    alt="User"
                    onError={(e) => e.target.src = 'https://placehold.co/100x100/e2e8f0/64748b?text=U'}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <CheckCircle className="h-7 w-7 text-emerald-500 fill-emerald-500 text-white" />
                <span className="text-sm font-bold text-emerald-600">Verified</span>
          

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
         <div className="w-full min-h-[600px] bg-emerald-800  flex items-center justify-center p-8 font-['Montserrat']">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Stats & Clock */}
        <div className="text-white relative">
          
          {/* Clock Background Animation */}
          <div className="absolute -top-16 -left-10 w-80 h-80 opacity-20 pointer-events-none select-none">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" fill="none" />
              <motion.line 
                x1="50" y1="50" x2="50" y2="10" 
                stroke="currentColor" 
                strokeWidth="2"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                style={{ originX: "50%", originY: "50%" }}
              />
               <motion.line 
                x1="50" y1="50" x2="70" y2="50" 
                stroke="currentColor" 
                strokeWidth="2"
                animate={{ rotate: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{ originX: "50%", originY: "50%" }}
              />
              {/* Minute markers */}
              {[...Array(12)].map((_, i) => (
                <line 
                  key={i}
                  x1="50" y1="5" x2="50" y2="10"
                  stroke="currentColor"
                  strokeWidth="1"
                  transform={`rotate(${i * 30} 50 50)`}
                />
              ))}
            </svg>
          </div>

          <div className="relative z-10">
            <div className="mb-2 font-bold tracking-wider text-sm opacity-90 ml-2">EVERY</div>
            
            <div className="flex items-baseline leading-none mb-4">
              <span className="text-[160px] font-bold leading-none tracking-tighter">90</span>
              <span className="text-5xl ml-4 font-semibold">seconds</span>
            </div>
            
            <div className="text-3xl font-light opacity-90 mb-12 max-w-md leading-tight">
              a startup is on the phone with a Clarity Expert
            </div>

            <div className="h-px w-full bg-white/30 mb-8"></div>

            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold mb-1">73k+</div>
                <div className="text-sm opacity-80 leading-tight">Completed calls with Experts</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">98%</div>
                <div className="text-sm opacity-80 leading-tight">Positive Clarity Expert calls</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">4.8/5</div>
                <div className="text-sm opacity-80 leading-tight">Average Clarity Expert star rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Testimonial Card */}
        <div className="relative">
          <div className="bg-white rounded-lg shadow-2xl p-12 relative transform transition-transform hover:-translate-y-1 duration-300">
             <div className="text-gray-600 text-xl leading-relaxed text-center mb-8 font-['Open_Sans']">
              "We really needed help with our messaging and brand story. Clarity helped us get there: <span className="font-bold text-gray-800">at TechCrunch Disrupt, we literally had lines of people wanting to talk to us and watch our demo.</span>"
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="flex -space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-sm bg-gray-200">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-sm bg-gray-200">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="User" className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="text-center">
                <div className="font-bold text-gray-800 text-lg">M. Geneles & A. Gopshtein</div>
                <div className="text-gray-500 text-sm mt-1">Founders of Pitchbox</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

      {/* Practice Areas (Keeping simplified version for layout completeness) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Practice Areas</h2>
            <a href="#" className="text-emerald-800 font-bold text-sm">View All</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Family Law', icon: Users, desc: 'Careless real overal family law herean.' },
              { title: 'Criminal Defense', icon: Scale, desc: 'Assets and assistance to resist a materials.' },
              { title: 'Business', icon: Briefcase, desc: 'These memories business laws.' },
              { title: 'Real Estate', icon: Home, desc: 'Housing and consultation.' },
              { title: 'Immigration', icon: Globe, desc: 'Immigration and commercial areas.' },
              { title: 'Wills & Trusts', icon: FileText, desc: 'Testaments and legal documents.' }
            ].map((area, i) => (
              <div key={i} className="p-6 border border-slate-100 rounded-xl hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-800 mb-4">
                  <area.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{area.title}</h3>
                <p className="text-slate-500 text-sm">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial (Keeping simplified) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80" className="rounded-2xl w-full" alt="Testimonial" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Testimonial</h2>
              <p className="text-slate-600 text-lg italic mb-8">"Seemly isdy happy and fit your client tuets l'amicus tonity cene scisse root are enmity and notantie perfect. The one or ea isre omotty notatre experience."</p>
              <div className="flex items-center gap-4">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" className="w-12 h-12 rounded-full" alt="User" />
                <div>
                  <h4 className="font-bold text-slate-900">Jane Ohkare</h4>
                  <p className="text-slate-500 text-sm">Happy Client</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#022c22] text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-emerald-800 pb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Scale className="h-6 w-6 text-emerald-400" />
                <span className="text-xl font-bold">Lawyer</span>
              </div>
              <div className="space-y-2 text-sm text-emerald-100/70">
                <p>About</p>
                <p>Privacy</p>
                <p>Contact us</p>
                <p>Career</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6">Footer</h4>
              <div className="space-y-2 text-sm text-emerald-100/70">
                <p>Blog</p>
                <p>Contact</p>
                <p>Coontesies</p>
                <p>Criminal Defense</p>
                <p>Immigration</p>
                <p>Product Process</p>
              </div>
            </div>

            {/* Empty columns for spacing to match image */}
            <div></div>
            <div></div>
          </div>

          <div className="pt-8 flex justify-between text-xs text-emerald-100/50">
            <div className="flex gap-4">
              <span>Privacy Policy</span>
              <span>Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LawyerLandingPage;