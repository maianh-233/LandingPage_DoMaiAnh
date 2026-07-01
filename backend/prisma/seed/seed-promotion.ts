import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

function randomCode(i: number) {
  return `SALE2026${i.toString().padStart(3, "0")}`;
}

// FIX ENUM ĐÚNG
function randomDiscountType() {
  return Math.random() > 0.5 ? "PERCENT" : "FIXED";
}

function randomValue(type: "PERCENT" | "FIXED") {
  if (type === "PERCENT") {
    return new Prisma.Decimal(Math.floor(Math.random() * 30 + 5)); // 5% - 35%
  }

  return new Prisma.Decimal(
    Math.floor(Math.random() * 500000 + 50000)
  );
}

async function main() {
  console.log("🚀 START SEED PROMOTIONS");

  const now = new Date();

  const promotions = [];

  for (let i = 1; i <= 20; i++) {
    const type = randomDiscountType() as "PERCENT" | "FIXED";

    const startDate = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2);
    const endDate = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 10);

    promotions.push({
      code: randomCode(i),
      name: `Khuyến mãi công nghệ ${i}`,
      discountType: type, // ✅ FIX HERE
      discountValue: randomValue(type),
      startDate,
      endDate,
      minOrderValue: new Prisma.Decimal(0),
      maxDiscount:
        type === "PERCENT"
          ? new Prisma.Decimal(300000)
          : null,
      usageLimit: Math.floor(Math.random() * 500 + 50),
    });
  }

  console.log("➡️ Inserting promotions...");

  const result = await prisma.promotion.createMany({
    data: promotions,
    skipDuplicates: true,
  });

  console.log(`🎉 DONE: inserted ${result.count} promotions`);
}

main()
  .catch((e) => {
    console.error("❌ PROMOTION SEED ERROR:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });