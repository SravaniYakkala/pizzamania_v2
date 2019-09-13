"use strict";
const express = require('express');
const router = express.Router();
const middlewares = require("./middlewares/middlewares");
const Helper = require("../../classes/helpers/Helper");
const Errors = require("../../classes/helpers/Errors");
const OrdersHandler = require("../../classes/BusinessLogics/OrdersHandler");
// const Prices = require("../services/mongoStore/Prices");
// const Offers = require("../services/mongoStore/Offers");
const callbacks = require("../../classes/helpers/Callbacks").shared;
const logger = Helper.shared.getLogger();

class Orders {
    constructor() {
        this.ordersHandler = null;
    }

    init(mongodDb, app) {
        let me = this;
        return new Promise(async function (resolve) {
            me.ordersHandler = new OrdersHandler();
            {
                const {ok, error} = await me.ordersHandler.init(mongodDb);
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
        app.post('/orders/create', middlewares.validateNewOrder, async function (req, res) {
            logger.log("new order request");
            let orderDetails = req.body;
            const {ok, error, data, display} = await me.ordersHandler.newOrder(orderDetails);
            if (!ok) {
                if (!display) {
                    return me.internalError(res)
                }
                return res.status(display.status)
                    .end(display.desc)
            }
            return res.status(200)
                .send({total_price: data.totalPrice, items: data.checkout})
        });
    }

    internalError(res) {
        res.status(Errors.INTERNAL_ERROR.status)
            .end(Errors.INTERNAL_ERROR.desc)
    }

}

module.exports = Orders;