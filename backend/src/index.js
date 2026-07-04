const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth.routes");
const addressRoutes = require("./routes/addresses.routes");
const productRoutes = require("./routes/products.routes");
const promotionsRoutes = require("./routes/promotions.routes");
const ordersRoutes = require("./routes/order.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Backend Railway OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api", productRoutes);
app.use("/api", promotionsRoutes);
app.use("/api/order", ordersRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend Railway listening on port ${PORT}`);
});

