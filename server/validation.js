const Joi = require("joi");
const validTags = [
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
];

const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
    role: Joi.string().valid("user", "admin").default("user"),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(data);
};

const gameValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    title: Joi.string().min(1).max(100).required(),
    article: Joi.string().min(10).max(2000).required(),
    mainImages: Joi.array().items(Joi.string().trim()).min(1).required(),
    images: Joi.array().items(Joi.string().trim()).min(1).required(),
    tags: Joi.array()
      .items(Joi.string().valid(...validTags))
      .min(1)
      .required(),
    price: Joi.number().integer().min(0).max(100000).required(),
    discountPrice: Joi.number().integer().min(0).max(100000).optional(),
    status: Joi.string().valid("draft", "published", "archived").optional(),
  });

  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.gameValidation = gameValidation;
