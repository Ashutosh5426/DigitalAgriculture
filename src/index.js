const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require("body-parser");
const route = require('./routes/route');
const app = express();
const PORT = 5500;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://AshutoshGupta:ashutosh54264850@cluster0.ukus0.mongodb.net/DigitalAgriculture", {
  useNewUrlParser: true
})
.then(() => console.log("MongoDb is connected"))
.catch(err => console.log(err));

app.use('/', route);

app.listen(PORT, () => {
  console.log(`The application is running at PORT ${PORT}`);
})