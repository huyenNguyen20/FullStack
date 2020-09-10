const mongoose = require("mongoose");

const Dishes = require("./models/dishes");

const url = "mongodb://localhost:27017/conFusion";
const connect = mongoose.connect(url);

connect.then( db => {
    console.log("Connected Correctly to the Server");

    var newDish = Dishes({
        name: "Pizzaria",
        description: "Test"
    })

    newDish.save()
    .then(dish => {
        console.log(dish);
        return Dishes.find({});
    })
    .then((dish) => {
        console.log(dish);
        return Dishes.remove({});
    })
    .then(() => {
        return mongoose.connection.close();
    })
    .catch(err => {
        console.log(err);
    })
});