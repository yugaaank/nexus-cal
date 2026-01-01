"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Activity,
  Layers,
  TrendingUp,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NexusCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scores, setScores] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("nexus_scores");
    if (saved) setScores(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("nexus_scores", JSON.stringify(scores));
  }, [scores]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

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
      if (next[key] === val) delete next[key];
      else next[key] = val;
      return next;
    });
  };

  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(currentDate);

  return (
    <div className="h-screen w-screen bg-[#050505] text-white overflow-hidden pb-6">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-32 -left-32 w-[45%] h-[45%] bg-cyan-500/10 blur-[140px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-32 -right-32 w-[45%] h-[45%] bg-blue-600/10 blur-[140px] rounded-full"
        />
      </div>

      <div className="relative h-full px-10 pt-6 pb-10">
        {/* Header */}
        <header className="flex justify-between items-end mb-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-400 mb-1">
              Temporal Log v4.0
            </div>
            <h1 className="text-4xl font-light tracking-tight">
              {monthName}{" "}
              <span className="text-zinc-500 text-xl">{year}</span>
            </h1>
          </div>

          <div className="flex gap-4">
            <StatCard label="Year" value={stats.year} icon={<Activity size={14} />} />
            <StatCard label="Quarter" value={stats.quarter} icon={<Layers size={14} />} />
            <StatCard label="Month" value={stats.month} icon={<TrendingUp size={14} />} accent />
          </div>
        </header>

        {/* Main layout */}
        <div className="grid grid-cols-12 gap-6 h-[calc(100%-72px)]">
          {/* Calendar */}
          <div className="col-span-10 bg-zinc-900/60 rounded-3xl p-6 border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
            <div className="flex justify-between mb-4">
              <div className="flex gap-2">
                <NavButton onClick={prevMonth} icon={<ChevronLeft size={18} />} />
                <NavButton onClick={nextMonth} icon={<ChevronRight size={18} />} />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-zinc-400">
                System Synchronized
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${month}-${year}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="grid grid-cols-7 gap-y-6 gap-x-2"
              >
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div
                    key={d}
                    className="text-[10px] text-zinc-400 uppercase tracking-wider text-center"
                  >
                    {d}
                  </div>
                ))}

                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`pad-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const key = `${year}-${month + 1}-${day}`;
                  return (
                    <DayCell
                      key={key}
                      index={i}
                      day={day}
                      score={scores[key] || 0}
                      onSelect={(v) => toggleScore(key, v)}
                    />
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="col-span-2 space-y-4">
            <div className="bg-zinc-900/60 rounded-3xl p-5 border border-white/10">
              <h3 className="text-[10px] uppercase tracking-widest text-zinc-400 mb-3 flex gap-2">
                <Info size={14} /> Intelligence
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                +1 = high output  
                <br />-1 = regression
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/15 to-blue-600/15 rounded-3xl p-5 border border-cyan-500/30">
              <h3 className="text-[10px] uppercase tracking-widest text-cyan-400 mb-2">
                Focus Goal
              </h3>
              <div className="text-2xl font-light text-white">+40</div>
              <div className="text-[9px] text-zinc-400 uppercase">
                Annual Target
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Components ---------- */

const StatCard = ({ label, value, icon, accent }) => (
  <div
    className={`p-3 rounded-2xl border min-w-[110px] ${
      accent ? "bg-white/5 border-white/15" : "border-white/10"
    }`}
  >
    <div className="flex gap-2 text-[10px] text-zinc-400 mb-1">
      {icon} {label}
    </div>
    <div
      className={`text-xl ${
        value > 0
          ? "text-cyan-400"
          : value < 0
          ? "text-rose-500"
          : "text-white"
      }`}
    >
      {value > 0 ? `+${value}` : value}
    </div>
  </div>
);

const NavButton = ({ onClick, icon }) => (
  <button
    onClick={onClick}
    className="p-2 rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10"
  >
    {icon}
  </button>
);

const DayCell = ({ day, score, onSelect, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.008 }}
    className="flex flex-col items-center relative"
  >
    <span className="text-[10px] text-zinc-400 mb-1">
      {day.toString().padStart(2, "0")}
    </span>
    <div className="flex flex-col gap-1 p-1 rounded-xl border border-white/10 bg-white/[0.05] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
      <ScoreButton label="+1" active={score === 1} color="bg-cyan-500" onClick={() => onSelect(1)} />
      <ScoreButton label="0" active={score === 0} onClick={() => onSelect(0)} />
      <ScoreButton label="-1" active={score === -1} color="bg-rose-500" onClick={() => onSelect(-1)} />
    </div>
    <AnimatePresence>
      {score !== 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className={`absolute -bottom-2 w-1 h-1 rounded-full ${
            score === 1 ? "bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"
          }`}
        />
      )}
    </AnimatePresence>
  </motion.div>
);

const ScoreButton = ({ label, active, onClick, color }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={`w-8 h-6 rounded-lg text-[9px] font-bold ${
      active
        ? `${color} text-black shadow-[0_0_12px_rgba(34,211,238,0.35)]`
        : "text-zinc-300 hover:bg-white/10"
    }`}
  >
    {label}
  </motion.button>
);

export default NexusCalendar;
