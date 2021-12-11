const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const {processViewIfLogged, isLoggedIn, isLoggedOut} = require("./passportconfig.js");
const usermodel = require("./models/users");
const nftcollection = require("./models/nftcollection.js");
const userNftModel = require("./models/userNft.js");
const ObjectId = require('mongodb').ObjectID;
const { ObjectID } = require("bson");
const multer = require("multer");


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/nft-uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
let upload = multer({ storage: storage });

router.get("/", (req, res) => {
    res.redirect("/home");
  });
  
  router.get("/home",processViewIfLogged, async (req, res) => {
    const mongores = await nftcollection.find();
    res.render("index",{collections: mongores,isLoggedIn: req.isLogged});
  });
  
  router.get("/login",isLoggedOut,(req, res) => {
    res.render("login");
  });
  router.get("/aboutus",processViewIfLogged, (req, res) => {
    res.render("aboutus",{isLoggedIn: req.isLogged});
  });
  router.get("/mint",isLoggedIn, (req, res) => {
    res.render("mint", {
      username: req.user.username
    });
  });
  
  router.get("/explore",processViewIfLogged, async (req, res) => {
   let nfts = await userNftModel.find(); 
   
   res.render("explore", {
      nfts:nfts,isLoggedIn: req.isLogged
    })
  });
  
  router.get("/market", isLoggedIn, async (req, res) => {
    let nfts = await userNftModel.find({"listed": "True"});
    res.render("market", {nfts: nfts,
      username: req.user.username
    })
  })
  
  
  router.post("/mint",isLoggedIn,upload.single('uploaded-file'), async function (req, res){
    let nftDetails = req.body;
    nftDetails.username = req.user.username;
    nftDetails.listed = "False";
    nftDetails.url = req.file.path.replace("public","..");
    let nftResponse = await userNftModel.create(nftDetails);
    res.redirect("/profile");
  
  })
  
  router.post('/login', passport.authenticate('local', {
      successRedirect: '/home',
      failureRedirect: '/login'
  }));
  
  router.post("/register", async (req, res) => {
    const userRecord = req.body;
    const hashedPassword = await bcrypt.hash(userRecord.password, 15);
    userRecord.password = hashedPassword;
    userRecord.balance = 10000;
    const mongores = await usermodel.create(userRecord);
  });
  
  router.get('/profile', isLoggedIn, async (req, res) => {
      let nfts = await userNftModel.find({"username": req.user.username});
    let user = await usermodel.findOne({"username": req.user.username});
    res.render("profile",{
      username: req.user.username,
      balance: user.balance,
      nfts:nfts
    });
  });
  
  router.post("/deleteNFT", async (req,res)=>{
  await userNftModel.deleteOne({"_id": ObjectId(`${req.body.ID}`)});
  res.send("success");
  });
  
  router.get('/getUserNFT/:id', (req, res) => {
    let id = req.params.id;
    id = id.substring(1, id.length);
    userNftModel.findById(id).then(val => {
      res.send(val);
    })
    .catch(e => {
      console.log("Failed to retrieve NFT", e);
    });
  
  });
  
  router.get('/getUserNFT', async (req, res) => {
    const userNFT = await userNftModel.find();
    res.send(userNFT);
  });
  
  router.post("/editUserNFT", async (req,res)=>{
    const myquery = { "_id": ObjectId(`${req.body.nftID}`) };
    const newvalues = { $set: {nftName: req.body.nftName, nftPrice: req.body.nftPrice, nftDesc: req.body.nftDesc } };
    await userNftModel.updateOne(myquery, newvalues);
    res.redirect("/profile");
  
  });
  
  router.get('/getAllUsers', async (req, res) =>  {
    const usersList = await usermodel.find();
    res.send(usersList);
  })
  
  
  router.get('/nft/:nftId', async (req,res) =>{
    const mongores = await nftcollection.aggregate([ 
      { "$unwind" : '$nfts'},
      { "$match" : 
          { "nfts._id" : new mongoose.Types.ObjectId(req.params.nftId)} 
      } 
  ]);
    let nftres = mongores[0];
    res.render("nft",{nft: nftres.nfts});
  });
  
  
  router.get("/logout", (req,res)=>{
      req.logout();
      res.redirect("/");
  });
  
  router.post("/buynft",isLoggedIn, async (req,res)=>{
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
  
  router.post("/list",isLoggedIn,async (req,res)=>{
    let requestedNft = req.body.ID;
    let realNft =await userNftModel.findById(requestedNft);
    let resp = await userNftModel.updateOne(realNft,{"listed": "True"});
    res.send("success");
  });

  module.exports = router;