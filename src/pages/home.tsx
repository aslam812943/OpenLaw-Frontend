"use client";

import Image from "next/image";
import { ShieldCheck, Users, Briefcase } from "lucide-react";
import Link from "next/link";
import Header from '../components/Header'

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E9FFF3] via-white to-[#F5FFF9] py-20">
      <Header/>
      {/* Floating Background Shapes */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#00A86B]/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#00C89B]/20 rounded-full blur-3xl animate-pulse" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Find <span className="text-[#00A86B]">Trusted Lawyers</span>{" "}
            Instantly.
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
            LegalConnect helps you find, connect, and collaborate with verified
            legal professionals across India.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/find-lawyers"
              className="px-8 py-4 text-white font-semibold rounded-full bg-gradient-to-r from-[#00A86B] to-[#00C89B] shadow-md hover:shadow-lg hover:opacity-90 transition-all"
            >
              Find a Lawyer
            </Link>
            <Link
              href="/join"
              className="px-8 py-4 text-[#00A86B] font-semibold rounded-full border-2 border-[#00A86B] hover:bg-[#00A86B] hover:text-white transition-all"
            >
              Join Our Network
            </Link>
          </div>

          {/* Trust Metrics */}
          <div className="grid grid-cols-3 gap-6 pt-8">
            <div className="flex flex-col items-start space-y-1">
              <ShieldCheck className="w-6 h-6 text-[#00A86B]" />
              <h4 className="text-xl font-semibold text-gray-900">10K+</h4>
              <p className="text-sm text-gray-500">Verified Lawyers</p>
            </div>
            <div className="flex flex-col items-start space-y-1">
              <Users className="w-6 h-6 text-[#00A86B]" />
              <h4 className="text-xl font-semibold text-gray-900">50K+</h4>
              <p className="text-sm text-gray-500">Happy Clients</p>
            </div>
            <div className="flex flex-col items-start space-y-1">
              <Briefcase className="w-6 h-6 text-[#00A86B]" />
              <h4 className="text-xl font-semibold text-gray-900">98%</h4>
              <p className="text-sm text-gray-500">Success Rate</p>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative w-full h-[420px]">
          <div className="absolute inset-0 rounded-[60px] overflow-hidden shadow-2xl">
            <Image
              src="/lawyers.png" // Place your image in public/
              alt="Lawyers team"
              fill
              className="object-cover"
              // style={{
              //   clipPath:
              //     "polygon(0 0, 100% 0, 100% 80%, 0% 100%)", // curved bottom effect
              // }}
            />
          </div>
          {/* Glow Outline */}
          <div className="absolute inset-0 rounded-[60px] border border-[#00A86B]/20" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
