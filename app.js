const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require('mongoose');
const ejs = require("ejs");

posts = []

mongoose.connect('mongodb://localhost:27017/BlogWebDB');

const blogSchema = new mongoose.Schema({
    title: String,
    content: String
})

const Blog = mongoose.model("Blog", blogSchema)

const app = express()
app.use(express.static("public"));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {

    Blog.find({}, function (err, foundpost) {
        if (err) {
            console.log(err)
        } else {
            res.render("home", {
                posts: foundpost
            })
        }
    })
})

app.get("/compose", function (req, res) {
    res.render("compose")
})

app.post("/compose", function (req, res) {
    const title = req.body.title
    const content = req.body.content

    const saveBlog = new Blog({
        title: title,
        content: content
    })

    saveBlog.save(function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("Successfully save to the database")
        }
    })
    res.redirect("/")
})


app.get("/posts/:topic", function (req, res) {
    const request = req.params.topic

    Blog.findOne({title: request}, function (err, foundpost) {
        res.render("post",{title:foundpost.title,content:foundpost.content})
    })
})


app.listen(3000, function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log("Server succesffuly port at 3000")
    }
})