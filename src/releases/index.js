/*jshint node:true */
"use strict";

var boom = require("boom"),
    valid = {
        id      : require("../valid-id"),
        release : require("./valid-release")
    };

exports.register = function(plugin, options, next) {
    // Get All
    plugin.route({
        path    : "/releases",
        method  : "GET",
        handler : function(req, reply) {
            req.models.releases.find({}, function(error, docs) {
                if(error) {
                    return reply(error);
                }
                
                reply(docs.map(function(doc) { return doc._id; }));
            });
        }
    });
    
    // Get One
    plugin.route({
        path    : "/releases/{id}",
        method  : "GET",
        config  : {
            validate : {
                params : {
                    id : valid.id
                }
            }
        },
        handler : function(req, reply) {
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
        }
    });
    
    // Create One
    plugin.route({
        path    : "/releases",
        method  : "POST",
        config  : {
            validate : {
                payload : valid.release
            }
        },
        handler : function(req, reply) {
            req.models.releases.insert(req.payload, reply);
        }
    });
    
    // Edit One
    plugin.route({
        path    : "/releases/{id}",
        method  : "PUT",
        config  : {
            validate : {
                params : {
                    id : valid.id
                },
                payload : valid.release
            }
        },
        handler : function(req, reply) {
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
        }
    });
    
    // Delete One
    plugin.route({
        path    : "/releases/{id}",
        method  : "DELETE",
        config  : {
            validate : {
                params : {
                    id : valid.id
                }
            }
        },
        handler : function(req, reply) {
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
        }
    });
    
    next();
};

exports.register.attributes = {
    pkg : require("./package.json")
};
