'use client'
import React, { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Rocket,
  Flame,
  Plus,
  Minus,
  Trophy,
  Activity,
  PartyPopper,
  Sparkles,
  Target,
  CalendarDays,
  BarChart3,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scores, setScores] = useState({});

  // Persistence (Local Storage)
  useEffect(() => {
    const saved = localStorage.getItem("pop_pulse_scores");
    if (saved) {
      try {
        setScores(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load scores", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("pop_pulse_scores", JSON.stringify(scores));
  }, [scores]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Weekly Info Calculations
  const weeklyStats = useMemo(() => {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    let weekSum = 0;
    Object.entries(scores).forEach(([dateStr, val]) => {
      const d = new Date(dateStr);
      if (d >= startOfWeek && d <= endOfWeek) {
        weekSum += val;
      }
    });
    return weekSum;
  }, [scores]);

  const stats = useMemo(() => {
    const all = Object.entries(scores);
    const sum = (fn) =>
      all.filter(([k]) => fn(new Date(k))).reduce((s, [, v]) => s + v, 0);

    return {
      year: sum((d) => d.getFullYear() === year),
      month: sum((d) => d.getFullYear() === year && d.getMonth() === month),
      quarter: sum((d) => {
        const q = Math.floor(d.getMonth() / 3);
        return d.getFullYear() === year && q === Math.floor(month / 3);
      }),
    };
  }, [scores, year, month]);

  const toggleScore = (key, val) => {
    setScores((prev) => {
      const next = { ...prev };
      if (next[key] === val) {
        delete next[key];
      } else {
        next[key] = val;
      }
      return next;
    });
  };

  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(currentDate);

  return (
    <div className="min-h-screen w-full bg-[#FFDE59] text-black font-mono selection:bg-pink-400 selection:text-white relative overflow-x-hidden">
      {/* Dynamic Mesh Background */}
      <div className="fixed inset-0 pointer-events-none opacity-40 overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[80%] md:w-[40%] h-[40%] rounded-full bg-[#FF6AC1] blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] md:w-[40%] h-[40%] rounded-full bg-[#38B6FF] blur-[80px] md:blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[60%] md:w-[30%] h-[30%] rounded-full bg-[#7ED957] blur-[70px] md:blur-[100px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className="max-w-[1800px] mx-auto w-full flex flex-col relative z-10 p-4 sm:p-6 md:p-8">
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 md:mb-10 gap-6">
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-2 w-full lg:w-auto"
          >
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="bg-black p-1.5 md:p-2 shadow-[3px_3px_0px_0px_rgba(255,106,193,1)]"
              >
                <Zap className="text-yellow-300" size={24} />
              </motion.div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tighter uppercase drop-shadow-[2px_2px_0px_rgba(255,255,255,1)] md:drop-shadow-[4px_4px_0px_rgba(255,255,255,1)]">
                {monthName}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-black text-white px-2 py-0.5 md:px-3 md:py-1 text-lg md:text-xl font-bold -rotate-1 shadow-[3px_3px_0px_0px_rgba(56,182,255,1)]">
                {year}
              </span>
              <button 
                onClick={goToToday}
                className="ml-2 font-black text-[10px] md:text-xs uppercase bg-white border-2 border-black px-2 py-0.5 hover:bg-black hover:text-white transition-colors flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
              >
                <CalendarDays size={14} /> Today
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 w-full lg:w-auto">
            <StatPill label="WEEKLY" value={weeklyStats} color="bg-[#CB6CE6]" icon={<BarChart3 size={16} />} index={-1} />
            <StatPill label="MONTHLY" value={stats.month} color="bg-[#5271FF]" icon={<Flame size={16} />} index={0} />
            <StatPill label="YEARLY" value={stats.year} color="bg-[#FF5757]" icon={<Trophy size={16} />} index={1} />
            <StatPill label="QUARTER" value={stats.quarter} color="bg-[#7ED957]" icon={<Rocket size={16} />} index={2} />
          </div>
        </header>

        {/* Layout Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:items-start">
          
          {/* Main Calendar Card */}
          <main className="lg:col-span-8 xl:col-span-9 bg-white border-[4px] md:border-[6px] border-black p-3 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rounded-none relative flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex bg-black p-1 shadow-[3px_3px_0px_0px_rgba(255,145,77,1)]">
                  <NavBtn onClick={prevMonth} icon={<ChevronLeft size={24} />} />
                  <div className="w-[1px] bg-white/20 mx-1" />
                  <NavBtn onClick={nextMonth} icon={<ChevronRight size={24} />} />
                </div>
                <div className="hidden sm:block h-8 w-[2px] bg-black/10 mx-1 md:mx-2" />
                <h2 className="font-black text-lg md:text-2xl uppercase tracking-tighter italic">Vibe Check Grid</h2>
              </div>
              
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full sm:w-auto text-center font-black text-xs md:text-sm lg:text-base uppercase tracking-widest bg-[#7ED957] border-[2px] md:border-[3px] border-black px-4 md:px-6 py-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                Pulse: ACTIVE ⚡
              </motion.div>
            </div>

            {/* Calendar Grid Container with horizontal scroll fallback for tiny screens */}
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[320px] grid grid-cols-7 gap-1.5 md:gap-3">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                  <div key={d} className="text-center font-black text-[9px] md:text-sm text-black/30 pb-1 md:pb-2">
                    {d}
                  </div>
                ))}

                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`pad-${i}`} className="bg-black/[0.03] border-[1px] md:border-[2px] border-dashed border-black/10 aspect-square md:aspect-auto md:h-24 lg:h-32 w-full" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${year}-${month + 1}-${day}`;
                  const isToday = isCurrentMonth && today.getDate() === day;
                  return (
                    <DaySquare
                      key={dateStr}
                      day={day}
                      isToday={isToday}
                      score={scores[dateStr] || 0}
                      onSelect={(v) => toggleScore(dateStr, v)}
                    />
                  );
                })}
              </div>
            </div>
          </main>

          {/* Sidebar Area */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-4 md:space-y-6 flex flex-col">
            {/* Legend Card */}
            <motion.div 
              whileHover={{ rotate: -0.5 }}
              className="bg-[#CB6CE6] border-[4px] md:border-[6px] border-black p-4 md:p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
            >
              <h3 className="font-black text-xl md:text-2xl mb-4 flex items-center gap-3 text-white uppercase italic drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <PartyPopper size={24} className="shrink-0" /> The Rules
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4 lg:gap-3">
                <LegendItem color="bg-[#7ED957]" label="CRUSHED" sub="+1 Points" />
                <LegendItem color="bg-white" label="NEUTRAL" sub="0 Points" />
                <LegendItem color="bg-[#FF5757]" label="FALL OFF" sub="-1 Points" />
              </div>
            </motion.div>

            {/* Weekly Info Card */}
            <div className="bg-black border-[4px] md:border-[6px] border-[#7ED957] p-4 md:p-5 shadow-[6px_6px_0px_0px_rgba(126,217,87,0.3)]">
               <div className="flex justify-between items-center mb-2">
                 <h4 className="font-black text-[10px] md:text-xs text-[#7ED957] uppercase tracking-widest flex items-center gap-2">
                   <Activity size={14} /> Weekly Pulse
                 </h4>
                 <span className="text-[10px] text-white/40 font-bold uppercase">Current</span>
               </div>
               <div className="flex items-baseline gap-2">
                 <div className={`text-3xl md:text-4xl font-black italic ${weeklyStats >= 0 ? 'text-[#7ED957]' : 'text-[#FF5757]'}`}>
                   {weeklyStats > 0 ? `+${weeklyStats}` : weeklyStats}
                 </div>
                 <div className="text-[10px] font-black text-white/60 uppercase">Total Score</div>
               </div>
               <div className="mt-3 w-full bg-white/10 h-2 border border-white/20 overflow-hidden">
                 <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(0, (weeklyStats / 7) * 100))}%` }}
                  className="h-full bg-[#7ED957]" 
                 />
               </div>
            </div>

            {/* Target Card */}
            <div className="bg-[#38B6FF] border-[4px] md:border-[6px] border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[160px] md:min-h-[200px]">
              <div className="absolute -top-6 -right-6 opacity-10 pointer-events-none">
                <Target size={120} />
              </div>
              
              <div className="relative z-10">
                <div className="font-black text-[10px] md:text-sm uppercase tracking-[0.3em] mb-1 text-black/60">Annual Target</div>
                <div className="text-6xl md:text-8xl font-black text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] italic">
                  +40
                </div>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-black text-[#FFDE59] text-[10px] md:text-xs font-black uppercase tracking-widest -rotate-2">
                  <Sparkles size={14} /> KEEP THE GRIND
                </div>
              </div>
            </div>

            {/* Info Footer */}
            <div className="p-4 md:p-5 border-[4px] md:border-[6px] border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hidden lg:block">
               <div className="flex items-center gap-4 mb-2">
                 <div className="bg-[#FF5757] p-2 border-2 border-black">
                   <Info className="text-white" size={20} />
                 </div>
                 <div className="font-black text-[10px] uppercase leading-tight">
                   Neuro-Plasticity <br/>Synchronization
                 </div>
               </div>
               <p className="text-[9px] font-bold text-black/40 uppercase leading-none mt-4 border-t-2 border-black/5 pt-4">
                 Pulse Tracking Alpha v1.2
               </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

/* --- UI COMPONENTS --- */

const LegendItem = ({ color, label, sub }) => (
  <div className="flex items-center lg:items-center gap-2 md:gap-3">
    <div className={`w-8 h-8 md:w-10 md:h-10 shrink-0 ${color} border-[2px] md:border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black text-xs md:text-base`}>
      {label[0]}
    </div>
    <div className="flex flex-col">
      <div className="font-black text-[10px] md:text-xs text-white uppercase leading-none mb-0.5">{label}</div>
      <div className="font-bold text-[8px] md:text-[10px] text-white/60 uppercase leading-none">{sub}</div>
    </div>
  </div>
);

const StatPill = ({ label, value, icon, color, index }) => (
  <motion.div
    initial={{ y: 15, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: index * 0.05 }}
    className={`${color} border-[3px] md:border-[4px] border-black p-2.5 md:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center items-start overflow-hidden`}
  >
    <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black uppercase text-black/40 mb-1">
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
    <div className="text-2xl md:text-4xl font-black text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] leading-none italic">
      {value > 0 ? `+${value}` : value}
    </div>
  </motion.div>
);

const NavBtn = ({ onClick, icon }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="p-1.5 md:p-2 text-white hover:text-yellow-300 transition-colors"
  >
    {icon}
  </motion.button>
);

const DaySquare = ({ day, score, onSelect, isToday }) => {
  return (
    <div className="flex flex-col items-center w-full group">
      <span className={`text-[10px] md:text-[11px] font-black mb-1 transition-colors ${isToday ? 'text-black bg-[#38B6FF] px-1.5 md:px-2 border-2 border-black rotate-3 z-10' : 'text-black/30 group-hover:text-black'}`}>
        {day.toString().padStart(2, "0")}
      </span>
      <div className={`w-full aspect-square md:aspect-auto md:h-24 lg:h-28 border-[2px] md:border-[4px] border-black transition-all flex flex-col p-1
        ${score === 1 ? 'bg-[#7ED957] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 
          score === -1 ? 'bg-[#FF5757] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 
          'bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)] hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}
      `}>
        <div className="flex flex-row md:flex-col gap-1 h-full w-full">
          <ActionButton 
            active={score === 1} 
            color="bg-black" 
            onClick={() => onSelect(1)}
            icon={<Plus className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />}
          />
          <ActionButton 
            active={score === -1} 
            color="bg-black" 
            onClick={() => onSelect(-1)}
            icon={<Minus className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />}
          />
        </div>
      </div>
      <div className="h-6 md:h-7 mt-1 flex items-start">
        <AnimatePresence>
          {score !== 0 && (
            <motion.div
              initial={{ scale: 0, y: 5 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0 }}
              className={`font-black text-[8px] md:text-[10px] px-1 md:px-2 py-0.5 border-[2px] md:border-[3px] border-black leading-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
                ${score === 1 ? 'bg-[#7ED957] rotate-2' : 'bg-[#FF5757] -rotate-2 text-white'}`}
            >
              {score > 0 ? 'WIN' : 'FAIL'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ActionButton = ({ active, onClick, color, icon }) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={(e) => {
        e.stopPropagation();
        onClick();
    }}
    className={`flex-1 w-full border-[1px] md:border-[2px] border-black flex items-center justify-center transition-all touch-manipulation
      ${active ? `${color} text-white` : "bg-white/40 hover:bg-white text-black/20 hover:text-black"}
    `}
  >
    <div className={active ? "scale-110 md:scale-125 font-black" : "scale-100"}>
      {icon}
    </div>
  </motion.button>
);

export default App;