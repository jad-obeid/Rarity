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

app.get("/explore",processViewIfLogged, async (req, res) => {
 let nfts = await userNftModel.find(); 
 
 res.render("explore", {
    nfts:nfts,isLoggedIn: req.isLogged
  })
});

app.get("/market", isLoggedIn, async (req, res) => {
  let nfts = await userNftModel.find({"listed": "True"});
  res.render("market", {nfts: nfts,
    username: req.user.username
  })
})


app.post("/mint",isLoggedIn,upload.single('uploaded-file'), async function (req, res){
  let nftDetails = req.body;
  nftDetails.username = req.user.username;
  nftDetails.listed = "False";
  nftDetails.url = req.file.path.replace("public","..");
  let nftResponse = await userNftModel.create(nftDetails);
  res.redirect("/profile");

})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/Login'
}));

app.post("/register", async (req, res) => {
  const userRecord = req.body;
  const hashedPassword = await bcrypt.hash(userRecord.password, 15);
  userRecord.password = hashedPassword;
  userRecord.balance = 10000;
  const mongores = await usermodel.create(userRecord);
});

app.get('/profile', isLoggedIn, async (req, res) => {
	let nfts = await userNftModel.find({"username": req.user.username});
  let user = await usermodel.findOne({"username": req.user.username});
  res.render("profile",{
    username: req.user.username,
    balance: user.balance,
    nfts:nfts
  });
});

app.post("/deleteNFT", async (req,res)=>{
await userNftModel.deleteOne({"_id": ObjectId(`${req.body.ID}`)});
res.send("success");
});

app.get('/getUserNFT/:id', (req, res) => {
  let id = req.params.id;
  id = id.substring(1, id.length);
  userNftModel.findById(id).then(val => {
    res.send(val);
  })
  .catch(e => {
    console.log("Failed to retrieve NFT", e);
  });

});

app.get('/getUserNFT', async (req, res) => {
  const userNFT = await userNftModel.find();
  res.send(userNFT);
});

app.post("/editUserNFT", async (req,res)=>{
  const myquery = { "_id": ObjectId(`${req.body.nftID}`) };
  const newvalues = { $set: {nftName: req.body.nftName, nftPrice: req.body.nftPrice, nftDesc: req.body.nftDesc } };
  await userNftModel.updateOne(myquery, newvalues);
  res.redirect("/profile");

});

app.get('/getAllUsers', async (req, res) =>  {
  const usersList = await usermodel.find();
  res.send(usersList);
})


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

app.post("/buynft",isLoggedIn, async (req,res)=>{
  let requestedNft = req.body.id;
  let username = req.user.username;
  let realNft =await userNftModel.findById(requestedNft);
  let seller = await usermodel.findOne({"username" : realNft.username})
  let buyer =await usermodel.findOne({"username": username});
  if (seller.username != buyer.username){
  if (Number(realNft.nftPrice) <= Number(buyer.balance)){
    let resp = await userNftModel.updateOne(realNft,{"listed": "False","username" : buyer.username});
    let buyerbalance = Number(buyer.balance)-Number(realNft.nftPrice);
    let sellerbalance = Number(seller.balance) + Number(realNft.nftPrice);
    await usermodel.updateOne(buyer,{"balance" : buyerbalance});
    await usermodel.updateOne(seller,{"balance" : sellerbalance});
    res.send("success");
  }
  else{
    res.send("Not enough balance");
  }
}
});

app.post("/list",isLoggedIn,async (req,res)=>{
  let requestedNft = req.body.ID;
  let realNft =await userNftModel.findById(requestedNft);
  let resp = await userNftModel.updateOne(realNft,{"listed": "True"});
  res.send("success");
});

app.use((req, res) => {
  res.render("404");
  res.end();
});

app.listen(port, (res) => {
  console.log(`Started at port ${port}`);
});
