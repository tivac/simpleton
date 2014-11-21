"use strict";

var joi = require("joi"),
    fields = [
        "markdown",
        "text",
        "url",
        "title",
        "image",
        "video"
    ];

module.exports = {
    name   : joi.string().required(),
    fields : joi.array().includes(
        {
            name : joi.string().min(1).required(),
            type : joi.string().valid(fields).required(),
            required : joi.boolean()
        }
    )
    /*joi.object().min(1).pattern(
        /\w+/,
        joi.string().valid([
            "markdown",
            "text",
            "url",
            "title",
            "image",
            "video"
        ]).required()
    ).required(),
    required : joi.array().unique().includes(joi.string().min(1)).optional()*/
};
