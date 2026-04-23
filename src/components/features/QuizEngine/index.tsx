'use client';
import { useState, useCallback } from 'react';
import { useQuizStore } from '@/store/useQuizStore';
import { useQuizTimer } from '@/hooks/useQuizTimer';
import { Clock, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

export interface QuestionProps {
  id: string;
  type: string;
  content: string; 
  options: string[];
}

export default function QuizEngine({ questions, examId }: { questions: QuestionProps[], examId: string }) {
  const { answers, setAnswer } = useQuizStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSubmit = useCallback(async () => {
    try {
      const response = await fetch('/api/attempts/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId,
          answers
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Nộp bài thành công! Bạn đạt ${data.attempt.score} điểm.`);
      } else {
        const err = await response.json();
        alert("Lỗi lưu nộp bài: " + (err.error || "Unknown"));
      }
    } catch(err) {
      console.error(err);
      alert("Kết nối tới Server thất bại.");
    }
  }, [answers, examId]);

  const { timeLeft } = useQuizTimer(handleSubmit);

  // Handle case when questions array is empty (defensive)
  if (!questions || questions.length === 0) {
    return <div className="p-8 text-center bg-white rounded-2xl shadow-sm border">Chưa có dữ liệu câu hỏi.</div>;
  }

  const currentQ = questions[currentIndex];
  const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;



  return (
    <div 
      className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto p-4 text-slate-800"
      onContextMenu={(e) => { e.preventDefault(); alert("Hành động bị cấm trong phòng thi!"); }}
      style={{ userSelect: 'none' }}
    >
      {/* Question Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Câu {currentIndex + 1}</h2>
        </div>
        
        <div className="prose max-w-none mb-8 text-lg">
           <BlockMath math={currentQ.content} />
        </div>

        <div className="space-y-4">
          {currentQ.options.map((opt, idx) => {
            const isSelected = answers[currentQ.id] === idx;
            return (
              <button 
                key={idx}
                onClick={() => setAnswer(currentQ.id, idx)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all font-medium ${
                  isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-sm' 
                  : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                }`}
              >
                <span className="inline-block w-8 h-8 rounded-full border-2 border-current text-center leading-7 mr-3">
                    {String.fromCharCode(65 + idx)}
                </span>
                <InlineMath math={opt} />
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-10">
          <button 
            disabled={currentIndex === 0} 
            onClick={() => setCurrentIndex(c => c - 1)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft size={20} /> Câu trước
          </button>
          <button 
            disabled={currentIndex === questions.length - 1} 
            onClick={() => setCurrentIndex(c => c + 1)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:hover:bg-blue-600 transition-colors shadow-sm"
          >
            Câu tiếp <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Sidebar Palette */}
      <div className="w-full md:w-80 bg-white rounded-2xl shadow-sm border p-6 h-fit sticky top-6">
        <div className="flex items-center justify-center gap-3 text-3xl font-bold text-slate-800 mb-8 bg-slate-50 py-5 rounded-xl border border-slate-100 shadow-inner">
          <Clock className="text-blue-500" size={32} />
          <span className="tabular-nums">{formatTime(timeLeft)}</span>
        </div>
        
        <div className="grid grid-cols-5 gap-2 mb-8">
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = currentIndex === idx;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`aspect-square rounded-lg font-semibold flex items-center justify-center transition-all ${
                  isAnswered
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-200' 
                    : isCurrent
                      ? 'bg-slate-200 text-slate-800 ring-2 ring-slate-400 ring-offset-1'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
        >
          <CheckCircle size={22} /> NỘP BÀI THI
        </button>
      </div>
    </div>
  );
}
