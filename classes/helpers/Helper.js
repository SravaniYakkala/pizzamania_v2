"use strict";
const tracer = require('tracer');
class Helper {
    constructor() {
        this.logger=null;
        this.runModes = {
            LOCAL: "local"
        };

        this.Errors = {
            "BAD_REQUEST": {
                status: 401,
                desc: "bad request"
            },
            "INTERNAL_ERROR": {
                status: 500,
                desc: "internal error"
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
    }

    getLogger(){
        if(this.logger){
            return this.logger;
        }
        this.logger = tracer.console({
            format: "{{timestamp}} [{{title}}] {{message}} (in {{path}}:{{line}})",
            dateformat: "dd-mm-yyyy HH:MM:ss TT"
        });
        return this.logger;
    }

    validateRunMode(runMode) {
        let me = this;
        if (!runMode) {
            return false
        }
        for (let key in me.runModes) {
            if (runMode == me.runModes[key]) {
                return true;
            }
        }
        return false

    }
}

Helper.shared = new Helper()

module.exports = Helper;

