const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const dboper = require("./operations.js");

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
   
    dboper.insertDocument(db, 
        {name: "Pasta", description : "Test"},
        "dishes", 
        (result) => {
        console.log(`Insert Document: \n ${result.ops}`);

        dboper.findDocuments(db, 
            "dishes", 
            (docs) => {
            console.log(`Found Documents: \n ${docs}`);

            dboper.updateDocument(db, 
                {name: "Pasta"}, 
                {description: "Updated Test"},
                "dishes", 
                (result) => {
                    console.log(`Update Documents: ${result.result}`);

                    dboper.findDocuments(db, "dishes", (result) => {
                        console.log(`Found Document:  ${result}`);

                        db.dropCollection("dishes", (result) => {
                            console.log(`Dropped Collection ${result}`);
                            
                            client.close();
                        })
                })
            })
        })
    })


})