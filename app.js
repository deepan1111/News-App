const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser")
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}))
const session = require("express-session");
const passport = require("passport");
const passwordLocalMongoose = require("passport-local-mongoose")
app.use("/assest",express.static('assest'))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
}))

app.use(passport.initialize())
app.use(passport.session())
mongoose.connect("mongodb://127.0.0.1:27017/newsDB")


const userSchema = new mongoose.Schema({
    username:String,
    password:String,
})

userSchema.plugin(passwordLocalMongoose)

const User = mongoose.model("User",userSchema)

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// get routes

app.get("/",(req,res)=>{
    res.render("index")
})

app.get("/register",(req,res)=>{
    res.render("register")
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.get("/home",(req,res)=>{
    // res.render("home")
    if(req.isAuthenticated()){
        res.render("home")
    } else {
        res.redirect("/login")
    }
})


// post routes

app.post("/register",(req,res)=>{


    User.register({username:req.body.username},req.body.password).then(()=>{
        passport.authenticate("local")(req,res,()=>{
        res.redirect("/home")
    })
}).catch((err)=>{
    if(err){
            console.log(err);
            res.redirect("/register")
    }
})


})


app.post("/login",(req,res)=>{


    const user = new User({
        username:req.body.username,
        password:req.body.password,
    })


    req.login(user,(err)=>{
        if(err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req,res,()=>{
                res.render("home")
            })
        }
    })

    


})



app.listen(3000,()=>{
    console.log("Server started at port 3000");
})





