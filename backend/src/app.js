const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const addressRoutes = require("./routes/addresses.routes");
const productRoutes = require("./routes/products.routes");
const promotionsRoutes = require("./routes/promotions.routes");
const ordersRoutes = require("./routes/order.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api", productRoutes);
app.use("/api", promotionsRoutes);
app.use("/api/order", ordersRoutes);

module.exports = app;

