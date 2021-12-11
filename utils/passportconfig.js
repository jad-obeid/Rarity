const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const usermodel = require("../models/users");

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


module.exports = {processViewIfLogged, isLoggedIn, isLoggedOut};