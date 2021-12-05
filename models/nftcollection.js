const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true},
    url: { type: String, required: true},
});

const collectionSchema = new mongoose.Schema({
    name: { type: String, required: true},
    average_price: { type: Number, required: true},
    nfts: [nftSchema],
});

const model = mongoose.model('nftcollection', collectionSchema);
module.exports = model;