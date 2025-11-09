const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const gameSchema = new Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    article: { type: String, required: true },
    mainImages: {
      type: [String],
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    tags: {
      type: [String],
      enum: [
        "冒險",
        "角色扮演",
        "動作",
        "休閒",
        "益智",
        "恐怖",
        "解謎",
        "模擬",
        "競速",
        "策略",
        "對戰",
        "生存",
      ],
      required: true,
      validate: [(val) => val.length > 0, "遊戲至少需要一個標籤"],
    },
    price: { type: Number, required: true },
    discountPrice: Number,
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    releaseDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // ✅ 讓 virtual 出現在 JSON 回傳
    toObject: { virtuals: true }, // ✅ 讓 virtual 出現在物件回傳
  }
);

// ✅ virtual 欄位：折扣百分比 (不存 DB，每次取資料現算)
gameSchema.virtual("discountPercentage").get(function () {
  if (!this.discountPrice || this.discountPrice >= this.price) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

module.exports = mongoose.model("Game", gameSchema);
