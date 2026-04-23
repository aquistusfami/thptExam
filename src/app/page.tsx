import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import QuizEngine, { QuestionProps } from '@/components/features/QuizEngine';
import SignOutButton from '@/components/ui/SignOutButton';

const mockQuestions: QuestionProps[] = [
  {
    id: 'q1',
    type: 'PART1_SINGLE_CHOICE',
    content: 'Tính tích phân sau đây: \\(\\int_0^1 x^2 \\,dx\\)',
    options: ['\\frac{1}{3}', '1', '\\frac{1}{2}', '0'],
  },
  {
    id: 'q2',
    type: 'PART1_SINGLE_CHOICE',
    content: 'Tập nghiệm của phương trình \\log_2(x-1) = 3\\) là:',
    options: ['x = 8', 'x = 9', 'x = 10', 'x = 7'],
  },
  {
    id: 'q3',
    type: 'PART1_SINGLE_CHOICE',
    content: 'Cấp số cộng \\((u_n)\\) có \\(u_1 = -2\\) và công sai \\(d = 3\\). Giá trị của \\(u_{10}\\) bằng:',
    options: ['-29', '25', '28', '-2 \\cdot 3^9'],
  }
];

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-6xl mx-auto px-4 mb-4 flex justify-end">
        <SignOutButton />
      </div>
      <div className="max-w-6xl mx-auto px-4 mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">KỲ THI TỐT NGHIỆP THPT QG 2025</h1>
        <p className="text-slate-500 mt-2">Môn: TOÁN HỌC - Thời gian làm bài: 90 phút</p>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm font-medium text-slate-600">
          <span>Xin chào, {session.user.name ?? session.user.email}</span>
          {session.user.role === 'ADMIN' && (
            <a href="/admin" className="text-blue-600 hover:underline">Quản trị viên</a>
          )}
        </div>
      </div>
      <QuizEngine questions={mockQuestions} examId="exam_mock_01" />
    </main>
  );
}
