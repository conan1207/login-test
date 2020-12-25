const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const { User } = require('./models/User');
const { auth } = require('./middleware/auth');

// application/x-www-form-urlencoded 형식의 데이터를 분석해서 가져올 수 있게
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 형식의 데이터를 분석해서 가져올 수 있게
app.use(bodyParser.json());

app.use(cookieParser());

const mongoose = require('mongoose');
// 에러 안 뜨게 설정
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('몽고 잘 연결 됨'))
  .catch(() => console.log('error!!!'));

app.get('/', (req, res) => res.send('hello~~~?'));

// 회원 가입 위한 라우트
app.post('/api/users/register', (req, res) => {
  // 화원 가입 시 필요한 정보를 클라이언트에서 가져오면 데이터 베이스에 저장
  // body-parser 이용해서 req.bpdy 에 클라이언트 정보 담을 수 있음
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ sucess: false, err });
    return res.status(200).json({ sucess: true });
  });
});

app.post('/api/users/login', (req, res) => {
  // 1. 요청된 이메일을 데이터베이스에 있는 지 찾는다.
  // 몽고db 내부 함수
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '등록되지 않은 사용자입니다. 이메일을 확인해주세요.',
      });
    }
    // 2. 요청된 이메일이 맞다면 비밀번호가 맞는 지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) return res.json({ loginSuccess: false, message: '비밀번호가 틀렸습니다.' });

      // 3. 비밀번호까지 맞다면 토큰을 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
        // 어디가 베스트인지는 각기 장단점 존재
        res
          .cookie('x_auth', user.token) //
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get('/api/users/auth', auth, (req, res) => {
  // 여기까지 미들웨어를 통과해 왔다는 것은 Auth가 true.
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

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
    if (err) return res.json({ sucess: false, err });
    return res.status(200).send({ sucess: true });
  });
});

app.listen(port, () => console.log(1));
