"use strict";
const MongoClient = require('mongodb').MongoClient;
const Helper = require("./Helper");
const callbacks = require("./Callbacks").shared;
const logger = Helper.shared.getLogger();

class MongoConnection {
    constructor(host, port, db) {
        this.host = host;
        this.port = port;
        this.db = db;
    }

    init() {
        let me = this;
        return new Promise(async function (resolve) {
            let url = `mongodb://${me.host}:${me.port}/${me.db}`;
            logger.log(url)
            try {
                let db = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
                db = db.db(me.db);
                callbacks.success(resolve, db)
            } catch (e) {
                logger.error(e);
                callbacks.fail(resolve, e)
            }
        })
    }

}

module.exports = MongoConnection;