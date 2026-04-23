import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu Seed dữ liệu Nâng cao (PostgreSQL)...");

  // Achievements
  const achievements = [
    { title: "Chiến binh 7 ngày", description: "Luyện tập liên tục trong 7 ngày", icon: "Flame" },
    { title: "Bậc thầy Hình học", description: "Hoàn thành 100 câu hỏi hình học", icon: "Trophy" },
    { title: "Kẻ hủy diệt Tích phân", description: "Đạt điểm tuyệt đối 5 bài thi Tích phân", icon: "Shield" },
  ];

  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { title: ach.title },
      update: {},
      create: ach,
    });
  }

  // Tags
  const tags = ["Đại số", "Giải tích", "Hình học", "Lượng giác", "Xác suất"];
  for (const tag of tags) {
    await prisma.questionTag.upsert({
      where: { name: tag },
      update: {},
      create: { name: tag },
    });
  }

  console.log("✅ Seed nâng cao PostgreSQL hoàn tất!");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
