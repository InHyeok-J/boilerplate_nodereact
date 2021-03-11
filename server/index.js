const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const port = 5000;
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
const config = require("./config/key");

//url parse
app.use(bodyParser.json());
//json parse
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB에러남", err));

app.get("/", (req, res) => {
  res.send("Hello gdgdgd");
});

app.post("/api/users/signup", (req, res) => {
  //클라이언트에서 보내주는 회원가입 정보를 가져오면 그것들 DB에 넣어준다.
  const user = new User(req.body);
  //save를 해주면 정보들이 저장이 됨.
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  //요청된 이메일을 DB에서 찾는다
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다",
      });
    }
    //요청된 이메일이 DB에 있다면 비밀번호도 찾는다.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다",
        });
      }
      //비밀번호까지 맞다면 토큰을 생성함
      user.generateToken((err, user) => {
        if (err) {
          return res.status(400).send(err);
        }
        // 토큰을 쿠키에 저장한다
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get("/api/users/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  console.log(req.cookies.x_auth);
  User.findOneAndUpdate({ _id: req.user.id }, { token: "" }, (err, user) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(port, () => console.log(`Example app start ${port}`));
