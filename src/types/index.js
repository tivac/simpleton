/*jshint node:true */
"use strict";

var joi  = require("joi"),
    boom = require("boom"),
    validators = {
        id   : joi.string().length(16),
        type : joi.object().keys({
            name   : joi.string(),
            fields : joi.array().includes(
                joi.object().keys({
                    name : joi.string().min(1),
                    type : joi.array().includes(
                        joi.string().valid([
                            "markdown",
                            "text",
                            "url",
                            "title",
                            "image",
                            "video"
                        ])
                    )
                })
            )
        })
    };

exports.register = function(plugin, options, next) {
    // Get All
    plugin.route({
        path    : "/types",
        method  : "GET",
        handler : function(req, reply) {
            req.models.types.find({}, reply);
        }
    });
    
    // Get One
    plugin.route({
        path    : "/types/{id}",
        method  : "GET",
        config  : {
            validate : {
                params : {
                    id : validators.id
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
    plugin.route({
        path    : "/types",
        method  : "POST",
        config  : {
            validate : {
                payload : validators.type
            }
        },
        handler : function(req, reply) {
            req.models.types.insert(req.payload, reply);
        }
    });
    
    // Edit One
    plugin.route({
        path    : "/types/{id}",
        method  : "PUT",
        config  : {
            validate : {
                params : {
                    id : validators.id
                },
                payload : validators.type
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
    plugin.route({
        path    : "/types/{id}",
        method  : "DELETE",
        config  : {
            validate : {
                params : {
                    id : validators.id
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
