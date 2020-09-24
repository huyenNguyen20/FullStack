const express = require("express");
const cors = require("cors");
const app = express();

const whiteList = ['http://localhost:3000', 'https://localhost:3443'];
var corsOptionDelegate = (req, callBack) => {
    var corsOptions;
    console.log(req.header("Origin"));
    if(whiteList.indexOf(req.header("Origin")) !== -1){
        corsOptions = {origin: true};
    } else {
        corsOptions = {origin: false};
    }
    callBack(null, corsOptions);
}

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionDelegate);