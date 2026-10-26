import React from 'react';
import {
  LayoutDashboard,
  Sprout,
  Activity,
  Scan,
  Bot,
  SplitSquareVertical,
  Video,
  FlaskConical,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export type PageId =
  | 'overview'
  | 'plants'
  | 'sensors'
  | 'scanner'
  | 'assistant'
  | 'imagelab'
  | 'cctv'
  | 'research'
  | 'settings';

interface NavigationProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenBriefing: () => void;
  specimenCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onSelectPage,
  isCollapsed,
  onToggleCollapse,
  onOpenBriefing,
  specimenCount,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'plants', label: 'Plant Registry', icon: Sprout, badge: specimenCount > 0 ? specimenCount : null },
    { id: 'sensors', label: 'Sensors & Telemetry', icon: Activity, badge: 'Live' },
    { id: 'scanner', label: 'AI Vision Scanner', icon: Scan, badge: 'AI' },
    { id: 'assistant', label: 'Dr. Xylem (AI Lab)', icon: Bot, badge: 'Smart' },
    { id: 'imagelab', label: 'Image Lab Compare', icon: SplitSquareVertical, badge: null },
    { id: 'cctv', label: 'CCTV Chamber Grid', icon: Video, badge: null },
    { id: 'research', label: 'Research Cohorts', icon: FlaskConical, badge: '4 Cohorts' },
    { id: 'settings', label: 'Calibration & Export', icon: Settings, badge: null },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-emerald-500/20 bg-[#06140e] transition-all duration-300 z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-18 px-4 border-b border-emerald-500/15 bg-[#05100b]">
        {!isCollapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-900/40 border border-emerald-400/40 shadow-lg shadow-emerald-500/10">
              <span className="text-emerald-400 font-extrabold text-lg tracking-wider">PX</span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-wider text-white">PLANT-X</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  BIO-AI
                </span>
              </div>
              <span className="text-[11px] text-emerald-400/70 truncate tracking-tight">Early-Warning Platform</span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="mx-auto relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-900/40 border border-emerald-400/40">
            <span className="text-emerald-400 font-extrabold text-base">PX</span>
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
        )}

        {/* Toggle Collapse Button */}
        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          className={`hidden md:flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 hover:text-white hover:bg-emerald-900/60 transition ${
            isCollapsed ? 'mx-auto mt-2' : ''
          }`}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Briefing Quick Action Banner */}
      {!isCollapsed && (
        <div className="p-3 mx-3 my-2 rounded-xl bg-gradient-to-r from-emerald-950/50 to-emerald-900/30 border border-emerald-500/25">
          <button
            onClick={onOpenBriefing}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition transform" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-emerald-200 group-hover:text-white transition">
                  Club Leader Briefing
                </span>
                <span className="text-[10px] text-emerald-400/70">Presentation notes &amp; pitch</span>
              </div>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
              Notes
            </span>
          </button>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 px-2.5 py-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id as PageId)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                  : 'text-emerald-300/70 hover:text-emerald-100 hover:bg-emerald-950/40'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon
                className={`w-4 h-4 transition-colors flex-shrink-0 ${
                  isActive ? 'text-emerald-400' : 'text-emerald-400/60 group-hover:text-emerald-300'
                }`}
              />

              {!isCollapsed && (
                <>
                  <span className="truncate flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                        item.badge === 'Live'
                          ? 'bg-emerald-500/20 text-emerald-300 animate-pulse'
                          : item.badge === 'AI' || item.badge === 'Smart'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-emerald-950/80 text-emerald-300/80 border border-emerald-500/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Engine Status Footer */}
      <div className="p-3 border-t border-emerald-500/15 bg-[#05110c]">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-xl bg-[#081b12] border border-emerald-500/20 space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between text-emerald-300/90 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                VPD Telemetry Engine
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                OK
              </span>
            </div>
            <p className="text-[10px] text-emerald-400/60 font-mono">Tetens Math Model: Active</p>
            <div className="flex items-center justify-between text-[10px] text-emerald-400/50 pt-1 border-t border-emerald-500/10">
              <span>GitHub Pages</span>
              <span className="text-emerald-300 font-mono">Branch Ready</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="flex h-2.5 w-2.5 relative" title="Engine Online">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
