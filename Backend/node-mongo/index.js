const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

//Connection URL
const url = 'mongodb://localhost:27017';

//Database Name
const dbName = "conFusion";

//Use connect method to connect to the server
MongoClient.connect(url, (err, client) => {
    assert.equal(err, null);
    console.log("Connected successfully to the server");

    const db = client.db(dbName);

    const collection = db.collection("dishes");
    collection.insert({"name": "pizzaria", "description": "test"}, (err, result) => {
        assert.equal(err, null);

        console.log("After insert: \n");
        console.log(result.ops);
        
        collection.find({}).toArray((err, docs) => {
            assert.equal(err, null);

            console.log("Found: \n");
            console.log(docs);

            db.dropCollection("dishes", (err, result) => {
                assert.equal(err, null);

                client.close();
            })
        })
    })


})