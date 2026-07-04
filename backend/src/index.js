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

// 1. Tối ưu cấu hình CORS để nhận request ổn định từ Vercel
app.use(cors({
  origin: [
    "https://landingpagedomaianh.vercel.app", // Tên miền frontend của bạn
    "http://localhost:3000" // Để bạn vẫn test được dưới local
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Backend Railway OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api", productRoutes);
app.use("/api", promotionsRoutes);
app.use("/api/order", ordersRoutes);

// 2. Railway sẽ tự nạp cổng qua process.env.PORT
const PORT = process.env.PORT || 3000;

// 3. THAY ĐỔI QUAN TRỌNG: Thêm "0.0.0.0" vào app.listen
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend Railway listening on port ${PORT}`);
});