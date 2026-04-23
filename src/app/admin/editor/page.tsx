"use client";
import { useState } from "react";
import { 
  Save, 
  Eye, 
  Edit3, 
  Layout, 
  Image as ImageIcon, 
  Plus,
  RefreshCcw,
  Check
} from "lucide-react";
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

export default function ContentEditor() {
  const [content, setContent] = useState("\\text{Cho hàm số } f(x) = x^2 + 2x. \\text{ Tính } f'(1).");
  const [explanation, setExplanation] = useState("f'(x) = 2x + 2 \\Rightarrow f'(1) = 4.");
  const [options, setOptions] = useState(["2", "4", "6", "0"]);
  const [correctIdx, setCorrectIdx] = useState(1);
  const [previewMode, setPreviewMode] = useState<"side-by-side" | "full-preview">("side-by-side");
  const [saving, setSaving] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Admin Header */}
      <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-2 rounded-lg">
             <Layout size={20} className="text-white" />
          </div>
          <h1 className="font-bold tracking-tight">CMS: Biên tập câu hỏi THPTQG</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 p-1 rounded-lg mr-4">
             <button 
              onClick={() => setPreviewMode("side-by-side")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${previewMode === "side-by-side" ? "bg-slate-700 text-white shadow-sm" : "text-slate-400"}`}>
               Song song
             </button>
             <button 
              onClick={() => setPreviewMode("full-preview")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${previewMode === "full-preview" ? "bg-slate-700 text-white shadow-sm" : "text-slate-400"}`}>
               Xem trước
             </button>
          </div>
          <button 
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all active:scale-95"
            onClick={() => { setSaving(true); setTimeout(() => setSaving(false), 2000); }}
          >
            {saving ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} />}
            Lưu câu hỏi
          </button>
        </div>
      </header>

      <div className={`flex-1 overflow-hidden grid ${previewMode === "side-by-side" ? "grid-cols-2" : "grid-cols-1"}`}>
        {/* Editor Column */}
        <section className={`flex flex-col border-r border-slate-800 ${previewMode === "full-preview" ? "hidden" : "block"}`}>
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* Question Content */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Edit3 size={14} /> Nội dung câu hỏi (LaTeX)
              </label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-40 bg-slate-800 border border-slate-700 rounded-xl p-4 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Nhập mã LaTeX..."
              />
            </div>

            {/* Options Grid */}
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Các tùy chọn đáp án</label>
              <div className="grid grid-cols-2 gap-4">
                {options.map((opt, idx) => (
                  <div key={idx} className={`relative flex items-center bg-slate-800 border rounded-xl overflow-hidden transition-all ${correctIdx === idx ? "border-emerald-500/50 ring-1 ring-emerald-500/20" : "border-slate-700"}`}>
                    <span className="w-10 h-10 flex items-center justify-center font-bold text-slate-500 border-r border-slate-700">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <input 
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...options];
                        newOpts[idx] = e.target.value;
                        setOptions(newOpts);
                      }}
                      className="flex-1 bg-transparent px-4 py-3 text-sm outline-none"
                    />
                    <button 
                      onClick={() => setCorrectIdx(idx)}
                      className={`p-3 transition-colors ${correctIdx === idx ? "text-emerald-500" : "text-slate-600 hover:text-slate-400"}`}>
                      <Check size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation Content */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <BookOpen size={14} /> Lời giải chi tiết
              </label>
              <textarea 
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="w-full h-40 bg-slate-800 border border-slate-700 rounded-xl p-4 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Giải thích các bước..."
              />
            </div>
          </div>
        </section>

        {/* Live Preview Column */}
        <section className="bg-slate-50 overflow-y-auto">
          <div className="max-w-2xl mx-auto py-16 px-8 text-slate-800">
            <div className="flex items-center gap-2 mb-8 text-indigo-600">
               <Eye size={20} />
               <span className="text-xs font-black uppercase tracking-tighter">Bản xem trước trực tiếp</span>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
               <div className="p-10">
                 <div className="prose prose-lg max-w-none mb-10">
                    <BlockMath math={content || "\\text{Đang nhập...}"} />
                 </div>

                 <div className="grid grid-cols-1 gap-4 mb-10">
                    {options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl border-2 border-slate-50 bg-slate-50/30">
                        <span className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center font-bold text-slate-400 text-sm">
                           {String.fromCharCode(65 + idx)}
                        </span>
                        <div className="inline-math-container">
                          <InlineMath math={opt || "\\dots"} />
                        </div>
                      </div>
                    ))}
                 </div>

                 <div className="pt-8 border-t border-dashed border-slate-100">
                    <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Lời giải hệ thống</h4>
                    <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 text-slate-700 italic">
                       <BlockMath math={explanation || "\\text{Chưa nhập lời giải.}"} />
                    </div>
                 </div>
               </div>
            </div>
            
            <p className="text-center mt-8 text-slate-400 text-xs font-medium">
              Sử dụng công cụ render KaTeX v0.16 chuẩn quốc tế
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
