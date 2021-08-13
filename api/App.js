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

app.set("trust proxy",1);

app.use(session({
    secret:"5AxC2JucvLhyQf", 
    resave:false,
    saveUninitialized:false,
}));
app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true},()=>{
    console.log("Connected to MongoDB");
});

app.use(express.static('public'));
app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/notes",notesRoute);
    
app.use(function(req, res, next) {

    const allowedDomains = ['http://localhost:3000','https://vigilant-joliot-b731fa.netlify.app/' ];
    const origin = req.headers.origin;
    if(allowedDomains.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Accept,Authorization,Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
    });

// app.use(cors());

app.listen(process.env.PORT || 8080, () => {
    console.log('server running at ' + PORT)
})