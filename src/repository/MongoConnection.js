const mongoose = require('mongoose');

const {
    DB_CONNECTION
} = process.env;

let connected = false;

/**
 * @author Vitor Ferreira Garcia <vitfgarcia@gmail.com>
 * @description Class to abstract mongoose connection
 */
class MongoConnection {
    static connect() {
        if (!connected) {
            mongoose.connect(DB_CONNECTION, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false
            });

            connected = true;
        }
    }
}

module.exports = MongoConnection;
