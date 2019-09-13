"use strict";
const Helper = require("./Helper");
const logger = Helper.shared.getLogger();

class Callbacks {
    constructor() {
    }

    fail(resolve, err, display) {
        logger.log("Error:", err || "no error", ",   Display:", display || "");
        resolve({
            ok: false,
            error: err,
            display: display
        })
    }

    success(resolve, data) {
        resolve({
            ok: true,
            data: data
        })
    }


}

Callbacks.shared = new Callbacks();
module.exports = Callbacks;