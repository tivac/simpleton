"use strict";

module.exports = function(collection) {
    return function(req, reply) {
        req.models[collection].find({}, function(error, docs) {
            if(error) {
                return reply(error);
            }
            
            reply(docs.map(function(doc) {
                return doc._id;
            }));
        });
    };
};
