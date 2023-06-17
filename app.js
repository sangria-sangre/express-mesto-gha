const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const helmet = require('helmet');
const { errors } = require('celebrate');
const {createUser, login} = require('./controllers/users');
const auth = require('./middlewares/auth');
const { loginValidate, createUserValidate } = require('./middlewares/validator');

const {
  MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb',
  PORT = 3000,
} = process.env;

const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', loginValidate, login);
app.post('/signup', createUserValidate, createUser);
app.use(auth);
app.use(router);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
});

mongoose.connect(MONGO_URL);
app.listen(PORT, () => {
  console.log(`Successful listening of the application on the port ${PORT}`)
})
