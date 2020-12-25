const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require('./models/User');

// application/x-www-form-urlencoded 형식의 데이터를 분석해서 가져올 수 있게
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 형식의 데이터를 분석해서 가져올 수 있게
app.use(bodyParser.json());

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
app.post('/register', (req, res) => {
  // 화원 가입 시 필요한 정보를 클라이언트에서 가져오면 데이터 베이스에 저장
  // body-parser 이용해서 req.bpdy 에 클라이언트 정보 담을 수 있음
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ sucess: false, err });
    return res.status(200).json({ sucess: true });
  });
});

app.listen(port, () => console.log(1));
