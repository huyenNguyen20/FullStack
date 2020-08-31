const express = require("express");
const bodyParser = require("body-parser");

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route("/")
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
})
.get((req, res, next) => {
    res.end("Will send all leaders to you!");
})
.post((req, res, next) => {
    res.end(`Will add the leader: ${req.body.name} with details: ${req.body.description}`);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operations is not supported on /leaders");
})
.delete((req, res, next) => {
    res.send("Will delete all leaders");
});

leaderRouter.route("/:leaderId")
.get((req, res, next) => {
    res.end(`Will send leader with ID of ${req.params.leaderId} to you!`);
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation is not supported on the /leaders/${req.params.leaderId}`);
})
.put((req, res, next) => {
    res.write(`Updating the leader: ${req.params.leaderId}`);
    res.end(`Will update the leader ${req.body.name} with details: ${req.body.description}`);
})
.delete((req, res, next) => {
    res.send(`Will delete the dish with ID of ${req.params.leaderId}`);
});

module.exports = leaderRouter;
