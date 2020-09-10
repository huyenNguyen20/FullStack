const mongoose = require("mongoose");

const Dishes = require("./models/dishes");

const url = "mongodb://localhost:27017/conFusion";
const connect = mongoose.connect(url);

connect.then( db => {
    console.log("Connected Correctly to the Server");

    Dishes.create({
        name: "Pizza",
        description: "Test"
    })
    .then(dish => {
        console.log(dish);

        return Dishes.findByIdAndUpdate(dish._id, {
            $set: {description: "Updated Test"}
        }, {
            new: true
        })
        .exec();
    })
    .then((dish) => {
        console.log(dish);

        dish.comments.push({
            rating: 5,
            comment: "I\'m getting a sinking feeling",
            author: "Constantinople"
        })
        return dish.save();
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