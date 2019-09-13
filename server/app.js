"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const Helper = require("../classes/helpers/Helper");
const MongoConnection = require("../classes/helpers/MongoConnection");
const OrdersRoutes = require("./routes/Orders");
const CustomerOfferRoutes = require("./routes/CustomerOffers");
const ItemsRoutes = require("./routes/Items");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const logger = Helper.shared.getLogger();
const middlewares = require("./routes/middlewares/middlewares");


app.use(middlewares.defaultErrorHandler);


let server;


process.on('unhandledRejection', (reason, promise) => {
    logger.log('Unhandled Rejection at:', reason.stack || reason)
    process.exit(1);
    // Recommended: send the information to sentry.io
    // or whatever crash reporting service you use
})

async function startServer() {
    let mongoDb;
    let ordersHandler;
    let runMode = process.env.runMode;
    let helper = Helper.shared;
    if (!helper.validateRunMode(runMode)) {
        throw new Error("invalid runMode")
    }
    const config = require('../config/' + runMode + '/config.js');
    {
        const mongoOpts = config.mongo;
        const {ok, error, data} = await new MongoConnection(mongoOpts.host, mongoOpts.port, mongoOpts.db).init();
        if (!ok) {
            throw new Error(error)
        }
        mongoDb = data
    }
    {
        const {ok, error} = await new OrdersRoutes().init(mongoDb,app);
        if (!ok) {
            throw new Error(error)
        }
    }
    {
        const {ok, error} = await new CustomerOfferRoutes().init(mongoDb,app);
        if (!ok) {
            throw new Error(error)
        }
    }
    {
        const {ok, error} = await new ItemsRoutes().init(mongoDb,app);
        if (!ok) {
            throw new Error(error)
        }
    }

    app.use("/", function (req, res) {
        return res.status(Helper.shared.Errors.BAD_REQUEST.status)
            .end(Helper.shared.Errors.BAD_REQUEST.desc)
    });

    server = app.listen(config.port, function () {
        logger.log('api server listening on port ' + config.port);
    });

    module.exports = server;
    module.exports.stop = stop;
}

function stop() {
    if (server)
        server.close()
}

startServer();


