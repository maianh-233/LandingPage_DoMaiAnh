const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { resolveActiveMode, getPaginationInfo } = require("../utils/productQuery");

const router = express.Router();
const prisma = new PrismaClient();

const fallbackCategories = [
  { id: "cat-headphones", name: "Tai nghe" },
  { id: "cat-phones", name: "Điện thoại" },
  { id: "cat-laptops", name: "Laptop" },
  { id: "cat-keyboards", name: "Bàn phím" },
  { id: "cat-mice", name: "Chuột" },
];

const fallbackProducts = [
  { id: "p-1", name: "Tai nghe Sony WH-1000XM5", description: "Tai nghe chống ồn", categoryId: "cat-headphones", basePrice: 8990000, thumbnail: "https://i.pinimg.com/1200x/52/fb/3f/52fb3fb89711729f06e8bf7c5fc705b4.jpg" },
  { id: "p-2", name: "iPhone 15 Pro", description: "Điện thoại cao cấp", categoryId: "cat-phones", basePrice: 28990000, thumbnail: "https://i.pinimg.com/1200x/52/fb/3f/52fb3fb89711729f06e8bf7c5fc705b4.jpg" },
  { id: "p-3", name: "Laptop Dell XPS 13", description: "Laptop mỏng nhẹ", categoryId: "cat-laptops", basePrice: 32990000, thumbnail: "https://i.pinimg.com/1200x/52/fb/3f/52fb3fb89711729f06e8bf7c5fc705b4.jpg" },
  { id: "p-4", name: "Bàn phím Logitech G915", description: "Bàn phím cơ", categoryId: "cat-keyboards", basePrice: 4990000, thumbnail: "https://i.pinimg.com/1200x/52/fb/3f/52fb3fb89711729f06e8bf7c5fc705b4.jpg" },
  { id: "p-5", name: "Chuột Logitech G Pro X", description: "Chuột gaming", categoryId: "cat-mice", basePrice: 2490000, thumbnail: "https://i.pinimg.com/1200x/52/fb/3f/52fb3fb89711729f06e8bf7c5fc705b4.jpg" },
  { id: "p-6", name: "Tai nghe Bose QuietComfort", description: "Tai nghe chất lượng", categoryId: "cat-headphones", basePrice: 7590000, thumbnail: "https://i.pinimg.com/1200x/52/fb/3f/52fb3fb89711729f06e8bf7c5fc705b4.jpg" },
];

function getFallbackCategories() {
  return fallbackCategories.map((category) => ({ id: category.id, name: category.name }));
}

function getFallbackProducts({ search, categoryIds, minPrice, maxPrice, page, limit }) {
  const filtered = fallbackProducts.filter((product) => {
    const matchesSearch = !search || `${product.name} ${product.description}`.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryIds.length || categoryIds.includes(product.categoryId);
    const matchesMin = !minPrice || product.basePrice >= minPrice;
    const matchesMax = !maxPrice || product.basePrice <= maxPrice;

    return matchesSearch && matchesCategory && matchesMin && matchesMax;
  });

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;

  return {
    products: filtered.slice(start, start + limit).map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      categoryName: fallbackCategories.find((category) => category.id === product.categoryId)?.name || "",
      tags: [],
      thumbnail: product.thumbnail,
      min_price: product.basePrice,
      basePrice: product.basePrice,
    })),
    pagination: {
      page: safePage,
      limit,
      totalItems,
      totalPages,
      activeMode: "default",
    },
  };
}

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

    if (categories.length > 0) {
      return res.json({ categories });
    }

    return res.json({ categories: getFallbackCategories() });
  } catch (error) {
    console.error("Failed to load categories", error);
    return res.json({ categories: getFallbackCategories() });
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

    const where = {
      AND: [],
    };

    if (search) {
      where.AND.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (categoryIds.length > 0) {
      where.AND.push({ categoryId: { in: categoryIds } });
    }

    if (minPrice > 0 || maxPrice > 0) {
      where.AND.push({
        basePrice: {
          gte: minPrice || 0,
          lte: maxPrice || Number.MAX_SAFE_INTEGER,
        },
      });
    }

    try {
      const totalItems = await prisma.product.count({ where: where.AND.length > 0 ? where : undefined });
      const pagination = getPaginationInfo({ page, limit, totalItems });

      const products = await prisma.product.findMany({
        where: where.AND.length > 0 ? where : undefined,
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          variants: {
            orderBy: { price: "asc" },
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
      console.error("Failed to load products from Prisma", error);
    }

    const fallbackData = getFallbackProducts({
      search,
      categoryIds,
      minPrice,
      maxPrice,
      page,
      limit,
    });

    return res.json({
      products: fallbackData.products,
      pagination: {
        ...fallbackData.pagination,
        activeMode,
      },
    });
  } catch (error) {
    console.error("Failed to load products", error);
    return res.status(500).json({ message: "Không thể tải sản phẩm" });
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

