"use client";
if (typeof window !== 'undefined' && !window.hasOwnProperty('GPUShaderStage')) {
  (window as any).GPUShaderStage = { VERTEX: 1, FRAGMENT: 2, COMPUTE: 4 };
}
import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full bg-black flex items-center justify-center text-white">
      Loading world...
    </div>
  ),
});


const arcsData = [
  { startLat: 37.7749, startLng: -122.4194, endLat: 51.5074, endLng: -0.1278, color: "#00f2ff" },
  { startLat: 40.7128, startLng: -74.0060, endLat: 48.8566, endLng: 2.3522, color: "#7c3aed" },
  { startLat: 28.6139, startLng: 77.2090, endLat: 35.6895, endLng: 139.6917, color: "#3b82f6" },
  { startLat: -33.8688, startLng: 151.2093, endLat: 1.3521, endLng: 103.8198, color: "#00f2ff" },
  { startLat: -23.5505, startLng: -46.6333, endLat: 34.0522, endLng: -118.2437, color: "#7c3aed" },
  // 🔹 Europe
  { startLat: 52.5200, startLng: 13.4050, endLat: 41.9028, endLng: 12.4964, color: "#22d3ee" },
  { startLat: 48.8566, startLng: 2.3522, endLat: 40.4168, endLng: -3.7038, color: "#6366f1" },

  // 🔹 Middle East
  { startLat: 25.2048, startLng: 55.2708, endLat: 24.7136, endLng: 46.6753, color: "#38bdf8" },
  { startLat: 31.7683, startLng: 35.2137, endLat: 30.0444, endLng: 31.2357, color: "#7c3aed" },
  { startLat: 19.0760, startLng: 72.8777, endLat: 1.3521, endLng: 103.8198, color: "#00f2ff" },
  { startLat: 13.7563, startLng: 100.5018, endLat: 35.6895, endLng: 139.6917, color: "#3b82f6" },
  { startLat: 37.5665, startLng: 126.9780, endLat: 22.3193, endLng: 114.1694, color: "#22d3ee" },

  // 🔹 Africa
  { startLat: -1.2921, startLng: 36.8219, endLat: -26.2041, endLng: 28.0473, color: "#6366f1" },
  { startLat: 30.0444, startLng: 31.2357, endLat: 6.5244, endLng: 3.3792, color: "#7c3aed" },

  // 🔹 North America
  { startLat: 49.2827, startLng: -123.1207, endLat: 34.0522, endLng: -118.2437, color: "#00f2ff" },
  { startLat: 41.8781, startLng: -87.6298, endLat: 29.7604, endLng: -95.3698, color: "#38bdf8" },

];

export default function MyGlobe() {
  const router = useRouter()
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);





  return (
    <section className="relative w-full py-20 overflow-hidden">

      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#021b1a] via-[#041f2a] to-[#020815] z-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 z-10">

        <motion.div
          className="relative w-full lg:w-1/2 aspect-square max-w-xl"
          initial={{ y: 200, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        >

          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.35),transparent_65%)] blur-3xl opacity-60" />

          <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
            {dimensions.width > 0 && (
              <Globe
                ref={globeRef}
                width={dimensions.width}
                height={dimensions.height}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundColor="rgba(0,0,0,0)"
                atmosphereColor="#4ade80"
                atmosphereAltitude={0.18}
                arcsData={arcsData}
                arcColor={(d: any) => d.color}
                arcDashLength={0.4}
                arcDashGap={2}
                arcDashAnimateTime={2000}
                onGlobeReady={() => {
                  if (globeRef.current) {
                    const controls = globeRef.current.controls();
                    controls.autoRotate = true;
                    controls.autoRotateSpeed = 0.5;
                    controls.enableZoom = false;
                    globeRef.current.pointOfView({ lat: 10, lng: 0, altitude: 2.5 }, 0);
                  }
                }}
              />
            )}
          </div>
        </motion.div>


        <motion.div
          className="w-full lg:w-1/2 text-left text-slate-50"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <p className="uppercase tracking-[0.25em] text-xs text-teal-300 mb-3">
            Global legal network
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Reach trusted lawyers
            <br />
            <span className="text-teal-300">everywhere in the world.</span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 mb-6 max-w-xl">
            Your clients and cases are not limited to one city. Our platform connects you with verified,
            highly rated lawyers across regions and practice areas, so you always find the right expert
            — in the right place and the right time zone.
          </p>
          <p className="text-sm md:text-base text-slate-400 mb-8 max-w-xl">
            From quick questions to complex disputes, clients can access legal help in minutes, and
            lawyers can grow a trusted presence beyond local borders.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button onClick={() => router.push('/user/lawyers')} className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold px-6 py-3 rounded-lg shadow-lg shadow-teal-500/40 transition-all">
              Find a lawyer
            </button>
            <span className="text-xs md:text-sm text-slate-400">
              Available 24/7 in major cities and growing every day.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}