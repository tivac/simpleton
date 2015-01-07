"use strict";

var boom = require("boom");

module.exports = function(req, reply) {
    req.models.types.remove(
        { _id : req.params.id },
        {},
        function(error, removed) {
            if(error) {
                return reply(error);
            }

            if(!removed) {
                return reply(boom.notFound("Unknown Type"));
            }

            reply({ removed : removed });
        }
    );
};
