const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require('./routes/userRouter')
require('dotenv').config();
const path = require('path');
const app = express();
app.use(cors());
// Bodyparser middleware
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 'default-src \'self\'; font-src https://fonts.gstatic.com');
  next();
});

app.use('/',userRouter);
app.use(express.static(path.join(__dirname, 'dist')));

app.use(express.static('public'));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
// DB Config
const db = process.env.mongodb;
// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));
const port = process.env.PORT || 10000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));