import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function randomSpecs() {
  const cpuList = ["i5", "i7", "i9", "Ryzen 5", "Ryzen 7"];
  const ramList = ["8GB", "16GB", "32GB"];
  const screenList = ["13 inch", "14 inch", "15.6 inch", "6.7 inch"];
  const batteryList = ["4000mAh", "4500mAh", "5000mAh"];

  return [
    { key: "CPU", value: cpuList[Math.floor(Math.random() * cpuList.length)] },
    { key: "RAM", value: ramList[Math.floor(Math.random() * ramList.length)] },
    {
      key: "Screen",
      value: screenList[Math.floor(Math.random() * screenList.length)],
    },
    {
      key: "Battery",
      value:
        batteryList[Math.floor(Math.random() * batteryList.length)],
    },
  ];
}

function randomTags() {
  const tagsPool = [
    "gaming",
    "hot",
    "new",
    "sale",
    "premium",
    "best-seller",
    "tech",
    "2026",
  ];

  const count = Math.floor(Math.random() * 3) + 2;

  return Array.from({ length: count }, () => ({
    name: tagsPool[Math.floor(Math.random() * tagsPool.length)],
  }));
}

async function main() {
  console.log("🚀 START SEED PRODUCT SPECS + TAGS");

  const products = await prisma.product.findMany();

  if (products.length === 0) {
    throw new Error("❌ No products found. Run product seed first!");
  }

  // =========================
  // SPECS SEED
  // =========================
  console.log("➡️ Creating Product Specs...");

  const specsData = products.flatMap((product) =>
    randomSpecs().map((spec) => ({
      productId: product.id,
      key: spec.key,
      value: spec.value,
    }))
  );

  await prisma.productSpec.createMany({
    data: specsData,
    skipDuplicates: true,
  });

  // =========================
  // TAGS SEED
  // =========================
  console.log("➡️ Creating Product Tags...");

  const tagsData = products.flatMap((product) =>
    randomTags().map((tag) => ({
      productId: product.id,
      name: tag.name,
    }))
  );

  await prisma.productTag.createMany({
    data: tagsData,
    skipDuplicates: true,
  });

  console.log(
    `🎉 DONE: ${products.length} products → specs + tags generated`
  );
}

main()
  .catch((e) => {
    console.error("❌ SEED ERROR:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });