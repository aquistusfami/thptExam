"use client";
import { useEffect, useState } from "react";
import { 
  ChevronLeft, 
  Trash2, 
  BookOpen, 
  Clock, 
  AlertCircle,
  Loader2,
  ExternalLink
} from "lucide-react";
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

export default function ErrorNotebook() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/notebook")
      .then(res => res.json())
      .then(data => {
        setQuestions(data.questions || []);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (savedId: string) => {
    if (confirm("Bạn đã thuộc câu hỏi này và muốn xóa khỏi sổ tay?")) {
      const res = await fetch(`/api/user/notebook/${savedId}`, { method: 'DELETE' });
      if (res.ok) {
        setQuestions(questions.filter(q => q.id !== savedId));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-red-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b px-6 py-5 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
             <a href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ChevronLeft size={24} className="text-slate-600" />
             </a>
             <div>
                <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <AlertCircle className="text-red-600" size={24} /> Sổ tay lỗi sai
                </h1>
                <p className="text-xs text-slate-500 font-medium">Tự động lưu những câu bạn đã làm sai</p>
             </div>
          </div>
          <p className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100">
            {questions.length} CÂU HỎI
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {questions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
             <BookOpen className="mx-auto text-slate-200 mb-4" size={64} />
             <h3 className="text-lg font-bold text-slate-700">Sổ tay trống</h3>
             <p className="text-slate-400">Hãy tiếp tục luyện tập, những câu làm sai sẽ xuất hiện ở đây.</p>
          </div>
        ) : (
          questions.map((saved: any) => (
            <div key={saved.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden group">
              <div className="p-6 border-b bg-slate-50/50 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                     {saved.question.topic || "Toán"}
                   </span>
                   <div className="flex items-center gap-1 text-slate-400 text-xs">
                     <Clock size={12} />
                     {new Date(saved.createdAt).toLocaleDateString("vi-VN")}
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <button 
                    onClick={() => handleDelete(saved.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Xóa khỏi sổ tay">
                     <Trash2 size={18} />
                   </button>
                   <a href={`/exams/${saved.question.subjectId}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                     <ExternalLink size={18} />
                   </a>
                 </div>
              </div>
              
              <div className="p-8">
                <div className="mb-8 p-1">
                   <BlockMath math={saved.question.content} />
                </div>

                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                  <h4 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                    <BookOpen size={16} /> Lời giải chi tiết
                  </h4>
                  <div className="prose prose-slate text-emerald-900 text-sm">
                    <BlockMath math={saved.question.explanation || "Chưa có lời giải chi tiết."} />
                  </div>
                </div>

                {saved.notes && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100 italic text-sm text-yellow-800">
                    Ghi chú: {saved.notes}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
