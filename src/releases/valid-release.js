"use strict";

var joi  = require("joi");

module.exports = {
    name : joi.string().min(1),
    live : joi.date().optional()
};
