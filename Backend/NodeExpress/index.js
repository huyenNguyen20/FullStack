const express = require("express");
const http = require("http");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dishRouter = require("./routes/dishRouter");
const hostname = "localhost";
const port = 3000;

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

//Add dishRouter to app
app.use("/dishes", dishRouter);

//Routing
app.get("/dishes/:dishId", (req, res, next) => {
    res.send(`Will return the dish with id of ${req.params.dishId}`);
})

app.post("/dishes/:dishId", (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation is not supported on the /dishes/${req.params.dishId}`);
})

app.put("/dishes/:dishId", (req, res, next) => {
    res.write(`Updating the dish: ${req.params.dishId}`);
    res.end(`Will update the dish ${req.body.name} with details: ${req.body.description}`);
})

app.delete("/dishes/:dishId", (req, res, next) => {
    res.end(`Will delete the dish with id of ${req.params.dishId}`);
})
const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})