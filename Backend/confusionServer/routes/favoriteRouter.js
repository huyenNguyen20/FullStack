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
    .populate("dish")
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
    }, err => next(err))
    .catch(err => next(err));
})
.post(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then(favorite => {
        if(favorite){
            favorite.dishes.push(req.body);
            favorite.save()
            .then(favorite=> {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dish')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
            })
        } else {
            Favorites.create({
                user: req.user._id,
                dishes: []
            })
            .then(favorite=> {
                favorite.dishes.push(req.body);
                favorite.save()
                .then(favorite => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dish')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                }, err => next(err))
            })
            .catch((err) => {
                return next(err);
            });
        }
    }, err => next(err))
    .catch(err => next(err));
})
.put(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operations is not permitted on this routes /favorites");
})
.delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then(favorite => {
        if(!favorite){
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            res.end("You have no favorite dishes");
        } else {
            Favorites.findByIdAndRemove(favorite._id)
            .then(response =>{
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(response)
            })
        }
    }, err =>  next(err))
    .catch(err => next(err));
})

favoriteRouter.route("/:dishId")
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then(favorite => {
        if(favorite){
            favorite.dishes.push(req.params.dishId);
            favorite.save()
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
            })
        } else {
            Favorites.create({
                user: req.user._id,
                dishes: []
            })
            .then(favorite => {
                favorite.dishes.push(req.params.dishId);
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
    Favorites.findOne({user: req.user._id})
   .then(favorite => {
       if(favorite){
           Favorites.findById(favorite._id)
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