const Helper = require("../../../classes/helpers/Helper")
const Errors = require("../../../classes/helpers/Errors");
exports.validateNewOrder = function (req, res, next) {
    let data = req.body;
    if (!data || !data.items || typeof data.items !== "object") {
        return res.status(Errors.BAD_REQUEST.status)
            .end(Errors.BAD_REQUEST.desc)
    }
    return next();
}
exports.validateNewCustomerOffer = function (req, res, next) {
    // let data = req.body;
    // if (!data || !data.items || typeof data.items !== "object") {
    //     return res.status(Errors.BAD_REQUEST.status)
    //         .end(Errors.BAD_REQUEST.desc)
    // }
    return next();
}

exports.validateNewItem= function (req, res, next) {
    // let data = req.body;
    // if (!data || !data.items || typeof data.items !== "object") {
    //     return res.status(Errors.BAD_REQUEST.status)
    //         .end(Errors.BAD_REQUEST.desc)
    // }
    return next();
}
exports.defaultErrorHandler = function (err, req, res, next) {
    let logger = req.app.get("logger")
    logger.log(err.stack);
    res.status(Helper.shared.Errors.INTERNAL_ERROR.status);
    res.end(Helper.shared.Errors.INTERNAL_ERROR.desc);
}