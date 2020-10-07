const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var authenticate = require("../authenticate");
const Favorites = require("../models/favorites");
const User = require("../models/users");
const Dishes = require("../models/dishes");
const cors = require("./cors");
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route("/")
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req, res, next) => {
    Favorites.find({})
    .populate("user")
    .populate({
        path: "dishes",
        populate: {path: "dishes"}
    })
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
    }, err => next(err))
    .catch(err => next(err));
})
.post(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operations is not permitted on this routes /favorites/");
})
.put(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operations is not permitted on this routes /favorites");
})
.delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
    User.findById(req.user._id)
    .then(user => {
        if(!user.favorite){
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            res.end("You have no favorite dishes");
        } else {
            Favorites.findByIdAndRemove(user.favorite._id)
            .then(response =>{
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(response)
            })
            user.favorite = undefined;
            user.save();
        }
    }, err =>  next(err))
    .catch(err => next(err));
})

favoriteRouter.route("/:dishId")
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    /*
    1. Check if the dish with dishId is in the user's favorite dish list
    2. If not, return 404
    3. If yes, display the dish from the favorite dish list
     */
    User.findById(req.user._id)
    .then(user => {
        if(!user.favorite){
            var err = new Error("User doesn't have any favorite dish");
            err.status = 404;
            return next(err);
        } else {
            Favorites.findById(user.favorite._id)
            .then(favorite => {
                var dishId = favorite.dishes.filter(dishId => dishId == req.params.dishId);
                if(!dishId) {
                    var err = new Error("User doesn't have the dish in the favorite list");
                    err.status = 404;
                    return next(err);
                } else {
                    Dishes.findById(dishId)
                    .then(dish => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(dish);
                    }, err => next(err))
                }
            }, err => next(err))
        }
    }, err => next(err))
    .catch(err => next(err));
})
.post(cors.cors, authenticate.verifyUser, (req, res, next) => {
    User.findById(req.user._id)
    .then(user => {
        if(user.favorite){
            var favoriteId = user.favorite;
            Favorites.findById(favoriteId)
            .then(favorite => {
                favorite.dishes.push(req.body);
                favorite.save()
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                })
            }, err => next(err));
        } else {
            Favorites.create({
                user: req.user._id,
                dishes: []
            })
            .then(favorite => {
                user.favorite = favorite._id;
                user.save();
                favorite.dishes.push(req.body);
                favorite.save()
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                })
            }, err => next(err));
        }
    }, err => next(err))
    .catch(err => next(err));
})
.put(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operations is not permitted on this routes /favorites/"+req.params.dishId);
})
.delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
    /*
    1. Check if the dish with dishId is in the user's favorite dish list
    2. If not, return 404
    3. If yes, remove the dish from the favorite dish list
     */
   User.findById(req.user._id)
   .then(user => {
       if(user.favorite){
           Favorites.findById(user.favorite)
           .then(favorite => {
                var dishId = favorite.dishes.filter(dishId => dishId == req.params.dishId);
                if(dishId.length != 0){
                    favorite.dishes = favorite.dishes.filter(dishId => dishId != req.params.dishId);
                    console.log(favorite.dishes);
                    favorite.save()
                    .then(response => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(response);
                    })
                    
                } else {
                    var err = new Error(`You haven't added the dish with Id ${req.params.dishId} to your favorite list`);
                    err.status = 404;
                    return next(err); 
                }
           }, err => next(err));
            
       } else {
           var err = new Error("You don't have a favorite list yet");
           err.status = 404;
           return next(err);
       }
   }, err => next(err))
   .catch(err => next(err));
})
module.exports = favoriteRouter;