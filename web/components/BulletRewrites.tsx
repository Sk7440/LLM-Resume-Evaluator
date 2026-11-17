"use client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import type { MatchResult } from "../lib/api";
export function BulletRewrites({ rewrites }: { rewrites: MatchResult["bullet_rewrites"] }) {
  const [copied, setCopied] = useState<number | null>(null);
  const copy = async (text: string, index: number) => { await navigator.clipboard.writeText(text); setCopied(index); window.setTimeout(() => setCopied(null), 1500); };
  return <section><div className="mb-4 flex items-end justify-between"><div><h2 className="text-xl font-bold">Bullet point rewriter</h2><p className="mt-1 text-sm text-slate-500">Sharper language that stays faithful to your experience.</p></div></div><div className="grid gap-4">{rewrites.map((rewrite, index) => <div key={`${rewrite.original}-${index}`} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 md:grid-cols-2"><div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Before</p><p className="text-sm leading-6 text-slate-600">{rewrite.original}</p></div><div><div className="mb-2 flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">After</p><button onClick={() => copy(rewrite.improved, index)} className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900">{copied === index ? <Check size={14} /> : <Copy size={14} />}{copied === index ? "Copied" : "Copy"}</button></div><p className="text-sm font-medium leading-6 text-slate-800">{rewrite.improved}</p><p className="mt-3 text-xs leading-5 text-slate-500">{rewrite.reason}</p></div></div>)}</div></section>;
}
