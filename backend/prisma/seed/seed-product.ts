import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const IMAGE_URL =
  "https://i.pinimg.com/1200x/4f/d2/07/4fd2075c7782fc6dd8abcc1a3d732bc4.jpg";

function randomPrice() {
  return new Prisma.Decimal(
    Math.floor(Math.random() * 2000 + 500) * 1000
  );
}

async function main() {
  console.log("🚀 START PRODUCT SEED");

  // =========================
  // CHECK CATEGORY + BRAND
  // =========================
  const category = await prisma.category.findFirst();
  const brand = await prisma.brand.findFirst();

  if (!category || !brand) {
    throw new Error("❌ Missing category or brand. Please seed first!");
  }

  // =========================
  // CREATE PRODUCTS (SAFE LOOP)
  // =========================
  console.log("➡️ Creating products...");

  const products = [];

  for (let i = 1; i <= 50; i++) {
    products.push({
      name: `Sản phẩm công nghệ ${i}`,
      description: `Mô tả sản phẩm công nghệ ${i}`,
      basePrice: randomPrice(),
      categoryId: category.id,
      brandId: brand.id,
    });
  }

  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });

  // =========================
  // GET ONLY NEW PRODUCTS
  // =========================
  const createdProducts = await prisma.product.findMany({
    where: {
      name: {
        startsWith: "Sản phẩm công nghệ",
      },
    },
  });

  console.log(`✅ Products loaded: ${createdProducts.length}`);

  // =========================
  // CREATE VARIANTS (FAST + SAFE)
  // =========================
  console.log("➡️ Creating variants...");

  await prisma.productVariant.createMany({
    data: createdProducts.flatMap((product) => [
      {
        productId: product.id,
        color: "Black",
        storage: "128GB",
        price: product.basePrice,
        imageUrl: IMAGE_URL,
        description: "Phiên bản tiêu chuẩn",
      },
      {
        productId: product.id,
        color: "White",
        storage: "256GB",
        price: new Prisma.Decimal(product.basePrice).add(500000),
        imageUrl: IMAGE_URL,
        description: "Phiên bản nâng cấp",
      },
    ]),
    skipDuplicates: true,
  });

  console.log("🎉 DONE: 50 PRODUCTS + 2 VARIANTS EACH");
}

main()
  .catch((e) => {
    console.error("❌ SEED ERROR:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });