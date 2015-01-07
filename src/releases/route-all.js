"use strict";

module.exports = function(req, reply) {
    req.models.releases.find({}, function(error, docs) {
        if(error) {
            return reply(error);
        }
        
        reply(docs.map(function(doc) { return doc._id; }));
    });
};
