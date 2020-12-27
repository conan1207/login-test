const mongoose = require('mongoose');
// 비밀번호 암호화 위해
const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
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
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// 몽구스 내부 함수
userSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    // 비밀번호 암호화
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainpassword, cb) {
  // plainpassword 와 암호화된 비밀번호 가 같은 지...
  bcrypt.compare(plainpassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  // jsonwebtoken 이용하여 토큰 생성
  // user._id + 'secretToken' = token
  // 'secretToken'을 디코딩하면 user._id
  var token = jwt.sign(user._id.toHexString(), 'secretToken');

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  // user._id + '' = token
  // 토큰 복호화
  jwt.verify(token, 'secretToken', function (err, decoded) {
    // 유저 아이디를 이용해 유저를 참음
    // 클라이언트에서 가져온 토큰과 db 토큰이 일치하는 지 확인

    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

// 스키마를 모델로 감싸줌
const User = mongoose.model('User', userSchema);

module.exports = { User };
