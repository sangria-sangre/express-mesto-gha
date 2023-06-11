const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '6485f10daeaccdc952d5f4ca'
  };

  next();
});

app.use(userRoutes);
app.use(cardRoutes);

const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  console.log(`Successful listening of the application on the port ${PORT}`)
})
