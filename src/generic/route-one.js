"use strict";

var boom = require("boom");

module.exports = function(collection, name) {
    return function(req, reply) {
        req.models[collection].findOne(
            { _id : req.params.id },
            function(error, doc) {
                if(error) {
                    return reply(error);
                }

                if(!doc) {
                    return reply(boom.notFound("Unknown " + name));
                }

                reply(doc);
            }
        );
    };
};
