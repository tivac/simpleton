"use strict";

module.exports = function(collection) {
    return function(req, reply) {
        req.models[collection].insert(req.payload, reply);
    };
};
