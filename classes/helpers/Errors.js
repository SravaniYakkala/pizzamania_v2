const errors = {
    "BAD_REQUEST": {
        status: 401,
        desc: "bad request"
    },
    "INTERNAL_ERROR": {
        status: 500,
        desc: "internal error",
        error:"errorlaskdjflajsl"
    },
    "INCOMPLTE": {
        status: 401,
        desc: "incomplete data"
    },
    "UNABLE": {
        status: 422,
        desc: "unable to process"
    }
}
module.exports = errors