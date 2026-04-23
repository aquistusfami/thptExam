import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu Seed dữ liệu PostgreSQL...");

  const hashedAdminPwd = await bcrypt.hash("admin@thpt2025", 10);
  const hashedStudentPwd = await bcrypt.hash("student123", 10);

  // User Admin
  await prisma.user.upsert({
    where: { email: "admin@thpt.edu.vn" },
    update: {},
    create: {
      email: "admin@thpt.edu.vn",
      name: "Quản trị viên",
      password: hashedAdminPwd,
      role: "ADMIN",
    },
  });

  // Học sinh
  await prisma.user.upsert({
    where: { email: "hocsinh@thpt.edu.vn" },
    update: {},
    create: {
      email: "hocsinh@thpt.edu.vn",
      name: "Nguyễn Văn A",
      password: hashedStudentPwd,
      role: "STUDENT",
    },
  });

  const math = await prisma.subject.upsert({
    where: { name: "Toán" },
    update: {},
    create: { name: "Toán" },
  });

  const exam = await prisma.exam.upsert({
    where: { id: "exam-mau-2025" },
    update: {},
    create: {
      id: "exam-mau-2025",
      title: "Đề Thi Thử THPTQG 2025 - Toán (Chuyên KHTN)",
      category: "Thi thử",
      durationMin: 90,
      subjectId: math.id,
    },
  });

  // Questions
  const q1 = await prisma.question.upsert({
    where: { id: "q-mau-01" },
    update: {},
    create: {
      id: "q-mau-01",
      subjectId: math.id,
      topic: "Tích phân",
      difficulty: "MEDIUM",
      type: "PART1_SINGLE_CHOICE",
      content: "\\int_0^1 x^2 \\, dx = ?",
      options: ["\\frac{1}{4}", "\\frac{1}{3}", "\\frac{1}{2}", "1"],
      correctAnswer: 1,
    },
  });

  const q2 = await prisma.question.upsert({
    where: { id: "q-mau-02" },
    update: {},
    create: {
      id: "q-mau-02",
      subjectId: math.id,
      topic: "Hàm số",
      difficulty: "HARD",
      type: "PART2_TRUE_FALSE",
      content: "Cho hàm số $f(x) = x^3 - 3x$. Xét tính đúng sai của các mệnh đề sau:",
      options: [
        "Hàm số nghịch biến trên $(-1, 1)$",
        "Hàm số đồng biến trên $(-\\infty, -1)$",
        "Hàm số có cực đại tại $x = -1$",
        "Giá trị cực tiểu của hàm số bằng $-2$",
      ],
      correctAnswer: [true, true, true, true],
    },
  });

  const q3 = await prisma.question.upsert({
    where: { id: "q-mau-03" },
    update: {},
    create: {
      id: "q-mau-03",
      subjectId: math.id,
      topic: "Logarit",
      difficulty: "EASY",
      type: "PART3_SHORT_ANSWER",
      content: "Giải phương trình $\\log_2(x - 1) = 3$. Tìm $x$.",
      options: [],
      correctAnswer: "9",
    },
  });

  // Link questions
  for (const [i, qId] of [q1.id, q2.id, q3.id].entries()) {
    await prisma.examQuestion.upsert({
      where: { examId_questionId: { examId: exam.id, questionId: qId } },
      update: {},
      create: { examId: exam.id, questionId: qId, orderIndex: i + 1 },
    });
  }

  console.log("✅ Seed PostgreSQL hoàn tất!");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
