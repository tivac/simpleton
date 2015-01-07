"use strict";

var boom = require("boom");

module.exports = function(req, reply) {
    req.models.releases.update(
        { _id : req.params.id },
        req.payload,
        {},
        function(error, modified) {
            if(error) {
                return reply(error);
            }

            if(!modified) {
                return reply(boom.notFound("Unknown Release"));
            }

            reply({ modified : modified });
        }
    );
};
