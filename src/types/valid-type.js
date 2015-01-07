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
    name   : joi.string().min(1)
        .required()
        .description("User-friendly name for this content type")
        .example("Influencer Post"),
    fields : joi.array().includes(
        {
            name : joi.string().min(1)
                .required()
                .description("User-friendly name for this field")
                .example("Title"),
            type : joi.string().valid(fields)
                .required(),
            required : joi.boolean()
        }
    )
};
