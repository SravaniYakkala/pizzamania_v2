"use strict";
const Helper = require("../helpers/Helper");
const Prices = require("../services/mongoStore/Prices");
const Offers = require("../services/mongoStore/Offers");
const callbacks = require("../helpers/Callbacks").shared;
const logger = Helper.shared.getLogger();
const Errors = require("../../classes/helpers/Errors");

class OrdersHandler {
    constructor() {
        this.pricesTable = null;
        this.offersTable = null;
    }

    init(mongoDb) {
        let me = this;
        return new Promise(function (resolve) {
            if (!mongoDb) {
                return callbacks.fail(resolve, "please connect to mongodb first..")
            }
            me.pricesTable = new Prices(mongoDb);
            me.offersTable = new Offers(mongoDb);
            callbacks.success(resolve)
        })
    }

    newOrder(orderDetails) {
        let me = this;
        return new Promise(async function (resolve) {
            let checkout,
                totalPrice = 0;
            let customer = orderDetails.customer;
            let items = orderDetails.items;
            // let items = {
            //     "small pizza": 2,
            //     "medium pizza": 1,
            //     "large pizza": 3
            // }
            let differentItemNames = Object.keys(items);
            let prices = {},
                offers;
            {
                const {ok, error, data, display} = await me.pricesTable.getItemPrices(differentItemNames);
                if (!ok) {
                    return callbacks.fail(resolve, new Error(error), display)
                }
                if (data.length !== differentItemNames.length) {
                    return callbacks.fail(resolve, null, Errors.BAD_REQUEST)
                }
                for (let i in data) {
                    prices[data[i].item] = data[i].price;
                }
            }
            {
                const {ok, error, data, display} = await me.offersTable.getCustomerOffers(customer, differentItemNames);
                if (!ok) {
                    return callbacks.fail(resolve, new Error(error), display)
                }
                offers = data;
            }
            {
                const {ok, error, data, display} = await me.checkout(items, offers, prices)
                if (!ok) {
                    return callbacks.fail(resolve, new Error(error), display)
                }
                checkout = data;
            }
            logger.log({prices: prices, offers: offers});
            for (let i in checkout) {
                totalPrice = totalPrice + checkout[i].finalPrice
            }
            totalPrice = totalPrice.toFixed(2);
            callbacks.success(resolve, {checkout: checkout, totalPrice: totalPrice})

        })
    }

    checkout(items, offers, prices) {
        return new Promise(function (resolve) {
            let checkout = [];

            function repeat() {
                for (let item in items) {
                    let offerMatched = false;
                    for (let i in offers) {
                        let offer = offers[i];
                        if (offer.item === item) {
                            if (offer.type === "price_drop" && items[item] >= offer.min_count) {
                                offerMatched = true;
                                for (let j = 0; j < items[item]; j++) {
                                    checkout.push({item: item, finalPrice: offer.price});
                                    items[item]--;
                                }
                            } else if (offer.type === "get_more" && items[item] >= offer.count) {
                                offerMatched = true;
                                for (let j = 0; j < offer.count; j++) {
                                    checkout.push({item: item, finalPrice: prices[item]});
                                    items[item]--;
                                }
                                let more = offer.get - offer.count;
                                for (let j = 0; j < more; j++) {
                                    checkout.push({item: item, finalPrice: 0});
                                    if (items[item] > 0)
                                        items[item]--;
                                }
                            }
                        }
                    }
                    if (!offerMatched) {
                        for (let j = 0; j < items[item]; j++) {
                            checkout.push({item: item, finalPrice: prices[item]});
                            items[item]--;
                        }
                    }
                    if (items[item] === 0) {
                        delete items[item]
                    }
                }
                if (Object.keys(items).length > 0) {
                    setImmediate(function () {
                        repeat();
                    })
                } else {
                    callbacks.success(resolve, checkout)
                }
            }

            repeat()
        })
    }

}

module.exports = OrdersHandler;