"use strict";
const express = require('express');
const router = express.Router();
const middlewares = require("./middlewares/middlewares");
const Helper = require("../../classes/helpers/Helper");
const Errors = require("../../classes/helpers/Errors");
const ItemsHandler = require("../../classes/BusinessLogics/ItemsHandler");
// const Prices = require("../services/mongoStore/Prices");
// const Offers = require("../services/mongoStore/Offers");
const callbacks = require("../../classes/helpers/Callbacks").shared;
const logger = Helper.shared.getLogger();

class CustomerOffers {
    constructor() {
        this.itemsHandler = null;
    }

    init(mongodDb, app) {
        let me = this;
        return new Promise(async function (resolve) {
            me.itemsHandler = new ItemsHandler();
            {
                const {ok, error} = await me.itemsHandler.init(mongodDb);
                if (!ok) {
                    return callbacks.fail(resolve, error)
                }
            }
            me.initRoutes(app);
            callbacks.success(resolve)
        })
    }

    initRoutes(app) {
        let me = this;
        app.post('/items/create', middlewares.validateNewItem, async function (req, res) {
            logger.log("new Item request");
            let details = req.body;
            const {ok, error, data, display} = await me.itemsHandler.newItemInsert(details);
            if (!ok) {
                if (!display) {
                    return me.internalError(res)
                }
                return res.status(display.status)
                    .end(display.desc)
            }
            return res.status(200)
                .send({})
        });
    }

    internalError(res) {
        res.status(Errors.INTERNAL_ERROR.status)
            .end(Errors.INTERNAL_ERROR.desc)
    }

}

module.exports = CustomerOffers;