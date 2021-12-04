const express = require("express");
const app = express();
const port = 5050;

app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));
app.use(express.json());


app.get("/", (req,res) => {
    res.redirect("/home");
});

app.get("/home",(req,res)=>{
    res.render("index");
});

app.get("/login", (req,res) =>{
    res.render("login");
});
app.get("/aboutus",(req,res)=>{
    res.render("aboutus");
});
app.get("/mint",(req,res)=>{
    res.render("mint");
});


app.post("/login",(req,res)=>{
    console.log(req.body);
});

app.post("/register",(req,res) =>{
    console.log(req.body);
});

app.use((req,res) =>{
    res.render("404");
    res.sendStatus(404);
    res.end();
});

app.listen(port, (res)=>{
    console.log(`Started at port ${port}`);
});
