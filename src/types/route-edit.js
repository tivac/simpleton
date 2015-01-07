"use strict";

var boom = require("boom");

module.exports = function(req, reply) {
    req.models.types.update(
        { _id : req.params.id },
        req.payload,
        {},
        function(error, modified) {
            if(error) {
                return reply(error);
            }

            if(!modified) {
                return reply(boom.notFound("Unknown Type"));
            }

            reply({ modified : modified });
        }
    );
};
