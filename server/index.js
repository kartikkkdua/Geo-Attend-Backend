const cookieParser = require('cookie-parser');
const express = require('express');
const { default: mongoose } = require('mongoose');
const cors = require('cors')
const app = express();

require('dotenv').config();

app.use(cookieParser());
app.use(cors());

app.get("/" , (req,res) => {
    res.send("Server Live --- Aryan Bhandari ! ");
});

app.listen(8000 , ()=>{
    console.log("Hello");
});

mongoose.connect(process.env.MONGO_DB_URI).then( console.log("Connected ")).catch(err=> console.log(err));