"use strict";
const Helper = require("../../helpers/Helper");
const Errors = require("../../helpers/Errors");
const callbacks = require("../../helpers/Callbacks").shared;
const logger = Helper.shared.getLogger();

class Offers {
    constructor(db) {
        this.db = db;
        this.name = "offers";
        this.fields = {
            "customer": "customer",
            "item": "item",
            "type": "type",
            "count": "count",
            "min_count": "min_count",
            "get": "get",
            "price":"price",
            "status": "status"
        };
        this.Errors = {};
        this.collection = this.db.collection(this.name);
    }

    getCustomerOffers(customer, itemNames) {
        let me = this;
        return new Promise(async function (resolve) {
            try {
                let queryObj = {};
                queryObj[me.fields.customer] = customer;
                queryObj[me.fields.item] = {"$in": itemNames};
                let offersArray = await me.collection.find(queryObj).toArray();
                callbacks.success(resolve, offersArray)
            } catch (e) {
                callbacks.fail(resolve, new Error(e), Errors.INTERNAL_ERROR)
            }
        })
    }

    insertNewOffer(customer, item, offerType, specificObj) {
        let me = this;
        return new Promise(async function (resolve) {
            try {
                let insertObj = {};
                insertObj[me.fields.customer] = customer;
                insertObj[me.fields.item] = item;
                insertObj[me.fields.type] = offerType;
                if (offerType === "get_more") {
                    insertObj[me.fields.count] = specificObj.count;
                    insertObj[me.fields.get]=specificObj.get;
                } else if (offerType === "price_drop") {
                    insertObj[me.fields.min_count] = specificObj.min_count;
                    insertObj[me.fields.price] = specificObj.price;
                }
                await me.collection.insert(insertObj);
                callbacks.success(resolve)
            } catch (e) {
                callbacks.fail(resolve, new Error(e), Errors.INTERNAL_ERROR)
            }
        })
    }

}

module.exports = Offers;