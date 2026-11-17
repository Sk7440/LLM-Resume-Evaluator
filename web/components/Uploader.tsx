"use client";
import { FileText, Upload, X } from "lucide-react";
import { useState } from "react";

export function Uploader({ file, onFile }: { file: File | null; onFile: (file: File | null) => void }) {
  const [validationError, setValidationError] = useState("");
  const select = (candidate?: File) => {
    if (!candidate) return;
    const validType = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(candidate.type) ||
      candidate.name.toLowerCase().endsWith(".pdf") ||
      candidate.name.toLowerCase().endsWith(".docx");
    if (!validType) {
      setValidationError("Unsupported file. Upload a PDF or DOCX resume.");
      return;
    }
    if (candidate.size > 5 * 1024 * 1024) {
      setValidationError("This file is larger than 5 MB. Choose a smaller resume.");
      return;
    }
    setValidationError("");
    onFile(candidate);
  };
  return <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">Resume file</label>
    {file ? <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex items-center gap-3"><FileText className="text-emerald-600" size={20} /><div><p className="text-sm font-semibold">{file.name}</p><p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p></div></div>
      <button type="button" aria-label="Remove resume" onClick={() => onFile(null)} className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-slate-800"><X size={18} /></button>
    </div> : <label onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); select(event.dataTransfer.files[0]); }} className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-emerald-400 hover:bg-emerald-50/40">
      <input className="sr-only" type="file" accept=".pdf,.docx" onChange={(event) => select(event.target.files?.[0])} />
      <span className="mb-3 rounded-full bg-white p-3 text-emerald-600 shadow-sm"><Upload size={20} /></span><span className="text-sm font-semibold">Drop your resume here or browse</span><span className="mt-1 text-xs text-slate-500">PDF or DOCX, up to 5 MB</span>
    </label>}
    {validationError && <p role="alert" className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{validationError}</p>}
  </div>;
}
