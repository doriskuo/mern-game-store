const passport = require("passport");
const User = require("../models").user;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;

// === JWT 驗證策略（用於保護需要登入的路由） ===
module.exports = (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.JWT_SECRET;

  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const foundUser = await User.findById({ _id: jwt_payload._id }).exec();
        if (foundUser) {
          return done(null, foundUser);
        } else {
          return done(null, false);
        }
      } catch (e) {
        return done(e, false);
      }
    })
  );
};

// === LocalStrategy：本地帳號密碼登入 ===
passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // 用 email 當作登入欄位
    async (email, password, done) => {
      try {
        const foundUser = await User.findOne({ email }).exec();
        if (!foundUser) {
          return done(null, false, { message: "找不到使用者" });
        }

        // ✅ 這裡不用自己 bcrypt.compare，呼叫你 schema 裡的 comparePassword
        foundUser.comparePassword(password, (err, isMatch) => {
          if (err) return done(err);
          if (!isMatch) return done(null, false, { message: "密碼錯誤" });
          return done(null, foundUser);
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);

// === GoogleStrategy：Google登入 ===
const GOOGLE_CALLBACK_URL = `${process.env.SERVER_URL}/auth/google/redirect`;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    //function
    async (accessToken, refreshToken, profile, done) => {
      try {
        const foundUser = await User.findOne({ googleID: profile.id }).exec();
        if (foundUser) {
          console.log("使用者已經註冊過了，無需存入資料庫內");
          done(null, foundUser);
        } else {
          console.log("偵測到新用戶，需存入資料庫內");
          const newUser = new User({
            name: profile.displayName,
            googleID: profile.id,
            thumbnail: profile.photos?.[0]?.value,
            email: profile.emails?.[0]?.value,
          });
          const savedUser = await newUser.save();
          console.log("成功創建新用戶");
          done(null, savedUser);
        }
      } catch (err) {
        console.error("❌ Google 登入錯誤:", err);
        return done(err, false);
      }
    }
  )
);
