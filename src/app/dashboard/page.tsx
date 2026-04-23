"use client";
import { useEffect, useState } from "react";
import { 
  Trophy, 
  Target, 
  BookOpen, 
  AlertCircle, 
  Flame, 
  ChevronRight,
  Loader2,
  Star
} from "lucide-react";
import CompetencyRadarChart from "@/components/features/Dashboard/RadarChart";
import SignOutButton from "@/components/ui/SignOutButton";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  const goalProgress = (stats.goal.currentCount / stats.goal.targetCount) * 100;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-blue-200 shadow-lg">
            <Trophy className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-800">THPTQG Analytics</h1>
        </div>
        <SignOutButton />
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
              <Flame size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Học liên tiếp</p>
              <p className="text-2xl font-bold text-slate-800">7 ngày</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
              <Target size={24} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-400 uppercase">Mục tiêu ngày</p>
              <div className="flex items-end gap-1">
                <p className="text-2xl font-bold text-slate-800">{stats.goal.currentCount}</p>
                <p className="text-sm text-slate-400 mb-1">/ {stats.goal.targetCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Sổ tay lỗi sai</p>
              <p className="text-2xl font-bold text-slate-800">{stats.errorCount} câu</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center">
              <Star size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Đã đánh dấu</p>
              <p className="text-2xl font-bold text-slate-800">12 câu</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Competency Analysis */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800">Phân tích năng lực chuyên sâu</h2>
                <button className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1">
                  Chi tiết <ChevronRight size={16} />
                </button>
              </div>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 w-full">
                  <CompetencyRadarChart data={stats.radarData} />
                </div>
                <div className="w-full md:w-64 space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Thế mạnh</p>
                    <p className="text-sm font-semibold text-slate-700">Giải tích & Đại số</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                    <p className="text-xs font-bold text-red-400 uppercase mb-2">Cần cải thiện</p>
                    <p className="text-sm font-semibold text-red-700">Hình học không gian</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
               <h2 className="text-lg font-bold text-slate-800 mb-6">Gợi ý dành riêng cho bạn</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white shadow-lg shadow-blue-100 group cursor-pointer overflow-hidden relative">
                    <div className="relative z-10">
                      <p className="text-blue-100 text-xs font-bold uppercase mb-1">Chuyên đề yếu</p>
                      <h3 className="text-lg font-bold mb-4">Luyện tập Tích phân hàm ẩn</h3>
                      <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-bold transition-all">
                        Bắt đầu ngay
                      </button>
                    </div>
                    <BookOpen size={120} className="absolute -bottom-10 -right-10 text-white/10 group-hover:scale-110 transition-transform" />
                  </div>

                  <div className="p-6 bg-slate-800 rounded-2xl text-white shadow-lg shadow-slate-100 group cursor-pointer overflow-hidden relative">
                    <div className="relative z-10">
                      <p className="text-slate-400 text-xs font-bold uppercase mb-1">Thử thách mới</p>
                      <h3 className="text-lg font-bold mb-4">Đề thi thử Chuyên KHTN - Đợt 3</h3>
                      <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-bold transition-all">
                        Thử sức
                      </button>
                    </div>
                    <Trophy size={120} className="absolute -bottom-10 -right-10 text-white/5 group-hover:scale-110 transition-transform" />
                  </div>
               </div>
            </div>
          </div>

          {/* Right Sidebar: Daily Goals & Achievements */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Target className="text-blue-600" size={20} /> Mục tiêu ngày
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-600">Hoàn thành bài tập</span>
                  <span className="font-bold text-blue-600">{Math.round(goalProgress)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-1000" 
                    style={{ width: `${Math.min(goalProgress, 100)}%` }} 
                  />
                </div>
                <p className="text-xs text-slate-400">Bạn đã hoàn thành {stats.goal.currentCount}/{stats.goal.targetCount} câu hỏi Toán hôm nay.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Trophy className="text-yellow-500" size={20} /> Huy hiệu đạt được
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {stats.achievements.length > 0 ? (
                  stats.achievements.map((ach: any) => (
                    <div key={ach.id} className="flex flex-col items-center text-center group cursor-help">
                       <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform border border-yellow-100">
                          <Trophy className="text-yellow-600" size={24} />
                       </div>
                       <p className="text-xs font-bold text-slate-700">{ach.title}</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-sm text-slate-400">Chưa có huy hiệu nào. Hãy cố gắng luyện tập nhé!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Error Notebook Quick Access */}
            <a href="/notebook" className="block bg-red-600 hover:bg-red-700 p-6 rounded-3xl text-white transition-all shadow-lg shadow-red-100 group">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold truncate">Sổ tay lỗi sai</h3>
                  <p className="text-red-100 text-sm">{stats.errorCount} câu hỏi cần ôn tập lại</p>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ChevronRight size={24} />
                </div>
              </div>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
