require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");

// routes
const authRoute = require("./routes").auth;
const adminGameRoute = require("./routes").createGame;
const gameRoute = require("./routes").game;

// passport config
require("./config/passport")(passport);

// ====== MongoDB Connection ======
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ 成功連結 mongoDB...");
  } catch (err) {
    console.error("❌ mongoDB 連線失敗：", err);
  }
})();

// ====== Middlewares ======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-game-store.vercel.app",
];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(passport.initialize());

// ====== Routes ======
app.use("/auth", authRoute);
app.use("/api/games", gameRoute);
//應該被JWT保護，如果req header 沒有jwt token就被視為沒有通過驗證
app.use(
  "/api/admin/games",
  passport.authenticate("jwt", { session: false }),
  adminGameRoute
);

// ====== Server Start ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 伺服器正在 port ${PORT} 上運行`);
});
