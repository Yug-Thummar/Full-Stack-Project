if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRoutes = require("./routes/listings.js");
const reviewsRoutes = require("./routes/reviews.js");
const usersRoutes = require("./routes/users.js");

// mongoose connection
const DBUrl = process.env.ATLASDB_URL
async function main() {
    await mongoose.connect(DBUrl);
}
main()
    .then((res) => {
        console.log("connected to DB");
        // server listening
        let port = 3030;
        app.listen(port, () => {
            console.log(`Server is listening to ${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });



const store = MongoStore.create({
    mongoUrl: DBUrl,
    touchAfter: 24 * 60 * 60, // time period in seconds
    crypto: {
        secret: process.env.SECRET,
    },
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
});

// session configuration
const sessionConfig = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize()); // a middleware that initializes passport
app.use(passport.session()); // “A web application needs the ability to identify users as they browse from page to page. This series of requests and responses, each associated with the same user, is known as a session.”
passport.use(new LocalStrategy(User.authenticate())); // we are using static method authenticate on User model to authenticate users
passport.serializeUser(User.serializeUser()); // user related all information store its means serialize. how to store user in session
passport.deserializeUser(User.deserializeUser()); // user related all information not store its means deserialize. how to get user out of session

// flash middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});


app.use("/listings", listingsRoutes);
app.use("/listings/:id/reviews", reviewsRoutes);
app.use("/", usersRoutes);

// error handling middleware
app.use((err, req, res, next) => {
    console.log(err.message);
    console.log(err);
    const { status = 500, message = "Something went wrong!!" } = err;
    res.status(status).render("listings/error.ejs", { message, status });
    // res.status(status).send(message);
});