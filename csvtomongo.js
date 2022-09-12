const { getMongoConnection } = require('./connect');
var url = "mongodb://localhost:27017/";
const csv = require('csv-parser')
const fs = require('fs');
let results = [];
(async () => {
    const mongoconn = await getMongoConnection(url);
    const { connStatus, client } = mongoconn;
    //console.log("client",client)
    const database = client.db("mydb");
    try {
        if (connStatus) {
            console.log('DATABASE CONNECTION SUCCESSFULL');
            fs.createReadStream('./UK-latest.csv')
                .pipe(csv({}))
                .on('data', async (data) => {
                    //console.log(data)
                    results.push(data)
                    //console.log(results.length)
                })
                .on('end', () => {
                    results.map(async (obj) => {
                        items = await database.collection("UK-latest1").insertOne(obj)
                        //console.log(items)
                        //console.log("inserted")
                    })
                });
        }
        else {
            console.log("error while connecting to db")
        }
    }
    catch (e) {
        console.log(e)
    }
})();



