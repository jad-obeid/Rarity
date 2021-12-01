const express = require("express");
const app = express();
const port = 5050;

app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));

app.get("/home",(req,res)=>{
    res.render("index");
});
app.get("/aboutus",(req,res)=>{
    res.render("aboutus");
});
app.get("/mint",(req,res)=>{
    res.render("mint");
});

app.use((req,res) =>{
    res.render("404");
    res.sendStatus(404);
});

app.listen(port, (res)=>{
    console.log(`Started at port ${port}`);
});
