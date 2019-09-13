"use strict";
const Helper = require("../helpers/Helper");
const Prices = require("../services/mongoStore/Prices");
const callbacks = require("../helpers/Callbacks").shared;
const logger = Helper.shared.getLogger();
const Errors = require("../../classes/helpers/Errors");

class ItemsHandler {
    constructor() {
        this.pricesTable = null;
    }

    init(mongoDb) {
        let me = this;
        return new Promise(function (resolve) {
            if (!mongoDb) {
                return callbacks.fail(resolve, "please connect to mongodb first..")
            }
            me.pricesTable = new Prices(mongoDb);
            callbacks.success(resolve)
        })
    }

    newItemInsert(details) {
        let me = this;
        return new Promise(async function (resolve) {
            {
                const {ok, error, data, display} = await me.pricesTable.insertNewItem(
                    details.item,
                    details.price,
                    details.desc
                );
                if (!ok) {
                    return callbacks.fail(resolve, new Error(error), display)
                }
            }
            callbacks.success(resolve)

        })
    }

}

module.exports = ItemsHandler;