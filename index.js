const express = require('express');
const app = express();
const port = 5000;

const mongoose = require('mongoose');
// 에러 안 뜨게 설정
mongoose
  .connect('mongodb+srv://conan:s12345@boilerplate.mjkld.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('몽고 잘 연결 됨'))
  .catch(() => console.log('error!!!'));

app.get('/', (req, res) => res.send('hello'));

app.listen(port, () => console.log(1));
