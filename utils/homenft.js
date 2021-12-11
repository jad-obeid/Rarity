const mongoose = require("mongoose");
const collectionmodel = require("../models/nftcollection.js");
const mongoUlr = "mongodb://127.0.0.1:27017";
mongoose.connect(`${mongoUlr}/rarity-db`);

const hottestdeals = {
  name: "Hottest Deals",
  average_price: 500,
  nfts: [
    {
      name: "Futuristic City",
      type: "Common",
      price: 400,
      url: "../homepage-nfts/hottestdeals/hottest1.png",
    },
    {
      name: "Animals",
      type: "Common",
      price: 300,
      url: "../homepage-nfts/hottestdeals/hottest2.png",
    },
    {
      name: "Monkey",
      type: "Rare",
      price: 600,
      url: "../homepage-nfts/hottestdeals/hottest3.jpg",
    },
    {
      name: "Full Moon",
      type: "Uncommon",
      price: 500,
      url: "../homepage-nfts/hottestdeals/hottest4.png",
    },
    {
      name: "Neon Lights",
      type: "Common",
      price: 400,
      url: "../homepage-nfts/hottestdeals/hottest5.jpg",
    },
  ],
};

const astrology = {
  name: "Astrology",
  average_price: 900,
  nfts: [
    {
      name: "Astrology #1",
      type: "Rare",
      price: 1100,
      url: "../homepage-nfts/astrology/astrology1.gif",
    },
    {
      name: "Astrology #2",
      type: "common",
      price: 800,
      url: "../homepage-nfts/astrology/astrology2.gif",
    },
    {
      name: "Astrology #3",
      type: "Rare",
      price: 1000,
      url: "../homepage-nfts/astrology/astrology3.gif",
    },
    {
      name: "Astrology #4",
      type: "Rare",
      price: 950,
      url: "../homepage-nfts/astrology/astrology4.gif",
    },
    {
      name: "Astrology #5",
      type: "Uncomon",
      price: 800,
      url: "../homepage-nfts/astrology/astrology5.gif",
    },
  ],
};

const spacebuds = {
  name: "Spacebuds",
  average_price: 2500,
  nfts: [
    {
      name: "Spacebud #1",
      type: "Rare",
      price: 3000,
      url: "../homepage-nfts/spacebuds/spacebud1.png",
    },
    {
      name: "Spacebud #2",
      type: "Common",
      price: 2000,
      url: "../homepage-nfts/spacebuds/spacebud2.png",
    },
    {
      name: "Spacebud #3",
      type: "Common",
      price: 2300,
      url: "../homepage-nfts/spacebuds/spacebud3.png",
    },
    {
      name: "Spacebud #4",
      type: "Rare",
      price: 2700,
      url: "../homepage-nfts/spacebuds/spacebud4.png",
    },
    {
      name: "Spacebud #5",
      type: "Rare",
      price: 2500,
      url: "../homepage-nfts/spacebuds/spacebud5.png",
    },
  ],
};

const yummies = {
  name: "Yummies",
  average_price: 10000,
  nfts: [
    {
      name: "Yummi #1",
      type: "Rare",
      price: 12000,
      url: "../homepage-nfts/yummies/yummi1.jpg",
    },
    {
      name: "Yummi #2",
      type: "Rare",
      price: 10000,
      url: "../homepage-nfts/yummies/yummi2.jpg",
    },
    {
      name: "Yummi #3",
      type: "Common",
      price: 8000,
      url: "../homepage-nfts/yummies/yummi3.png",
    },
    {
      name: "Yummi #4",
      type: "Uncommon",
      price: 9000,
      url: "../homepage-nfts/yummies/yummi4.png",
    },
    {
      name: "Yummi #5",
      type: "Rare",
      price: 11000,
      url: "../homepage-nfts/yummies/yummi5.png",
    },
  ],
};

async function appendtoDb() {
  let dbresponse = await collectionmodel.create(hottestdeals);
  console.log(dbresponse);
  dbresponse = await collectionmodel.create(yummies);
  console.log(dbresponse);
  dbresponse = await collectionmodel.create(spacebuds);
  console.log(dbresponse);
  dbresponse = await collectionmodel.create(astrology);
  console.log(dbresponse);
}

appendtoDb();
