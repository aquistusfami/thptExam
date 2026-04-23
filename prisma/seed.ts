import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu Seed dữ liệu SQLite...");

  const hashedAdminPwd = await bcrypt.hash("admin@thpt2025", 10);
  const hashedStudentPwd = await bcrypt.hash("student123", 10);

  // Tạo Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@thpt.edu.vn" },
    update: {},
    create: {
      email: "admin@thpt.edu.vn",
      name: "Quản trị viên",
      password: hashedAdminPwd,
      role: "ADMIN",
    },
  });
  console.log("✅ Tạo Admin:", admin.email);

  // Tạo Học sinh mẫu
  const student = await prisma.user.upsert({
    where: { email: "hocsinh@thpt.edu.vn" },
    update: {},
    create: {
      email: "hocsinh@thpt.edu.vn",
      name: "Nguyễn Văn A",
      password: hashedStudentPwd,
      role: "STUDENT",
    },
  });
  console.log("✅ Tạo Học sinh:", student.email);

  // Môn Toán
  const math = await prisma.subject.upsert({
    where: { name: "Toán" },
    update: {},
    create: { name: "Toán" },
  });

  // Đề thi mẫu
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
  console.log("✅ Tạo Đề thi:", exam.title);

  // Câu hỏi 1: Phần I - Trắc nghiệm đơn
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
      options: JSON.stringify(["\\frac{1}{4}", "\\frac{1}{3}", "\\frac{1}{2}", "1"]),
      correctAnswer: JSON.stringify(1), // Index 1 → 1/3
      explanation: "Ta có: \\int_0^1 x^2 \\, dx = \\left[\\frac{x^3}{3}\\right]_0^1 = \\frac{1}{3}",
    },
  });

  // Câu hỏi 2: Phần II - Đúng / Sai
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
      options: JSON.stringify([
        "Hàm số nghịch biến trên $(-1, 1)$",
        "Hàm số đồng biến trên $(-\\infty, -1)$",
        "Hàm số có cực đại tại $x = -1$",
        "Giá trị cực tiểu của hàm số bằng $-2$",
      ]),
      correctAnswer: JSON.stringify([true, true, true, true]),
      explanation: "f'(x) = 3x^2 - 3 = 3(x-1)(x+1). Cực đại tại x=-1: f(-1)=2, Cực tiểu tại x=1: f(1)=-2",
    },
  });

  // Câu hỏi 3: Phần III - Trả lời ngắn
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
      options: JSON.stringify([]),
      correctAnswer: JSON.stringify("9"),
      explanation: "\\log_2(x-1) = 3 \\Rightarrow x - 1 = 8 \\Rightarrow x = 9",
    },
  });

  // Nối câu hỏi với đề thi
  for (const [i, qId] of [[1, q1.id], [2, q2.id], [3, q3.id]] as [number, string][]) {
    await prisma.examQuestion.upsert({
      where: { examId_questionId: { examId: exam.id, questionId: qId } },
      update: {},
      create: { examId: exam.id, questionId: qId, orderIndex: i },
    });
  }

  console.log("\n🎉 Seed hoàn tất!");
  console.log("   🔑 Admin:    admin@thpt.edu.vn  /  admin@thpt2025");
  console.log("   🎓 Học sinh: hocsinh@thpt.edu.vn  /  student123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
