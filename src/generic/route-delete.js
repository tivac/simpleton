"use strict";

var boom = require("boom");

module.exports = function(collection, name) {
    return function(req, reply) {
        req.models[collection].remove(
            { _id : req.params.id },
            {},
            function(error, removed) {
                if(error) {
                    return reply(error);
                }

                if(!removed) {
                    return reply(boom.notFound("Unknown " + name));
                }

                reply({ removed : removed });
            }
        );
    };
};
