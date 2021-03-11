const mogoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const userSchema = mogoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, //공백을 없애주는 역할
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    // 토큰으로 유효성 검사
    type: String,
  },
  tokenExp: {
    // 토큰 유효 기간
    type: Number,
  },
});
// 유저 모델에 정보를 저장하기 전에 무엇을 할지 정함
userSchema.pre("save", function (next) {
  let user = this; // User를 가리킴
  //user password 가 바뀔때
  if (user.isModified("password")) {
    //비밀번호를 암호화 시킨다
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        //암호화 성공하면 hash된 비밀번호로 바꿔줌
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});
userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword => 암호화 되기전 이기에 암호화를 한후 체크해야 한다.

  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};
userSchema.methods.generateToken = function (cb) {
  const user = this;
  //jsonwebtoken을 이용해서 토큰 생성
  const token = jwt.sign(user._id.toHexString(), "secretToken");
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};
userSchema.statics.findByToken = (token, cb) => {
  let user = User;
  //토큰을 decode 한다.
  // user._id + secretToken
  jwt.verify(token, "secretToken", (err, decoded) => {
    // 유저 아이디를 이용해서 유저를 찾은 다음에 클라이언트에서 가져온 토큰과
    // DB에 보관된 토큰이 일치하는지 확인
    user.findOne({ _id: decoded, token: token }, (err, user) => {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  });
};
const User = mogoose.model("User", userSchema);

module.exports = { User };
