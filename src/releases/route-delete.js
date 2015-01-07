"use strict";

var boom = require("boom");

module.exports = function(req, reply) {
    req.models.releases.remove(
        { _id : req.params.id },
        {},
        function(error, removed) {
            if(error) {
                return reply(error);
            }

            if(!removed) {
                return reply(boom.notFound("Unknown Release"));
            }

            reply({ removed : removed });
        }
    );
};
