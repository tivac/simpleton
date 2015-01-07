"use strict";

module.exports = function(req, reply) {
    req.models.types.insert(req.payload, reply);
};
