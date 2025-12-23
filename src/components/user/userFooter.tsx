"use client";

import React from "react";
import { Phone, Info, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const UserFooter: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Our services */}
          <div>
            <h3 className="text-lg font-semibold text-teal-700 mb-4">
              Our services
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>Family law</li>
              <li>Immigration law</li>
              <li>Business & contracts</li>
              <li>Real estate disputes</li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-teal-700 mb-4">
              About
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>About us</li>
              <li>Our legal team</li>
              <li>How we price</li>
              <li>Our pro bono work</li>
              <li>Reviews</li>
              <li>Refund policy</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-teal-700 mb-4">
              Resources
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>Legal insights blog</li>
              <li>Guides & templates</li>
              <li>Join our attorney network</li>
            </ul>
          </div>

          {/* Client support */}
          <div>
            <h3 className="text-lg font-semibold text-teal-700 mb-4">
              Client support
            </h3>

            <div className="space-y-3 text-sm text-slate-700 mb-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-50">
                  <Info className="h-4 w-4 text-teal-600" />
                </span>
                <span>Help Center</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-50">
                  <Phone className="h-4 w-4 text-teal-600" />
                </span>
                <span>(866) 228-5777</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                <Facebook className="h-4 w-4" />
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                <Instagram className="h-4 w-4" />
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                <Twitter className="h-4 w-4" />
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                <Linkedin className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-400 flex flex-col sm:flex-row justify-between gap-3">
          <p>© {new Date().getFullYear()} Lawyer. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;

