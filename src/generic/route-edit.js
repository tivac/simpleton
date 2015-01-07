"use strict";

var boom = require("boom");

module.exports = function(collection, name) {
    return function(req, reply) {
        req.models[collection].update(
            { _id : req.params.id },
            req.payload,
            {},
            function(error, modified) {
                if(error) {
                    return reply(error);
                }

                if(!modified) {
                    return reply(boom.notFound("Unknown " + name));
                }

                reply({ modified : modified });
            }
        );
    };
};
