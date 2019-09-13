"use strict";
const Helper = require("../../helpers/Helper");
const Errors = require("../../helpers/Errors");
const callbacks = require("../../helpers/Callbacks").shared;
const logger = Helper.shared.getLogger();

class Prices {
    constructor(db) {
        this.db = db;
        this.name = "prices";
        this.fields = {
            _id: "_id",
            item: "item",
            price: "price",
            desc: "desc"
        };
        this.Errors = {};
        this.collection = this.db.collection(this.name);
    }

    getItemPrices(itemNames) {
        let me = this;
        return new Promise(async function (resolve) {
            try {
                let queryObj = {};
                queryObj[me.fields.item] = {"$in": itemNames};
                let projection = {
                    fields: {}
                };
                projection.fields[me.fields.item] = 1;
                projection.fields[me.fields.price] = 1;
                projection.fields[me.fields._id] = 0;
                let itemsArray = await me.collection.find(queryObj, projection).toArray();
                callbacks.success(resolve, itemsArray)
            } catch (e) {
                callbacks.fail(resolve, new Error(e), Errors.INTERNAL_ERROR)
            }
        })
    }

    insertNewItem(item, price, desc) {
        let me = this;
        return new Promise(async function (resolve) {
            try {
                let insertObj = {};
                insertObj[me.fields.item] = item;
                insertObj[me.fields.price] = price;
                insertObj[me.fields.desc] = desc;
                await me.collection.insert(insertObj);
                callbacks.success(resolve)
            } catch (e) {
                callbacks.fail(resolve, new Error(e), Errors.INTERNAL_ERROR)
            }
        })
    }

}

module.exports = Prices;