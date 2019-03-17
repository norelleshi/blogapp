var bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    expressSanitizer= require("express-sanitizer"),
    mongoose        = require("mongoose"),
    express         = require("express"),
    app             = express();

//APP CONFIG 
//var url = process.env.DATABASEURL || "mongodb://localhost:27017/restful_blog_app";
//mongoose.connect(url, { useNewUrlParser: true });
mongoose.connect('mongodb+srv://Norelle:6639@cluster0-i0tnj.mongodb.net/blogapp?retryWrites=true', { useNewUrlParser: true });
//mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1550486686-a496af34a2d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     body: "This is a blog post!"
// });

//RESTFUL ROUTES

app.get("/", function(req, res) {
    res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
       if(err){
           console.log("Error!");
       } else {
            res.render("index", {blogs: blogs}); 
       }
    });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res) {
    res.render("new");    
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
   // create blog
   console.log(req.body);
//   req.body.blog.body = req.sanitize(req.body.blog.body);
   console.log("==============");
   console.log(req.body);
   Blog.create(req.body.blog, function(err, newBlog){
      if(err){
          console.log(err);
      } else {
           // then redirect to the index
          res.redirect("/blogs");
      }
   });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog});
       }
    });
})

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/blogs");
      } else {
          res.redirect("/blogs");
      }
   });
   //redirect somewhere
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is running!"); 
});