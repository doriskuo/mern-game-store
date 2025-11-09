const router = require("express").Router();
const passport = require("passport");
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;
const jwt = require("jsonwebtoken");

// === 註冊 ===
router.post("/register", async (req, res) => {
  //驗證輸入
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //檢查信箱是否重複
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("此信箱已經被註冊過了");
  //製作新用戶
  const { email, username, password, role } = req.body;
  const newUser = new User({ email, username, password, role });
  try {
    const savedUser = await newUser.save();
    return res.status(201).send({ msg: "使用者成功儲存", savedUser });
  } catch (e) {
    return res.status(500).send("無法儲存使用者");
  }
});

// === 本地登入 (passport-local + JWT) ===
router.post(
  "/login",
  (req, res, next) => {
    // 先驗證格式
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    next(); // 驗證通過 → 繼續跑 passport.authenticate
  },
  passport.authenticate("local", { session: false }),
  (req, res) => {
    const user = req.user;
    const tokenObject = { _id: user._id, email: user.email };
    const token = jwt.sign(tokenObject, process.env.JWT_SECRET);
    res.send({
      message: "成功登入",
      token: token,
      user,
    });
  }
);

// === Google 登入 ===
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;
    const tokenObject = { _id: user._id, email: user.email };
    const token = jwt.sign(tokenObject, process.env.JWT_SECRET);

    const userInfo = encodeURIComponent(
      JSON.stringify({
        token,
        user: {
          _id: user._id,
          username: user.name,
          email: user.email,
          role: user.role,
        },
      })
    );

    res.redirect(`http://localhost:5173/google/redirect?data=${userInfo}`);
  }
);

module.exports = router;
