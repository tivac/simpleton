"use strict";

var joi  = require("joi");

module.exports = {
    name : joi.string().min(1)
        .description("User-friendly name for this release")
        .example("WintersDay 2025"),
    live : joi.date()
        .optional()
        .description("The date this release goes live")
};
