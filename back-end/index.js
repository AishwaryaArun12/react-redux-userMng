const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require('./routes/userRouter')
require('dotenv').config();
const path = require('path');
const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
// Bodyparser middleware
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use('/',userRouter);
// Assuming 'public' is the directory you want to serve
app.use(express.static(path.join(__dirname, 'public')));



// Handle all routes by serving the index.html.sendFile(path.join(__dirname, '..', 'front-end',  'index.html'));
// DB Config
const db = process.env.mongodb;
// Connect to MongoDB
mongoose
  .connect(
    `${db}/user`,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));
const port = process.env.PORT || 10000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));