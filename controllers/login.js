const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response) => {
  const { nickname, sifra } = request.body;
  const user = await User.findOne({ nickname });
  const passTrue =
    user === null ? false : await bcrypt.compare(sifra, user.passwordHash);

  if (!(user && passTrue)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }
  const userToken = {
    nickname: user.nickname,
    id: user._id,
  };
  const token = jwt.sign(userToken, process.env.SECRET);

  response.status(200).send({ token, nickname: user.nickname, id: user._id });
});
module.exports=loginRouter