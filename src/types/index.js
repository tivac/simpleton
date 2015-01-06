/*jshint node:true */
"use strict";

var boom = require("boom"),
    valid = {
        id   : require("../valid-id"),
        type : require("./valid-type")
    };

exports.register = function(server, options, next) {
    // Get All
    server.route({
        path    : "/types",
        method  : "GET",
        handler : function(req, reply) {
            req.models.types.find({}, function(error, docs) {
                if(error) {
                    return reply(error);
                }
                
                reply(docs.map(function(doc) { return doc._id; }));
            });
        }
    });
    
    // Get One
    server.route({
        path    : "/types/{id}",
        method  : "GET",
        config  : {
            validate : {
                params : {
                    id : valid.id
                }
            }
        },
        handler : function(req, reply) {
            req.models.types.findOne(
                { _id : req.params.id },
                function(error, doc) {
                    if(error) {
                        return reply(error);
                    }

                    if(!doc) {
                        return reply(boom.notFound("Unknown Type"));
                    }

                    reply(doc);
                }
            );
        }
    });
    
    // Create One
    server.route({
        path    : "/types",
        method  : "POST",
        config  : {
            validate : {
                payload : valid.type
            }
        },
        handler : function(req, reply) {
            req.models.types.insert(req.payload, reply);
        }
    });
    
    // Edit One
    server.route({
        path    : "/types/{id}",
        method  : "PUT",
        config  : {
            validate : {
                params : {
                    id : valid.id
                },
                payload : valid.type
            }
        },
        handler : function(req, reply) {
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
        }
    });
    
    // Delete One
    server.route({
        path    : "/types/{id}",
        method  : "DELETE",
        config  : {
            validate : {
                params : {
                    id : valid.id
                }
            }
        },
        handler : function(req, reply) {
            req.models.types.remove(
                { _id : req.params.id },
                {},
                function(error, removed) {
                    if(error) {
                        return reply(error);
                    }

                    if(!removed) {
                        return reply(boom.notFound("Unknown Type"));
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
