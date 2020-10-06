const express = require('express');
const app = express()
const cors = require('cors')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config()

app.use(cors())
app.use(bodyParser.json())


// mongodb
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@cluster0-zakdw.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    err => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log("Connected");
    }
  );

app.use('/',require('./routes/index'));
app.use('/upload',require('./routes/upload'))

app.listen(3000,()=>{
    console.log('App listening')
})