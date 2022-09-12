const mongo = require('mongodb');
const options = {
    socketTimeoutMS: 200000,//time between read ,write operations
    connectTimeoutMS: 200000,//when we dont get response from mongodb while connecting it will wait for 2 sec
    useNewUrlParser: true,//we can use special characters in database
    useUnifiedTopology: true,//transaction between mongodb and our nodejsprogram(to check the status of connection has broken/stable or not)
    serverSelectionTimeoutMS: 200000,//wait for certain time before throwing an exception
    keepAlive: 1,//connection
    auto_reconnect: true,//whenever there is a problem with server,auto_connect try to recconnect again to that server
};
// Db Connection method
async function getMongoConnection(mongoUrl) {
    try {
        console.log('building mongodb connection with database');
        //console.log(mongoUrl)
        const client = await mongo.MongoClient.connect(mongoUrl);
        return {
            connStatus: 1,
            client,
        };
    } catch (error) {
        console.log(error)
        //logger.error(`error while connecting to mongo:${error}`);
        return {
            connStatus: 0,
            error: error.toString(),
        };
    }
}
// close the Db Connection
async function closeMongoConnection(client) {
    try {
        await client.close();
        console.log('DB Session Ended');
        return 'Session Closed';
    } catch (error) {
        return 'Failed to Close Mongodb Session';
    }
}
module.exports = {
    getMongoConnection,
    closeMongoConnection,
};









