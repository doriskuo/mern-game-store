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

module.exports = router;
