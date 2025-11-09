const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: { type: String, minLength: 3, maxLength: 50 },
  googleID: { type: String },
  date: { type: Date, default: Date.now },
  thumbnail: { type: String },
  email: { type: String, required: true, minLength: 3, maxLength: 50 },
  password: { type: String, minLength: 8, maxLength: 1024 },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});
//instance methods
userSchema.methods.isUser = function () {
  return this.role == "user";
};

userSchema.methods.isAdmin = function () {
  return this.role == "admin";
};

userSchema.methods.comparePassword = async function (password, cb) {
  let result;
  try {
    result = await bcrypt.compare(password, this.password);
    return cb(null, result);
  } catch (e) {
    return cb(e, result);
  }
};

//mongoose middle ware
//若使用者為新用戶，或者是正在更改密碼，則將密碼進行雜湊處理
userSchema.pre("save", async function (next) {
  if (!this.password) return next();
  //this 代表mongoDB內的document
  if (this.isNew || this.isModified("password")) {
    //將密碼進行雜湊處理
    const hashValue = await bcrypt.hash(this.password, 10);
    this.password = hashValue;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
