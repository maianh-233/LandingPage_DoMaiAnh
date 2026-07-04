const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { resolveActiveMode, getPaginationInfo } = require("../utils/productQuery");

const router = express.Router();
const prisma = new PrismaClient();


function normalizeArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}

router.get("/categories", async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });

    // Không fallback, không lỗi
    return res.json({ categories });
  } catch (error) {
    console.error("Failed to load categories", error);
    return res.status(500).json({
      success: false,
      message: "Không thể tải danh mục",
    });
  }
});

router.get("/products", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const search = String(req.query.search || "").trim();
    const categoryIds = normalizeArray(req.query.categoryIds);
    const minPrice = Number(req.query.minPrice || 0);
    const maxPrice = Number(req.query.maxPrice || 0);

    const defaultPriceRange = [100000, 2000000];
    const activeMode = resolveActiveMode({
      search,
      selectedCategoryIds: categoryIds,
      priceRange: [minPrice, maxPrice],
      defaultPriceRange,
    });

    const where = { AND: [] };

    if (search) {
      where.AND.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (categoryIds.length > 0) {
      where.AND.push({
        categoryId: { in: categoryIds },
      });
    }

    if (minPrice > 0 || maxPrice > 0) {
      where.AND.push({
        basePrice: {
          gte: minPrice || 0,
          lte: maxPrice || Number.MAX_SAFE_INTEGER,
        },
      });
    }

    const totalItems = await prisma.product.count({
      where: where.AND.length ? where : undefined,
    });

    const pagination = getPaginationInfo({
      page,
      limit,
      totalItems,
    });

    const products = await prisma.product.findMany({
      where: where.AND.length ? where : undefined,
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        variants: {
          orderBy: {
            price: "asc",
          },
          take: 1,
        },
      },
    });

    const mappedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      categoryName: product.category?.name || "",
      tags: [],
      thumbnail:
        product.variants?.[0]?.imageUrl ||
        "https://i.pinimg.com/1200x/52/fb/3f/52fb3fb89711729f06e8bf7c5fc705b4.jpg",
      min_price: Number(product.variants?.[0]?.price || product.basePrice),
      basePrice: Number(product.basePrice),
    }));

    return res.json({
      products: mappedProducts,
      pagination: {
        ...pagination,
        activeMode,
      },
    });
  } catch (error) {
    console.error("========== PRISMA ERROR ==========");
    console.error(error);
    console.error("==================================");

    return res.status(500).json({
      success: false,
      message: "Không thể tải sản phẩm",
      error: error.message,
      stack:
        process.env.NODE_ENV === "development"
          ? error.stack
          : undefined,
    });
  }
});

// PRODUCT DETAIL: /products/:productId
router.get("/products/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        brand: true,
        variants: {
          orderBy: { price: "asc" },
        },
        specs: true,
        ProductTag: {
          select: { id: true, name: true },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const mapped = {
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        basePrice: Number(product.basePrice),
        category: product.category ? { id: product.category.id, name: product.category.name } : null,
        categoryName: product.category?.name || "",
        brand: product.brand ? { id: product.brand.id, name: product.brand.name } : null,
        brandName: product.brand?.name || "",
        tags: (product.ProductTag || []).map((t) => ({ id: t.id, name: t.name })),
        specs: (product.specs || []).map((s) => ({ id: s.id, key: s.key, value: s.value })),
      },
      variants: (product.variants || []).map((v) => ({
        id: v.id,
        productId: v.productId,
        color: v.color,
        storage: v.storage,
        price: Number(v.price),
        imageUrl: v.imageUrl,
        description: v.description,
      })),
    };

    return res.json(mapped);
  } catch (error) {
    console.error("Failed to load product detail", error);
    return res.status(500).json({ message: "Không thể tải chi tiết sản phẩm" });
  }
});

// SUGGESTIONS: /products/:productId/suggestions
router.get("/products/:productId/suggestions", async (req, res) => {
  try {
    const { productId } = req.params;
    const limit = Number(req.query.limit) || 5;

    const current = await prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true },
    });

    if (!current) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const suggested = await prisma.product.findMany({
      where: {
        id: { not: productId },
        categoryId: current.categoryId,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        variants: {
          orderBy: { price: "asc" },
          take: 1,
        },
        category: true,
        ProductTag: {
          take: 3,
          select: { id: true, name: true },
        },
      },
    });

    const suggestions = suggested.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      categoryName: p.category?.name || "",
      tags: (p.ProductTag || []).map((t) => ({ id: t.id, name: t.name })),
      thumbnail:
        p.variants?.[0]?.imageUrl ||
        "https://i.pinimg.com/1200x/52/fb/3f/52fb3fb89711729f06e8bf7c5fc705b4.jpg",
      min_price: Number(p.variants?.[0]?.price || p.basePrice),
      basePrice: Number(p.basePrice),
    }));

    return res.json({ suggestions });
  } catch (error) {
    console.error("Failed to load product suggestions", error);
    return res.status(500).json({ message: "Không thể tải sản phẩm gợi ý" });
  }
});

module.exports = router;

