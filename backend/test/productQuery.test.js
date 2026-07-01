const test = require("node:test");
const assert = require("node:assert/strict");

const { resolveActiveMode, getPaginationInfo } = require("../src/utils/productQuery");

test("search mode takes precedence over filters", () => {
  const mode = resolveActiveMode({
    search: "tai nghe",
    selectedCategoryIds: ["category-1"],
    priceRange: [100000, 300000],
    defaultPriceRange: [100000, 2000000],
  });

  assert.equal(mode, "search");
});

test("pagination info calculates total pages correctly", () => {
  const pagination = getPaginationInfo({
    page: 2,
    limit: 8,
    totalItems: 17,
  });

  assert.deepEqual(pagination, {
    page: 2,
    limit: 8,
    totalItems: 17,
    totalPages: 3,
  });
});
