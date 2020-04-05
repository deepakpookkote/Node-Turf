const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://deepak:deepak1456@cluster0-nqe1i.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client => {
        console.log('Connected!!');
        _db = client.db();
        callback();
    })
    .catch(error => {
        console.log("Connection error", error);
        throw error;
    });
};

const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'No database found!!'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

