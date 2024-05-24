const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/user");

userRouter.post("/", async (request, response) => {
  const { name, nickname, sifra, phoneNumber } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(sifra, saltRounds);
  console.log(passwordHash);
  const user = new User({
    name,
    nickname,
    passwordHash,
    phoneNumber,
  });
  const savedUser = await user.save();
  response.status(201).json(savedUser);
});
userRouter.get("/", async (request, response) => {
  const user = await User.find({}).populate("proizvod");
  response.json(user);
});
module.exports = userRouter;
