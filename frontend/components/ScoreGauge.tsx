"use client";
import { motion } from "framer-motion";
export function ScoreGauge({ score }: { score: number }) {
  const radius = 52; const circumference = 2 * Math.PI * radius;
  return <div className="relative h-36 w-36 shrink-0"><svg viewBox="0 0 128 128" className="-rotate-90"><circle cx="64" cy="64" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="10" /><motion.circle initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: circumference - (score / 100) * circumference }} transition={{ duration: 1 }} cx="64" cy="64" r={radius} fill="none" stroke="#10B981" strokeLinecap="round" strokeWidth="10" strokeDasharray={circumference} /></svg><div className="absolute inset-0 flex flex-col items-center justify-center"><strong className="text-4xl tracking-tight">{score}</strong><span className="text-xs font-medium text-slate-500">ATS score</span></div></div>;
}
