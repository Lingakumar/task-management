let mongoDb = require("mongodb");
let mongoClient = mongoDb.MongoClient;
let dbURL = "mongodb://localhost:27017"
//let dbURL = "mongodb://dinesh:dineshit8@ds233763.mlab.com:33763/rmt";
const DBNAME = "rmt";
const dbUtil = {
    connectDb() {
        return mongoClient.connect(dbURL);
    },        
    getCollection(collectionName) {
        return (this.connectDb()
        .then((db) => {
            return db.db(DBNAME).collection(collectionName)
        })
        .catch((err) => {
            return err;
        }));
    },
    getDataFromCollection(collectionName) {
        return (this.getCollection(collectionName)
            .then((data) => {
                return data.find({}).toArray()
                .then((dataArray) => {
                    return dataArray;
                })
                .catch((err) => {
                    return err;
                });
            })
            .catch((err) => {
                return err;
            })
        );
    },
    dropCollection(collectionName) {
        return this.getCollection(collectionName)
        .then(data =>{
            data.drop()
            .then(resp => {
                return resp;
            })
            .catch(err => {
                return err;
            });
        })    
        .catch(err => {
            return err;
        });
    }
}

module.exports = dbUtil;