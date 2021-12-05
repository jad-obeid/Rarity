const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const usermodel = require("./models/users");
const nftcollection = require("./models/nftcollection.js");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const app = express();

const mongoUlr = "mongodb://127.0.0.1:27017";
mongoose.connect(`${mongoUlr}/rarity-db`);
const port = 5050;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: "thisisarandomsecret",
    resave: false,
    saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(function(err, req, res, next) {
    console.log(err);
});
passport.serializeUser(function (user, done){
    done(null,user.id);
});
passport.deserializeUser(function(id, done){
    usermodel.findById(id, function(err,user){
        done(err,user);
    });
});

passport.use(new localStrategy(function (username, password, done) {
	usermodel.findOne({ username: username }, function (err, user) {
		if (err) return done(err);
		if (!user) return done(null, false, { message: 'Incorrect username.' });

		bcrypt.compare(password, user.password, function (err, res) {
			if (err) return done(err);
			if (res === false) return done(null, false, { message: 'Incorrect password.' });
			return done(null, user);
		});
	});
}));
function processViewIfLogged(req,res,next){
    if(req.isAuthenticated()){
        req.isLogged = true;
    };
    return next();
}
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()) return next();
    res.redirect('/login');
}
function isLoggedOut(req, res, next) {
	if (!req.isAuthenticated()) return next();
	res.redirect('/');
}

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home",processViewIfLogged, async (req, res) => {
  const mongores = await nftcollection.find();
  const databaseres= Object.assign({}, mongores);
  databaseres.isLoggedIn = req.isLogged;
  res.render("index",databaseres);
});

app.get("/login",isLoggedOut,(req, res) => {
  res.render("login");
});
app.get("/aboutus",processViewIfLogged, (req, res) => {
  res.render("aboutus",{isLoggedIn: req.isLogged});
});
app.get("/mint",isLoggedIn, (req, res) => {
  res.render("mint");
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/'
}));

app.post("/register", async (req, res) => {
  const userRecord = req.body;
  const hashedPassword = await bcrypt.hash(userRecord.password, 15);
  userRecord.password = hashedPassword;
  const mongores = await usermodel.create(userRecord);
  console.log(mongores);
});

app.get('/profile', isLoggedIn, (req, res) => {
	res.render("profile",{
    username: req.user.username
  });
});



app.get("/logout", (req,res)=>{
    req.logout();
    res.redirect("/");
});


app.use((req, res) => {
  res.render("404");
  res.end();
});

app.listen(port, (res) => {
  console.log(`Started at port ${port}`);
});
