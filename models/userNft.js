const mongoose = require("mongoose");

const userNftSchema = new mongoose.Schema({
    
    nftName: { type: String, required: true},
    nftRarity: { type: String, required: true},
    nftPrice: { type: Number, required: true},
    nftDesc:{ type: String, required: true},
    username:{type: String, required: true},
    listed: {type: String, required: true},
    url:{ type: String, required: true}
});

const model = mongoose.model('usernftmodel', userNftSchema);
module.exports = model;