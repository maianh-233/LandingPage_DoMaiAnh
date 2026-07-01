import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔥 FILE IS RUNNING");
  console.log("🌱 START SEED Category & Brand");

  const categories = [
    { name: "Tai nghe" },
    { name: "Dien thoai" },
    { name: "Laptop" },
    { name: "Ban phim" },
    { name: "Chuot" },
    { name: "Dong ho thong minh" },
    { name: "Loa" },
    { name: "Phu kien" },
  ];

  console.log("➡️ Inserting categories...");

  const categoryResult = await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });

  console.log("✅ Categories inserted:", categoryResult.count);

  const brands = [
    { name: "Apple" },
    { name: "Samsung" },
    { name: "Xiaomi" },
    { name: "Sony" },
    { name: "Logitech" },
    { name: "Asus" },
    { name: "Dell" },
    { name: "HP" },
    { name: "Lenovo" },
    { name: "Anker" },
    { name: "JBL" },
    { name: "Razer" },
  ];

  console.log("➡️ Inserting brands...");

  const brandResult = await prisma.brand.createMany({
    data: brands,
    skipDuplicates: true,
  });

  console.log("✅ Brands inserted:", brandResult.count);
  console.log("🎉 SEED DONE SUCCESSFULLY");
}

main()
  .catch((e) => {
    console.error("❌ SEED ERROR:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });