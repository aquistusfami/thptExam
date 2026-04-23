import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized - Vui lòng đăng nhập" }, { status: 401 });
    }

    const body = await request.json();
    const { examId, answers } = body;

    if (!examId || !answers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Lấy dữ liệu đề thi và câu hỏi
    const examQuestions = await prisma.examQuestion.findMany({
      where: { examId },
      include: { question: true },
    });

    let totalScore = 0;
    const incorrectQuestionIds: string[] = [];

    // 2. Chấm điểm Server-side & Lưu vết sai
    for (const eq of examQuestions) {
      const q = eq.question;
      const userAns = answers[q.id];
      const correctAnswer = JSON.parse(q.correctAnswer);

      let isCorrect = false;

      if (userAns !== undefined) {
        if (q.type === "PART1_SINGLE_CHOICE") {
          isCorrect = Number(userAns) === Number(correctAnswer);
          if (isCorrect) totalScore += 0.25;
        } else if (q.type === "PART2_TRUE_FALSE") {
          const correctArr = correctAnswer as boolean[];
          let matchCount = 0;
          if (Array.isArray(userAns) && Array.isArray(correctArr)) {
            for (let i = 0; i < 4; i++) {
              if (Boolean(userAns[i]) === Boolean(correctArr[i])) matchCount++;
            }
          }
          if (matchCount === 1) totalScore += 0.1;
          else if (matchCount === 2) totalScore += 0.25;
          else if (matchCount === 3) totalScore += 0.5;
          else if (matchCount === 4) {
            totalScore += 1.0;
            isCorrect = true;
          }
        } else if (q.type === "PART3_SHORT_ANSWER") {
          isCorrect = String(userAns).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();
          if (isCorrect) totalScore += 0.5;
        }
      }

      if (!isCorrect && userAns !== undefined) {
        incorrectQuestionIds.push(q.id);
      }
    }

    // 3. Cập nhật Sổ tay lỗi sai (Error Notebook)
    if (incorrectQuestionIds.length > 0) {
      await Promise.all(
        incorrectQuestionIds.map((qId) =>
          prisma.savedQuestion.upsert({
            where: {
              userId_questionId_type: {
                userId: session.user.id,
                questionId: qId,
                type: "INCORRECT",
              },
            },
            update: { createdAt: new Date() },
            create: {
              userId: session.user.id,
              questionId: qId,
              type: "INCORRECT",
            },
          })
        )
      );
    }

    // 4. Cập nhật Mục tiêu hàng ngày (Daily Goal)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const goal = await prisma.dailyGoal.upsert({
      where: {
        userId_date: {
          userId: session.user.id,
          date: today,
        },
      },
      update: {
        currentCount: { increment: examQuestions.length },
      },
      create: {
        userId: session.user.id,
        date: today,
        targetCount: 20,
        currentCount: examQuestions.length,
      },
    });

    if (goal.currentCount >= goal.targetCount && !goal.isCompleted) {
      await prisma.dailyGoal.update({
        where: { id: goal.id },
        data: { isCompleted: true },
      });
      // Ở đây có thể thêm logic tặng Badge "Daily Achiever"
    }

    // 5. Lưu Attempt
    const attempt = await prisma.attempt.create({
      data: {
        examId,
        userId: session.user.id,
        answers: JSON.stringify(answers),
        score: Math.round(totalScore * 100) / 100,
        isFinished: true,
        submittedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, score: attempt.score, attempt }, { status: 201 });
  } catch (error) {
    console.error("Submission Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
