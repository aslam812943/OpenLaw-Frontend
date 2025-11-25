'use client';
import React, { useState } from 'react';
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
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Column: Content */}
            <div className="relative z-10 pr-8">
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-[1.1] mb-8 tracking-tight">
                Friendy your lawyer <br />
                <span className="text-slate-900">consultation platform</span>
              </h1>

              {/* Search Box */}
              <div className="relative max-w-lg w-full mb-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-lg bg-white">
                <div className="flex items-center">
                  <div className="pl-4 text-slate-400">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    className="block w-full px-4 py-4 bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus:ring-0 text-base rounded-lg"
                    placeholder="What legal help do you need?"
                  />
                </div>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-white object-cover"
                      src={`https://images.unsplash.com/photo-${1500000000000 + (i * 98765)}?auto=format&fit=crop&w=100&h=100&q=80`}
                      alt="User"
                      onError={(e) => e.target.src = 'https://placehold.co/100x100/e2e8f0/64748b?text=U'}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-5 w-5 text-emerald-500 fill-emerald-500 text-white" />
                  <span className="text-sm font-bold text-emerald-600">Verified</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Image */}
            <div className="relative h-full flex justify-end">
              <div className="relative w-full max-w-lg lg:max-w-full">
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Lawyer Consultation"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-slate-900">How it Works</h2>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {[
                { title: 'Family Law', sub: 'Family ella Law', img: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=400&h=400&q=80' },
                { title: 'Criminal Defense', sub: 'Cafe meeting', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80' },
                { title: 'Business', sub: 'Business Area', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&h=400&q=80' },
                { title: 'Immigration', sub: 'Immigration and rebwer', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=400&h=400&q=80' }
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center relative">
                  {/* Arrow */}
                  {idx < 3 && (
                    <div className="hidden lg:block absolute top-20 -right-1/2 w-full h-px bg-slate-200 z-0 flex items-center justify-center">
                      <ArrowRight className="text-emerald-800 w-5 h-5 absolute right-1/2 translate-x-1/2 bg-white px-1" />
                    </div>
                  )}

                  <div className="w-40 h-40 rounded-full overflow-hidden mb-6 relative z-10">
                    <img src={step.img} alt={step.title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-slate-500 text-sm">{step.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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