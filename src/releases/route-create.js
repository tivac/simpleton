"use strict";

module.exports = function(req, reply) {
    req.models.releases.insert(req.payload, reply);
};
