const router = require("express").Router();
const Game = require("../models").game;
const gameValidation = require("../validation").gameValidation;

router.use((req, res, next) => {
  // 只允許 role === "admin"
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).send("只有管理者能進行此操作。");
  }
  next();
});

// 創建遊戲
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

    const generatedMainImages = baseMain ? generateMainImgPaths(baseMain) : []; // 若沒有提供 base，可決定要回傳錯誤或留空
    const generatedSmallImages = baseSmall
      ? generateSmallImgPaths(baseSmall)
      : [];
    // 確保 tags 是陣列（若前端傳字串也可處理）
    const tagsArray = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
    // 建一個要驗證的物件（用來對照 Joi schema）
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
    // 使用你原本的 gameValidation 去驗證（需要 schema 接受陣列形式）
    let { error } = gameValidation(payloadToValidate);
    if (error) return res.status(400).send(error.details[0].message);

    // 建立並儲存
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

//更改遊戲
router.patch("/:name", async (req, res) => {
  try {
    const gameName = req.params.name;

    const foundGame = await Game.findOne({ name: gameName });
    if (!foundGame) {
      return res.status(404).send("找不到此遊戲，無法更新遊戲內容");
    }

    // 如果有提供 base，就重建圖片路徑
    const { mainImages, images, ...updatePayload } = req.body;
    if (req.body.name) {
      updatePayload.name = req.body.name;
    }

    if (mainImages) {
      updatePayload.mainImages = Array.from(
        { length: 5 },
        (_, i) =>
          `http://localhost:3000/gameCardImages/${mainImages}${i + 1}L.jpg`
      );
    }

    if (images) {
      updatePayload.images = Array.from(
        { length: 5 },
        (_, i) => `http://localhost:3000/gameCardImages/${images}${i + 1}S.jpg`
      );
    }

    const updatedGame = await Game.findOneAndUpdate(
      { name: gameName },
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.send({ message: "遊戲已成功更新", updatedGame });
  } catch (e) {
    return res.status(500).send(e);
  }
});

//刪除遊戲
router.delete("/:name", async (req, res) => {
  let { name } = req.params;
  try {
    let foundGame = await Game.findOne({ name }).exec();
    if (!foundGame) {
      return res.status(400).send("找不到遊戲，無法刪除遊戲");
    }
    if (foundGame) {
      await Game.deleteOne({ name }).exec();
      return res.send("遊戲已被刪除");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
