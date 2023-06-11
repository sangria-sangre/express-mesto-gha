const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const helmet = require('helmet');

const {
  MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb',
  PORT = 3000,
} = process.env;

const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL);

app.use((req, res, next) => {
  req.user = {
    _id: '6485dd5f6fd0abd5f53382d2'
  };
  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Successful listening of the application on the port ${PORT}`)
})
