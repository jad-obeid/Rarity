const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const usermodel = require("./models/users");
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
app.use(session({
    secret: "thisisarandomsecret",
    resave: false,
    saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());
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

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()) return next();
    res.redirect('/login');
}
app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/aboutus", (req, res) => {
  res.render("aboutus");
});
app.get("/mint", (req, res) => {
  res.render("mint");
});

app.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login?error=true'
}));


app.post("/register", async (req, res) => {
  const userRecord = req.body;
  const hashedPassword = await bcrypt.hash(userRecord.password, 15);
  userRecord.password = hashedPassword;
  const mongores = await usermodel.create(userRecord);
  console.log(mongores);
});

app.get('/restricted', isLoggedIn, (req, res) => {
	res.send("<h1>Restrcited</h1>");
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
