"use strict";

var boom = require("boom");

module.exports = function(req, reply) {
    req.models.releases.findOne(
        { _id : req.params.id },
        function(error, doc) {
            if(error) {
                return reply(error);
            }

            if(!doc) {
                return reply(boom.notFound("Unknown Release"));
            }

            reply(doc);
        }
    );
};
