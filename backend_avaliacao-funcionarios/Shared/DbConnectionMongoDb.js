const MongoClient = require("mongodb").MongoClient;
// Connection URI
const uri = "mongodb://localhost:27017";

// Connect the client to the server
function connection(f) {
    MongoClient.connect(uri, (err, db) => {
        f(err, db.db("cichla_db"));
    });
}
module.exports = connection;