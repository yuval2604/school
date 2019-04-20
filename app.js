var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground  = require("./models/campground"), // delete it 
    Comment     = require("./models/comment"), // delete it 
    User        = require("./models/user"), // delete it 
    Soldier     = require("./models/soldier"), // delete it 
    seedDB      = require("./seeds") // delete it 
    


mongoose.connect("mongodb://school:school2604@ds139435.mlab.com:39435/school");
//mongoose.connect("mongodb://localhost/school"); // change it 
app.use(bodyParser.urlencoded({extended: true})); 
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.get("/special", function(req, res){
    User.find({}, function(err, users){
       if(err){
           console.log(err);
       } else {
         res.render("landing",{users:users});
         console.log(" show all users");
         
       }
    });
   
});


app.get("/", function(req, res){
    
    var date = new Date();
    var current_hour = date.getHours();
    console.log(current_hour);
    if(current_hour=="12"){
         Soldier.remove({}, function(err){
            if(err){
                console.log(err);
            }  
         })
    }
    else{
        console.log("not here")
    }
    
    res.redirect("/SendForm");
    // res.render("/SendForm");
});

app.get("/sendform", function(req, res){
    res.render("SendForm");
});



app.post("/sendform", function(req, res){
    
    var name = req.body.name;
    var status = req.body.status;


  //  var newUser = {username: username, lastname: lastname};
    var newUser = {name: name, status: status};
    Soldier.create(newUser, function(err, User){
        if(err){
            console.log(err);
            return res.send("doesnt work");
        }else {
            //redirect back to campgrounds page
            console.log("works");
            res.redirect("/sendform");
        }
    });
});


//INDEX - show all campgrounds
app.get("/users", function(req, res){
    // Get all campgrounds from DB
    Soldier.find({}, function(err, users){
       if(err){
           console.log(err);
       } else {
         res.render("campgrounds/index",{users:users});
         console.log(" show all users");
         
       }
    });
});

//CREATE - add new campground to DB
app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


// ====================
// COMMENTS ROUTES
// ====================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

app.post("/campgrounds/:id/comments",isLoggedIn,function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});


//  ===========
// AUTH ROUTES
//  ===========

// show register form
app.get("/register", function(req, res){
   res.render("register"); 
});
//handle sign up logic
app.post("/register", function(req, res){
    var username = req.body.username;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var phonenuber = req.body.phonenuber;
    var sex = req.body.sex;
    var school = req.body.school;
    var childname = req.body.childname;
    var childage = req.body.childage;
    var address = req.body.address;
    var prof = req.body.prof;


  //  var newUser = {username: username, lastname: lastname};
    var newUser = {username: username, lastname: lastname,email:email,phonenuber:phonenuber,sex:sex, school:school,childname:childname, childage:childage, address:address, prof:prof};
    User.create(newUser, function(err, User){
        if(err){
            console.log(err);
            return res.send("doesnt work");
        }else {
            //redirect back to campgrounds page
            console.log("works");
            res.redirect("/");
        }
    });
});

// show login form
app.get("/login", function(req, res){
   res.render("login"); 
});
// handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// logic route
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});