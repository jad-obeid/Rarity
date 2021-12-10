const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    firstname: { type: String, required: true},
    lastname: { type: String, required: true},
    email: { type: String, required: true},
    username:{ type: String, required: true},
    password:{ type: String, required: true},
    balance: {type: Number, required: false},
});

const model = mongoose.model('usermodel', usersSchema);
module.exports = model;