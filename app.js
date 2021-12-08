const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const usermodel = require("./models/users");
const nftcollection = require("./models/nftcollection.js");
const userNftModel = require("./models/userNft.js");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const multer  = require('multer');
const app = express();
const ObjectId = require('mongodb').ObjectID;
const { ObjectID } = require("bson");

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/nft-uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
let upload = multer({ storage: storage })

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
  res.render("index",{collections: mongores,isLoggedIn: req.isLogged});
});

app.get("/login",isLoggedOut,(req, res) => {
  res.render("login");
});
app.get("/aboutus",processViewIfLogged, (req, res) => {
  res.render("aboutus",{isLoggedIn: req.isLogged});
});
app.get("/mint",isLoggedIn, (req, res) => {
  res.render("mint", {
    username: req.user.username
  });
});

app.get("/explore", isLoggedIn, (req, res) => {
  res.render("explore", {
    username: req.user.username
  })
})

app.post("/mint",isLoggedIn,upload.single('uploaded-file'), async function (req, res){
  let nftDetails = req.body;
  nftDetails.username = req.user.username;
  nftDetails.url = req.file.path.replace("public","..");
  let nftResponse = await userNftModel.create(nftDetails);
  res.redirect("/profile");

})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/'
}));

app.post("/register", async (req, res) => {
  const userRecord = req.body;
  const hashedPassword = await bcrypt.hash(userRecord.password, 15);
  userRecord.password = hashedPassword;
  const mongores = await usermodel.create(userRecord);
});

app.get('/profile', isLoggedIn, async (req, res) => {
	let nfts = await userNftModel.find({"username": req.user.username});

  res.render("profile",{
    username: req.user.username,
    nfts:nfts
  });
});

app.post("/deleteNFT", async (req,res)=>{
await userNftModel.deleteOne({"_id": ObjectId(`${req.body.ID}`)});
res.send("success");
});

app.post("/editUserNFT", async (req,res)=>{
  const myquery = { "_id": ObjectId(`${req.body.nftID}`) };
  const newvalues = { $set: {nftName: req.body.nftName, nftPrice: req.body.nftPrice, nftDesc: req.body.nftDesc } };
  await userNftModel.updateOne(myquery, newvalues);
  res.redirect("/profile");

});




app.get('/nft/:nftId', async (req,res) =>{
  const mongores = await nftcollection.aggregate([ 
    { "$unwind" : '$nfts'},
    { "$match" : 
        { "nfts._id" : new mongoose.Types.ObjectId(req.params.nftId)} 
    } 
]);
  let nftres = mongores[0];
  res.render("nft",{nft: nftres.nfts});
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
