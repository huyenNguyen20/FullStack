var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
var Users = require("../models/users");

router.use(bodyParser.json());

/* GET users listing. */
router.post('/signup', function(req, res, next) {
  Users.findOne({username: req.body.username })
  .then(user => {
    if(user != null){
      var err = new Error(`User ${req.body.username} already exists`);
      err.status = 403;
      next(err);
    }
    else{
      return Users.create({
        username: req.body.username,
        password: req.body.password
      })
    }
  })
  .then(user => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({status: "Registration Sucessfully!", user: user});
  }, err => next(err))
  .catch(err =>  next(err));

});

router.post("/login", (req, res, next) => {
  if(!req.session.user){
    var authHeader = req.headers.authorization;
    if(!authHeader){
      var err =  new Error("You are not authenticated.");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err);
    }

    var auth = new Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");
    var user = auth[0];
    var pass = auth[1];

    Users.findOne({username: user})
    .then(user => {
      if(user === null){
        var err = new Error(`User ${user} does not exist.`);
        err.status = 403;
        return next(err);
      }
      else if(user.password !== pass){
        var err = new Error(`Password is incorrect`);
        err.status = 403;
        return next(err);
      }
      else if(user.username === user && user.password === pass){
        req.session.user = "authenticated";
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end("You are authenticated");
      }
    })
    .catch(err => next(err));

  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("You are authenticated");
  }

})

router.get("/logout", (req, res) => {
  if(req.session){
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    var err = new Error(`You are not logged in!`);
    err.status = 403;
    next(err);
  }
})
module.exports = router;
