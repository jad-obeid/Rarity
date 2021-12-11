const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const usermodel = require("./models/users");
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


app.use("/", require("./utils/routes.js"));

app.use((req, res) => {
  res.render("404");
  res.end();
});

app.listen(port, (res) => {
  console.log(`Started at port ${port}`);
});
