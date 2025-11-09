const router = require("express").Router();
const Game = require("../models").game;

router.get("/", async (req, res) => {
  try {
    const foundGames = await Game.find(
      {},
      "name title article images mainImages"
    ).exec();
    return res.send(foundGames);
  } catch (e) {
    res.status(500).send("無法取得遊戲清單");
  }
});

//用遊戲名稱尋找遊戲
router.get("/name/:name", async (req, res) => {
  let { name } = req.params;
  try {
    const foundGame = await Game.findOne(
      { name: new RegExp(name, "i") },
      "name title article images mainImages"
    ).exec();
    return res.send(foundGame);
  } catch (e) {
    return res.status(500).send("搜尋失敗");
  }
});

router.get("/shop", async (req, res) => {
  try {
    const games = await Game.find(
      {},
      "name tags price mainImages discountPrice discountPercentage"
    );
    res.send(games);
  } catch (e) {
    res.status(500).send("無法取得購物資料");
  }
});

module.exports = router;
