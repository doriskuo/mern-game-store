const router = require("express").Router();
const Game = require("../models").game;
const gameValidation = require("../validation").gameValidation;

// 僅限 admin 操作
router.use((req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).send("只有管理者能進行此操作。");
  }
  next();
});

// === 創建遊戲 ===
router.post("/", async (req, res) => {
  try {
    const {
      name,
      title,
      article,
      mainImages: baseMain,
      images: baseSmall,
      tags,
      price,
      discountPrice,
    } = req.body;

    // ✅ 寫入時只存相對路徑
    const generateMainImgPaths = (base) =>
      Array.from(
        { length: 5 },
        (_, i) => `/gameCardImages/${base}${i + 1}L.jpg`
      );

    const generateSmallImgPaths = (base) =>
      Array.from(
        { length: 5 },
        (_, i) => `/gameCardImages/${base}${i + 1}S.jpg`
      );

    const generatedMainImages = baseMain ? generateMainImgPaths(baseMain) : [];
    const generatedSmallImages = baseSmall
      ? generateSmallImgPaths(baseSmall)
      : [];

    // 處理標籤輸入
    const tagsArray = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    // 驗證
    const payloadToValidate = {
      name,
      title,
      article,
      mainImages: generatedMainImages,
      images: generatedSmallImages,
      tags: tagsArray,
      price,
      discountPrice,
    };

    let { error } = gameValidation(payloadToValidate);
    if (error) return res.status(400).send(error.details[0].message);

    // 寫入 DB
    const newGame = new Game({
      ...payloadToValidate,
      admin: req.user._id,
    });

    const saved = await newGame.save();
    return res.status(201).send({ message: "遊戲已建立", game: saved });
  } catch (e) {
    console.error(e);
    return res.status(500).send("無法創建遊戲。");
  }
});

// === 更新遊戲 ===
router.patch("/:name", async (req, res) => {
  try {
    const gameName = req.params.name;

    const foundGame = await Game.findOne({ name: gameName });
    if (!foundGame) {
      return res.status(404).send("找不到此遊戲，無法更新遊戲內容");
    }

    const { mainImages, images, ...updatePayload } = req.body;

    if (req.body.name) updatePayload.name = req.body.name;

    // ✅ 更新時也僅存相對路徑
    if (mainImages) {
      updatePayload.mainImages = Array.from(
        { length: 5 },
        (_, i) => `/gameCardImages/${mainImages}${i + 1}L.jpg`
      );
    }

    if (images) {
      updatePayload.images = Array.from(
        { length: 5 },
        (_, i) => `/gameCardImages/${images}${i + 1}S.jpg`
      );
    }

    const updatedGame = await Game.findOneAndUpdate(
      { name: gameName },
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.send({ message: "遊戲已成功更新", updatedGame });
  } catch (e) {
    console.error(e);
    return res.status(500).send("無法更新遊戲。");
  }
});

// === 刪除遊戲 ===
router.delete("/:name", async (req, res) => {
  let { name } = req.params;
  try {
    let foundGame = await Game.findOne({ name }).exec();
    if (!foundGame) {
      return res.status(400).send("找不到遊戲，無法刪除遊戲");
    }

    await Game.deleteOne({ name }).exec();
    return res.send("遊戲已被刪除");
  } catch (e) {
    console.error(e);
    return res.status(500).send("刪除失敗");
  }
});

// === 查詢遊戲 ===
// 支援：name 模糊搜尋、id 精準搜尋、admin 名稱/信箱搜尋、無輸入→全抓
router.get("/search", async (req, res) => {
  try {
    const { name, id, admin } = req.query;

    // 建立查詢條件
    let query = {};
    if (id) query._id = id; // 用 _id 精準搜尋
    if (name) query.name = { $regex: name, $options: "i" }; // 模糊比對遊戲名稱

    // 先抓出符合條件的遊戲並 populate 建立者資訊
    let games = await Game.find(query).populate("admin", "username email");

    // 若指定 admin 名稱或信箱，再篩選
    if (admin) {
      games = games.filter(
        (g) =>
          g.admin?.username?.toLowerCase().includes(admin.toLowerCase()) ||
          g.admin?.email?.toLowerCase().includes(admin.toLowerCase())
      );
    }

    // 沒有輸入任何條件 → 抓出所有遊戲
    if (!name && !id && !admin) {
      games = await Game.find().populate("admin", "username email");
    }

    if (!games.length) {
      return res.status(404).send("查無符合條件的遊戲");
    }

    // 按建立時間新到舊排序
    games.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 回傳完整資料（含管理欄位資訊）
    return res.send(
      games.map((g) => ({
        _id: g._id,
        name: g.name,
        title: g.title,
        article: g.article,
        tags: g.tags,
        mainImages: g.mainImages,
        status: g.status,
        price: g.price,
        discountPrice: g.discountPrice,
        discountPercentage: g.discountPercentage,
        admin: g.admin
          ? {
              username: g.admin.username || "未知",
              email: g.admin.email || "無",
            }
          : null,
        createdAt: g.createdAt,
        updatedAt: g.updatedAt,
      }))
    );
  } catch (e) {
    console.error(e);
    return res.status(500).send("搜尋失敗");
  }
});

module.exports = router;
