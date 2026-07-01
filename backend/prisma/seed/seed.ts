import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("🌱 Seeding random brand_id & category_id for Product...");

  // 1. Lấy toàn bộ category & brand
  const categories = await prisma.category.findMany({
    select: { id: true },
  });

  const brands = await prisma.brand.findMany({
    select: { id: true },
  });

  if (categories.length === 0 || brands.length === 0) {
    throw new Error("❌ Category hoặc Brand đang rỗng");
  }

  // 2. Lấy toàn bộ product
  const products = await prisma.product.findMany({
    select: { id: true },
  });

  console.log(`🔹 Products: ${products.length}`);
  console.log(`🔹 Categories: ${categories.length}`);
  console.log(`🔹 Brands: ${brands.length}`);

  // 3. Update từng product (random riêng)
  for (const product of products) {
    const randomCategory = randomItem(categories);
    const randomBrand = randomItem(brands);

    await prisma.product.update({
      where: { id: product.id },
      data: {
        categoryId: randomCategory.id,
        brandId: randomBrand.id,
      },
    });
  }

  console.log("✅ Done randomizing brand_id & category_id");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });