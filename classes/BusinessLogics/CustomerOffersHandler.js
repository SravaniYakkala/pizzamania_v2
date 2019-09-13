"use strict";
const Helper = require("../helpers/Helper");
const Prices = require("../services/mongoStore/Prices");
const Offers = require("../services/mongoStore/Offers");
const callbacks = require("../helpers/Callbacks").shared;
const logger = Helper.shared.getLogger();
const Errors = require("../../classes/helpers/Errors");

class CustomerOffersHandler {
    constructor() {
        this.offersTable = null;
    }

    init(mongoDb) {
        let me = this;
        return new Promise(function (resolve) {
            if (!mongoDb) {
                return callbacks.fail(resolve, "please connect to mongodb first..")
            }
            me.offersTable = new Offers(mongoDb);
            callbacks.success(resolve)
        })
    }

    newOffer(offerDetails) {
        let me = this;
        return new Promise(async function (resolve) {
            let specificObj={};
            if(offerDetails.offer_type === "get_more"){
                specificObj.count=offerDetails.count;
                specificObj.get=offerDetails.get;
            }
            else if(offerDetails.offer_type === "price_drop"){
                specificObj.min_count = offerDetails.min_count;
                specificObj.price = offerDetails.price;
            }
            {
                const {ok, error, data, display} = await me.offersTable.insertNewOffer(
                    offerDetails.customer,
                    offerDetails.item,
                    offerDetails.offer_type,
                    specificObj
                );
                if (!ok) {
                    return callbacks.fail(resolve, new Error(error), display)
                }
            }
            callbacks.success(resolve)

        })
    }

}

module.exports = CustomerOffersHandler;