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
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PopPulseCalendar = () => {
  // Always initialize to the current date/month
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scores, setScores] = useState({});

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem("pop_pulse_scores");
    if (saved) setScores(JSON.parse(saved));
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
    <div className="h-screen w-screen bg-[#FFDE59] text-black font-mono p-6 selection:bg-pink-400 selection:text-white overflow-hidden flex flex-col relative">
      {/* Dynamic Mesh Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#FF6AC1] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#38B6FF] blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-[#7ED957] blur-[100px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className="max-w-[1800px] mx-auto w-full h-full flex flex-col relative z-10">
        {/* Header Section */}
        <header className="flex flex-row justify-between items-end mb-8 shrink-0">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="bg-black p-2 shadow-[4px_4px_0px_0px_rgba(255,106,193,1)]"
              >
                <Zap className="text-yellow-300" size={32} />
              </motion.div>
              <h1 className="text-6xl font-black italic tracking-tighter uppercase drop-shadow-[4px_4px_0px_rgba(255,255,255,1)]">
                {monthName}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-black text-white px-3 py-1 text-xl font-bold -rotate-1 shadow-[4px_4px_0px_0px_rgba(56,182,255,1)]">
                {year}
              </span>
              <button 
                onClick={goToToday}
                className="ml-2 font-black text-xs uppercase bg-white border-2 border-black px-2 py-0.5 hover:bg-black hover:text-white transition-colors flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
              >
                <CalendarDays size={14} /> Today
              </button>
            </div>
          </motion.div>

          <div className="flex gap-6">
            <StatPill label="WEEKLY" value={weeklyStats} color="bg-[#CB6CE6]" icon={<BarChart3 size={20} />} index={-1} />
            <StatPill label="MONTHLY" value={stats.month} color="bg-[#5271FF]" icon={<Flame size={20} />} index={0} />
            <StatPill label="YEARLY" value={stats.year} color="bg-[#FF5757]" icon={<Trophy size={20} />} index={1} />
            <StatPill label="QUARTER" value={stats.quarter} color="bg-[#7ED957]" icon={<Rocket size={20} />} index={2} />
          </div>
        </header>

        {/* Layout Content */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Calendar Card */}
          <div className="lg:col-span-9 bg-white border-[6px] border-black p-6 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rounded-none relative flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex bg-black p-1 shadow-[4px_4px_0px_0px_rgba(255,145,77,1)]">
                  <NavBtn onClick={prevMonth} icon={<ChevronLeft size={28} />} />
                  <div className="w-[2px] bg-white/20 mx-1" />
                  <NavBtn onClick={nextMonth} icon={<ChevronRight size={28} />} />
                </div>
                <div className="h-10 w-[2px] bg-black/10 mx-2" />
                <h2 className="font-black text-2xl uppercase tracking-tighter italic">Vibe Check Grid</h2>
              </div>
              
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="font-black text-lg uppercase tracking-widest bg-[#7ED957] border-[3px] border-black px-6 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Pulse: ACTIVE ⚡
              </motion.div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-[auto_repeat(6,1fr)] gap-3 min-h-0">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                <div key={d} className="text-center font-black text-sm text-black/30 pb-2">
                  {d}
                </div>
              ))}

              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`pad-${i}`} className="bg-black/[0.03] border-[2px] border-dashed border-black/10 h-full w-full" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const key = `${year}-${month + 1}-${day}`;
                const isToday = isCurrentMonth && today.getDate() === day;
                return (
                  <DaySquare
                    key={key}
                    day={day}
                    isToday={isToday}
                    score={scores[key] || 0}
                    onSelect={(v) => toggleScore(key, v)}
                  />
                );
              })}
            </div>
          </div>

          {/* Sidebar Area */}
          <aside className="lg:col-span-3 space-y-6 flex flex-col h-full overflow-hidden">
            {/* Legend Card */}
            <motion.div 
              whileHover={{ rotate: -1, scale: 1.02 }}
              className="bg-[#CB6CE6] border-[6px] border-black p-5 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] shrink-0"
            >
              <h3 className="font-black text-2xl mb-4 flex items-center gap-3 text-white uppercase italic drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <PartyPopper size={28} /> The Rules
              </h3>
              <div className="space-y-3">
                <LegendItem color="bg-[#7ED957]" label="CRUSHED IT" sub="+1 Points" />
                <LegendItem color="bg-white" label="NEUTRAL" sub="0 Points" />
                <LegendItem color="bg-[#FF5757]" label="REGRESSION" sub="-1 Points" />
              </div>
            </motion.div>

            {/* Weekly Info Card (NEW) */}
            <div className="bg-black border-[6px] border-[#7ED957] p-5 shadow-[10px_10px_0px_0px_rgba(126,217,87,0.3)] shrink-0">
               <div className="flex justify-between items-center mb-2">
                 <h4 className="font-black text-xs text-[#7ED957] uppercase tracking-widest flex items-center gap-2">
                   <Activity size={14} /> Weekly Pulse
                 </h4>
                 <span className="text-[10px] text-white/40 font-bold uppercase">Current Week</span>
               </div>
               <div className="flex items-baseline gap-2">
                 <div className={`text-4xl font-black italic ${weeklyStats >= 0 ? 'text-[#7ED957]' : 'text-[#FF5757]'}`}>
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
            <div className="bg-[#38B6FF] border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity"
              >
                <Target size={200} />
              </motion.div>
              
              <div className="relative z-10">
                <div className="font-black text-sm uppercase tracking-[0.3em] mb-2 text-black/60">Annual Target</div>
                <div className="text-8xl font-black text-white drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] italic">
                  +40
                </div>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-black text-[#FFDE59] text-xs font-black uppercase tracking-widest -rotate-2">
                  <Sparkles size={14} /> KEEP THE GRIND
                </div>
              </div>
            </div>

            {/* Info Footer */}
            <div className="p-5 border-[6px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] shrink-0">
               <div className="flex items-center gap-4 mb-2">
                 <div className="bg-[#FF5757] p-2 border-2 border-black">
                   <Activity className="text-white" size={24} />
                 </div>
                 <div className="font-black text-xs uppercase leading-tight">
                   Neuro-Plasticity <br/>Synchronization
                 </div>
               </div>
               <p className="text-[10px] font-bold text-black/50 uppercase leading-none mt-4 border-t-2 border-black/5 pt-4">
                 Tracking since {year}
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
  <div className="flex items-center gap-3">
    <div className={`w-10 h-10 ${color} border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black`}>
      {label[0]}
    </div>
    <div className="flex flex-col">
      <div className="font-black text-xs text-white uppercase">{label}</div>
      <div className="font-bold text-[10px] text-white/60 uppercase">{sub}</div>
    </div>
  </div>
);

const StatPill = ({ label, value, icon, color, index }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -8, rotate: index % 2 === 0 ? 2 : -2 }}
    className={`${color} border-[4px] border-black p-4 min-w-[150px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group cursor-default`}
  >
    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-black/40 mb-1 group-hover:text-black transition-colors">
      {icon} {label}
    </div>
    <div className="text-4xl font-black text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] leading-none italic">
      {value > 0 ? `+${value}` : value}
    </div>
  </motion.div>
);

const NavBtn = ({ onClick, icon }) => (
  <motion.button
    whileHover={{ scale: 1.2 }}
    whileTap={{ scale: 0.8 }}
    onClick={onClick}
    className="p-2 text-white hover:text-yellow-300 transition-colors"
  >
    {icon}
  </motion.button>
);

const DaySquare = ({ day, score, onSelect, isToday }) => {
  return (
    <div className="flex flex-col items-center h-full w-full group">
      <span className={`text-[11px] font-black mb-1 transition-colors ${isToday ? 'text-black bg-yellow-300 px-2 border-2 border-black rotate-3 z-10' : 'text-black/30 group-hover:text-black'}`}>
        {day.toString().padStart(2, "0")}
      </span>
      <div className={`flex-1 w-full border-[4px] border-black transition-all flex flex-col justify-center p-1
        ${score === 1 ? 'bg-[#7ED957] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 
          score === -1 ? 'bg-[#FF5757] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 
          'bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:bg-white hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'}
      `}>
        <div className="flex flex-col gap-1 h-full">
          <ActionButton 
            active={score === 1} 
            color="bg-black" 
            onClick={() => onSelect(1)}
            icon={<Plus size={18} />}
          />
          <ActionButton 
            active={score === -1} 
            color="bg-black" 
            onClick={() => onSelect(-1)}
            icon={<Minus size={18} />}
          />
        </div>
      </div>
      <div className="h-7 mt-1 flex items-start">
        <AnimatePresence>
          {score !== 0 && (
            <motion.div
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 10 }}
              className={`font-black text-[10px] px-2 py-0.5 border-[3px] border-black leading-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
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
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9, rotate: active ? 0 : 5 }}
    onClick={onClick}
    className={`flex-1 w-full border-[2px] border-black flex items-center justify-center transition-all
      ${active ? `${color} text-white` : "bg-white/40 hover:bg-white text-black/40 hover:text-black"}
    `}
  >
    <div className={active ? "scale-125 font-black" : "scale-100"}>
      {icon}
    </div>
  </motion.button>
);

export default PopPulseCalendar;