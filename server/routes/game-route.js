const router = require("express").Router();
const Game = require("../models").game;

// === 取得後端 base URL（根據環境變數） ===
const BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:3000";

// === 將圖片相對路徑補上完整網址 ===
const toFullURL = (paths = []) =>
  paths.map((p) => (p.startsWith("http") ? p : `${BASE_URL}${p}`));

// === GET 所有遊戲 ===
router.get("/", async (req, res) => {
  try {
    const foundGames = await Game.find(
      {},
      "name title article images mainImages"
    ).exec();

    // ✅ 回傳前動態補完整圖片路徑
    const formatted = foundGames.map((g) => ({
      ...g._doc,
      images: toFullURL(g.images),
      mainImages: toFullURL(g.mainImages),
    }));

    return res.send(formatted);
  } catch (e) {
    res.status(500).send("無法取得遊戲清單");
  }
});

// === GET：以名稱搜尋遊戲 ===
router.get("/name/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const foundGame = await Game.findOne(
      { name: new RegExp(name, "i") },
      "name title article images mainImages"
    ).exec();

    if (!foundGame) return res.status(404).send("找不到此遊戲");

    const formatted = {
      ...foundGame._doc,
      images: toFullURL(foundGame.images),
      mainImages: toFullURL(foundGame.mainImages),
    };

    return res.send(formatted);
  } catch (e) {
    return res.status(500).send("搜尋失敗");
  }
});

// === GET：購物資料 ===
router.get("/shop", async (req, res) => {
  try {
    const games = await Game.find(
      {},
      "name tags price mainImages discountPrice discountPercentage"
    ).exec();

    const formatted = games.map((g) => ({
      ...g.toObject({ virtuals: true }),
      mainImages: toFullURL(g.mainImages),
    }));

    res.send(formatted);
  } catch (e) {
    res.status(500).send("無法取得購物資料");
  }
});

module.exports = router;
