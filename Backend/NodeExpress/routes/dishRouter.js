const express = require("express");
const bodyParser = require("body-parser");

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route("/")
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
})
.get((req, res, next) => {
    res.end("Will send all dishes to you!");
})
.post((req, res, next) => {
    res.end(`Will add the dish: ${req.body.name} with details: ${req.body.description}`);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operations is not supported on /dishes");
})
.delete((req, res, next) => {
    res.send("Will delete all dishes");
});

dishRouter.route("/:dishId")
.get((req, res, next) => {
    res.send(`Will return the dish with id of ${req.params.dishId}`);
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation is not supported on the /dishes/${req.params.dishId}`);
})
.put((req, res, next) => {
    res.write(`Updating the dish: ${req.params.dishId}`);
    res.end(`Will update the dish ${req.body.name} with details: ${req.body.description}`);
})
.delete((req, res, next) => {
    res.end(`Will delete the dish with id of ${req.params.dishId}`);
})

module.exports = dishRouter;