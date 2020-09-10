const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const dboper = require("./operations.js");

//Connection URL
const url = 'mongodb://localhost:27017';

//Database Name
const dbName = "conFusion";

//Use connect method to connect to the server
MongoClient.connect(url)
.then((client) => {

    console.log("Connected successfully to the server");

    const db = client.db(dbName);

    dboper.insertDocument(db, {name: "Pasta", description : "Test"},"dishes")
    .then((result) => {

        console.log(`Insert Document: \n ${result.ops}`);

        return dboper.findDocuments(db, "dishes");
    })
    .then((docs) => {
        console.log(`Found Documents: \n ${docs}`);

        return dboper.updateDocument(db, {name: "Pasta"}, {description: "Updated Test"}, "dishes");
    })
    .then((result) => {
        console.log(`Update Documents: ${result.result}`);

        return dboper.findDocuments(db, "dishes");
    })
    .then ((result) => {

        console.log(`Found Document:  ${result}`);
        return db.dropCollection("dishes"); 
    })
    .then ((result) => {
        console.log(`Dropped Collection ${result}`);
                            
         client.close();
    })
    .catch((err) => console.log(err))               
})
.catch((err) => console.log(err));

