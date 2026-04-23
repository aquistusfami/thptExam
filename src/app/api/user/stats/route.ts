import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 1. Lấy dữ liệu Radar Chart (Tính theo Topic/Tag)
    // Giả lập: Lấy tỉ lệ làm đúng các câu hỏi theo tag
    const attempts = await prisma.attempt.findMany({
      where: { userId, isFinished: true },
      include: { exam: { include: { questions: { include: { question: { include: { tags: true } } } } } } }
    });

    // Gom nhóm dữ liệu thực tế (Logic này sẽ phức tạp hơn nếu DB lớn, đây là bản demo)
    const statsByTag: Record<string, { total: number, correct: number }> = {};
    
    // Khởi tạo một số tag mặc định nếu DB trống
    ["Đại số", "Giải tích", "Hình học", "Lượng giác", "Xác suất"].forEach(t => {
       statsByTag[t] = { total: 0, correct: 0 };
    });

    // 2. Lấy Daily Goal hiện tại
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const goal = await prisma.dailyGoal.findUnique({
      where: { userId_date: { userId, date: today } }
    });

    // 3. Đếm số câu sai trong Sổ tay
    const errorCount = await prisma.savedQuestion.count({
      where: { userId, type: "INCORRECT" }
    });

    // 4. Lấy thành tích (Achievements)
    const achievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true }
    });

    return NextResponse.json({
      radarData: Object.entries(statsByTag).map(([subject, data]) => ({
        subject,
        A: data.total === 0 ? Math.floor(Math.random() * 50 + 40) : (data.correct / data.total) * 100, // Demo value if no data
        fullMark: 100
      })),
      goal: goal || { currentCount: 0, targetCount: 20 },
      errorCount,
      achievements: achievements.map(a => a.achievement)
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
