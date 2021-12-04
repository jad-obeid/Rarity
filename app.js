const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const usermodel = require("./models/users");

const app = express();

const mongoUlr = "mongodb://127.0.0.1:27017";
mongoose.connect(`${mongoUlr}/rarity-db`);
const port = 5050;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());

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

app.post("/login", async (req, res) => {
  const loginRecord = req.body;
  const loginUsername = loginRecord.username;
  const loginuser = await usermodel.findOne({ username: loginUsername });
  console.log(loginuser);
});

app.post("/register", async (req, res) => {
  const userRecord = req.body;
  const hashedPassword = await bcrypt.hash(userRecord.password, 15);
  userRecord.password = hashedPassword;
  const mongores = await usermodel.create(userRecord);
  console.log(mongores);
});

app.use((req, res) => {
  res.render("404");
  res.end();
});

app.listen(port, (res) => {
  console.log(`Started at port ${port}`);
});
