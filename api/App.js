require('dotenv').config()

const express = require("express"); 
const mongoose = require("mongoose");
const session= require("express-session");
const  passport=require("passport");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const notesRoute = require("./routes/stickynotes");
const bodyParser = require("body-parser");
// const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true},()=>{
    console.log("Connected to MongoDB");
});
app.set("trust proxy",1);

app.use(session({
    secret:"5AxC2JucvLhyQf", 
    resave:true,
    saveUninitialized:true,
    cookie:{
        sameSite: "none",
        secure: true,
        maxAge: 1000*60*60*24*7
    }
}));

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));
app.use(express.json());

app.options("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        res.send(200);
  });
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/notes",notesRoute);
    
// app.use(cors());

app.listen(process.env.PORT || 8080, () => {
    console.log('server running at ' + PORT)
})