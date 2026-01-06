const User = require("../models/user.js");

module.exports.renderSignup = (req, res) => {
    res.render("users/signup");
}
module.exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {   //automatically log in the user after signing up
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            console.log(registeredUser);
            res.redirect("/listings");
        });
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/users");
    }
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    // res.redirect(req.session.redirectTo);  passport resets req.session.redirectTo to undefined after using it once
    const redirectUrl = res.locals.redirectTo || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged you out!");
        res.redirect("/listings");
    });
}