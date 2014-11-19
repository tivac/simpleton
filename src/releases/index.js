/*jshint node:true */
"use strict";

var joi  = require("joi"),
    boom = require("boom"),
    validators = {
        id      : joi.string().length(16),
        release : joi.object().keys({
            name : joi.string(),
            live : joi.date().optional()
        })
    };

exports.register = function(plugin, options, next) {
    // Get All
    plugin.route({
        path    : "/releases",
        method  : "GET",
        handler : function(req, reply) {
            req.models.releases.find({}, reply);
        }
    });
    
    // Get One
    plugin.route({
        path    : "/releases/{id}",
        method  : "GET",
        config  : {
            validate : {
                params : {
                    id : validators.id
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
                payload : validators.release
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
                    id : validators.id
                },
                payload : validators.release
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
                    id : validators.id
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
