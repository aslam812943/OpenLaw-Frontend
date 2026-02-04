'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle, Scale, Users, FileText, Briefcase, Globe, Home, ArrowRight, Star, Menu, X, Facebook, Twitter, Linkedin, Instagram, Phone, Mail, MapPin, ChevronRight } from 'lucide-react';
import MyGlobe from "../components/Globe";
import UserFooter from '../components/user/userFooter'
import UserHeader from '../components/user/userHeader'

const LawyerLandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('/homemiddle1.png');

  const imageOptions = [
    '/homemiddle1.png',
    '/homemiddle2.png',
    '/homemiddle3.png'
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-slate-900 selection:bg-teal-100 selection:text-teal-900">

      {/* Navigation */}
      <UserHeader />

      {/* Hero Section */}
      <section className="relative min-h-[500px] lg:min-h-[650px] flex items-center overflow-hidden">

        <div className="absolute inset-0 z-0">
          <img
            src="/bgimage.png"
            alt="Lawyer Consultation"
            className="w-full h-full object-cover"
          />

        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:ml-20 w-full py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black leading-[1.1] mb-6 sm:mb-8 tracking-tight">
              Accessible legal justice<br className="hidden sm:block" />
              for everyone
            </h1>

            {/* Search Box */}
            <div className="relative max-w-lg lg:max-w-[750px] w-full mb-8 sm:mb-10 shadow-[0_8px_30px_rgb(0,0,0,0.3)] rounded-lg bg-white">
              <div className="flex items-center">
                <div className="pl-4 text-slate-400">
                  <Search className="h-5 w-10" />
                </div>
                <input
                  type="text"
                  className="block w-full px-4 py-3 sm:py-4 bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus:ring-0 text-sm sm:text-base rounded-lg"
                  placeholder="What legal help do you need?"
                />
                {/* <button className="mr-2 bg-teal-600 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-teal-700 transition-all">
                  Find
                </button> */}
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3 sm:-space-x-4">
                {[{ a: 1, img: '/lawyerBoy6.jpg' }, { b: 2, img: '/lawyerBoy4.jpg' }, { c: 3, img: '/laweyrGirl20.jpg' }, { d: 4, img: '/profile.jpg' }].map((item, index) => (
                  <img
                    key={index}
                    className="h-10 w-10 sm:h-12 sm:w-13 rounded-full border-2 border-white object-cover"
                    src={item.img}
                    alt="User"
                    onError={(e) => e.currentTarget.src = 'https://placehold.co/100x100/e2e8f0/64748b?text=U'}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 sm:px-3 py-1.5 rounded-full">
                <CheckCircle className="h-5 w-5 sm:h-7 sm:w-7 text-teal-600 fill-teal-600 text-white" />
                <span className="text-xs sm:text-sm font-bold text-teal-700">Verified</span>


              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <div className="w-full min-h-[500px] sm:min-h-[600px] bg-teal-700 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-['Montserrat']">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">

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
                  style={{ originX: "50%", originY: "100%" }}
                />
                <motion.line
                  x1="50" y1="50" x2="70" y2="50"
                  stroke="currentColor"
                  strokeWidth="2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  style={{ originX: "0%", originY: "50%" }}
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
              <div className="mb-2 font-bold tracking-wider text-xs sm:text-sm opacity-90 ml-2">EVERY</div>

              <div className="flex items-baseline leading-none mb-4">
                <span className="text-7xl sm:text-9xl lg:text-[160px] font-bold leading-none tracking-tighter">10</span>
                <span className="text-2xl sm:text-4xl lg:text-5xl ml-2 sm:ml-4 font-semibold">minutes</span>
              </div>

              <div className="text-lg sm:text-2xl lg:text-3xl font-light opacity-90 mb-8 sm:mb-12 max-w-md leading-tight">
                someone finds the right legal help on OpenLaw
              </div>

              <div className="h-px w-full bg-white/30 mb-8"></div>

              <div className="grid grid-cols-3 gap-4 sm:gap-8">
                <div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">15k+</div>
                  <div className="text-xs sm:text-sm opacity-80 leading-tight">Consultations Completed</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">98%</div>
                  <div className="text-xs sm:text-sm opacity-80 leading-tight">Case Satisfaction Rate</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">4.9/5</div>
                  <div className="text-xs sm:text-sm opacity-80 leading-tight">Average Lawyer Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Testimonial Card */}
          <div className="relative">
            <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 lg:p-12 relative transform transition-transform hover:-translate-y-1 duration-300">
              <div className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed text-center mb-6 sm:mb-8 font-['Open_Sans']">
                "I was facing a complex property dispute and didn't know where to turn. OpenLaw connected me with an expert: <span className="font-bold text-gray-800">within minutes, I had clear legal advice and a path forward.</span>"
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="flex -space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-sm bg-gray-200">
                    <img src="/laweyrGirl20.jpg" alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-sm bg-gray-200">
                    <img src="/profile.jpg" alt="User" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="text-center">
                  <div className="font-bold text-gray-800 text-lg">Sarah & James Mitchell</div>
                  <div className="text-gray-500 text-sm mt-1">Real Estate Clients</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>


      {/* Feature Section 1: Support Team */}
      <section className="py-12 sm:py-16 lg:py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">

            {/* Text Content */}
            <div className="order-2 lg:order-1 lg:ml-20">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-8">
                <Briefcase className="w-6 h-6 text-teal-700" />
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-slate-900 mb-4 sm:mb-6 leading-tight">
                Expert Legal Guidance, <br className="hidden sm:block" /> Every Step of the Way
              </h2>

              <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed max-w-md">
                Connect with top-rated attorneys who are dedicated to your success. Our platform ensures you have a full support system, keeping you informed and confident throughout your legal journey.
              </p>

              <a href="#" className="inline-flex items-center text-teal-600 font-semibold hover:text-teal-700 transition-colors group">
                See how it works
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Image Side */}
            <div className="order-1 lg:order-2 relative">
              <motion.div
                className="rounded-3xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <img
                  src="grouplaweyrs (1).png"
                  alt="Team Support"
                  className="w-full h-auto object-cover"
                  onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80'}
                />
              </motion.div>
              {/* Floating Card */}
              <div className="hidden sm:block absolute bottom-4 sm:bottom-10 right-4 sm:right-10 bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-xl shadow-lg max-w-[200px] sm:max-w-xs animate-fade-in-up">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-slate-700 font-medium">Hello! I've reviewed your case details. We can proceed with the filing today. - Attorney Michael</p>
                  </div>
                  <div className="bg-teal-600 rounded-full p-1">
                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-white border-b-[6px] border-b-transparent ml-0.5"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Section 2: Pricing */}
      <section className="py-12 sm:py-16 lg:py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">

            {/* Image Side */}
            <div className="relative lg:ml-10">
              <motion.div
                className="rounded-3xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <img
                  src="/clicent.jpg"
                  alt="Transparent Pricing"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Floating Pricing Cards */}
              {/* <div className="absolute top-10 right-10 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-xl shadow-lg w-64 transform translate-x-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-800">Initial Consultation</span>
                    <div className="bg-teal-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">$</div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full w-full"></div>
                  <div className="h-2 bg-slate-100 rounded-full w-2/3 mt-2"></div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-lg w-64">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-800">Case Review</span>
                    <div className="bg-teal-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">$</div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full w-full"></div>
                  <div className="h-2 bg-slate-100 rounded-full w-2/3 mt-2"></div>
                  <div className="mt-3 bg-teal-50 text-teal-700 text-xs font-bold py-1 px-2 rounded text-center">
                    See payment options
                  </div>
                </div>
              </div> */}
            </div>

            {/* Text Content */}
            <div>
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-8">
                <FileText className="w-6 h-6 text-teal-700" />
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-slate-900 mb-4 sm:mb-6 leading-tight">
                Transparent Pricing, <br className="hidden sm:block" /> No Hidden Fees
              </h2>

              <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed max-w-md">
                We believe in complete financial transparency. See exactly what you'll pay upfront with our fixed-fee structure. No surprise bills, just clear, honest pricing for high-quality legal representation.
              </p>

              <a href="#" className="inline-flex items-center text-teal-600 font-semibold hover:text-teal-700 transition-colors group">
                See how we price
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

          </div>
        </div>
      </section >

      {/* Image Modal */}
      < AnimatePresence >
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 z-20 bg-white hover:bg-slate-50 text-slate-600 hover:text-teal-700 rounded-full p-2 shadow-md transition-all duration-200"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal Content */}
              <div className="flex flex-col">
                {/* Main Image */}
                <div className="relative w-full h-[400px] bg-slate-100">
                  <img
                    src={selectedImage}
                    alt="Expert Legal Consultation"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-teal-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg font-semibold">
                    Top-Rated Experts
                  </div>
                </div>

                {/* Text Content */}
                <div className="p-8 bg-white">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
                    Need Legal Advice?
                  </h2>
                  <p className="text-base text-slate-700 mb-6 leading-relaxed">
                    Don't let legal complexities slow you down. At OpenLaw, we pair you with vetted attorneys who specialize in your matter. Get instant support, clear answers, and total confidentiality—so you can focus on winning.
                  </p>

                  <div className="flex items-center gap-2 text-teal-600 font-medium text-sm cursor-pointer hover:text-teal-700 transition-colors">
                    <span>Learn more</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Image Thumbnails */}
                <div className="px-8 pb-6 bg-white border-t border-slate-200">
                  <div className="flex gap-3 mt-4">
                    {imageOptions.map((img: string, index: number) => (
                      <div
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={`relative flex-1 h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${selectedImage === img
                          ? 'border-teal-600 shadow-md'
                          : 'border-slate-200 hover:border-teal-400'
                          }`}
                      >
                        <img
                          src={img}
                          alt={`Option ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/200x100/e2e8f0/64748b?text=Image';
                          }}
                        />
                        {selectedImage === img && (
                          <div className="absolute inset-0 bg-teal-600/20 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-teal-600 fill-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence >

      {/* Testimonial (Keeping simplified) */}
      {/* <section className="py-24 bg-[#fafafa]">
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
      </section> */}

      <MyGlobe />

      {/* Footer */}
      <footer >
        <UserFooter />
      </footer>
    </div >
  );
};

export default LawyerLandingPage;