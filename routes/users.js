const express = require("express");
const router = express.Router({});
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectTo } = require("../middleware.js");
const userController = require("../controllers/users.js");


router.route("/signup")
    .get(userController.renderSignup)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLogin)
    .post(saveRedirectTo,
        passport.authenticate("local",
            {
                failureRedirect: "/login",
                failureFlash: true
            }),
        wrapAsync(userController.login));


// logout route
router.get("/logout", userController.logout);
module.exports = router;
