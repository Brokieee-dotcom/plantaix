import React, { useState } from 'react';
import { Video, Eye, Sun, Moon, Maximize2, Radio, Activity, RefreshCw } from 'lucide-react';
import { BOTANICAL_PRESETS } from '../types';

export const CCTVPage: React.FC = () => {
  const [nightVision, setNightVision] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<number | null>(null);

  const feeds = [
    {
      id: 1,
      title: 'Chamber Alpha — Control Baseline',
      location: 'Enclosure A-101',
      temp: '22.4°C',
      moisture: '64%',
      vpd: '0.94 kPa',
      status: 'Live Stream 1080p',
      fps: '30 FPS',
      img: BOTANICAL_PRESETS[0].url,
    },
    {
      id: 2,
      title: 'Chamber Beta — Water Deficit Cohort',
      location: 'Drought Enclosure B-204',
      temp: '24.1°C',
      moisture: '28%',
      vpd: '1.42 kPa',
      status: 'Live Stream 1080p',
      fps: '30 FPS',
      img: BOTANICAL_PRESETS[1].url,
    },
    {
      id: 3,
      title: 'Chamber Gamma — Thermal Stress Cohort',
      location: 'Thermal Enclosure C-302',
      temp: '33.8°C',
      moisture: '52%',
      vpd: '1.88 kPa',
      status: 'Live Stream 1080p',
      fps: '28 FPS',
      img: BOTANICAL_PRESETS[2].url,
    },
    {
      id: 4,
      title: 'Incubator Delta — Synergistic Stress',
      location: 'Micro-climate D-401',
      temp: '32.1°C',
      moisture: '24%',
      vpd: '1.95 kPa',
      status: 'Live Stream 1080p',
      fps: '30 FPS',
      img: BOTANICAL_PRESETS[3].url,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
              Chamber CCTV &amp; Optical Surveillance Grid
            </h2>
          </div>
          <p className="text-xs text-emerald-400/70 mt-0.5">
            Real-time visual monitoring of experimental growth chambers with environmental telemetry HUD
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNightVision(!nightVision)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition ${
              nightVision
                ? 'bg-emerald-500 text-black font-bold border-emerald-400'
                : 'bg-[#081811] text-emerald-300 border-emerald-500/30 hover:bg-[#0c261b]'
            }`}
          >
            {nightVision ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            <span>{nightVision ? 'IR Night Vision Active' : 'Daylight Spectrum'}</span>
          </button>
        </div>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {feeds.map((feed) => (
          <div
            key={feed.id}
            className="rounded-2xl bg-[#081811] border border-emerald-500/30 overflow-hidden shadow-2xl flex flex-col justify-between group"
          >
            {/* Top Bar of CCTV Feed */}
            <div className="p-3 bg-[#06120d] border-b border-emerald-500/15 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                </span>
                <span className="font-bold text-white truncate max-w-[200px]">{feed.title}</span>
              </div>
              <span className="text-emerald-400 text-[10px]">{feed.location}</span>
            </div>

            {/* Video Feed Viewport */}
            <div className={`relative aspect-video overflow-hidden ${nightVision ? 'contrast-125 filter hue-rotate-90 brightness-90' : ''}`}>
              <img
                src={feed.img}
                alt={feed.title}
                className="w-full h-full object-cover group-hover:scale-102 transition duration-700"
              />

              {/* HUD Telemetry Overlay */}
              <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between bg-gradient-to-t from-black/80 via-transparent to-black/60">
                <div className="flex justify-between items-start text-[10px] font-mono text-emerald-300">
                  <div className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-emerald-500/20">
                    REC [●] {new Date().toLocaleTimeString()}
                  </div>
                  <div className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-emerald-500/20 text-cyan-300">
                    {feed.fps} | 1080P
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30">
                  <span className="text-amber-300">T: {feed.temp}</span>
                  <span className="text-cyan-300">Moist: {feed.moisture}</span>
                  <span className="text-emerald-300">VPD: {feed.vpd}</span>
                </div>
              </div>
            </div>

            {/* Bottom Stream Info */}
            <div className="p-2.5 bg-[#06120d] border-t border-emerald-500/15 flex items-center justify-between text-[11px] font-mono text-emerald-400/70">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Optical Stream Secure (H.264 WebRTC)
              </span>
              <span className="text-emerald-300">Signal: 98%</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
