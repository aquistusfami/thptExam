import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { BookOpen, Shield } from "lucide-react";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login?error=unauthorized");
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm">Xin chào, {session.user.name ?? session.user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Quản lý Đề thi", icon: BookOpen, desc: "Tạo, sửa, xoá đề thi và câu hỏi", color: "bg-blue-500" },
            { label: "Ngân hàng Câu hỏi", icon: BookOpen, desc: "Quản lý kho đề thi theo chủ đề", color: "bg-emerald-500" },
            { label: "Thống kê", icon: Shield, desc: "Điểm trung bình, câu sai nhiều nhất", color: "bg-violet-500" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                <item.icon className="text-white" size={20} />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{item.label}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
