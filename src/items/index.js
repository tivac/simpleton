/*jshint node:true */
"use strict";

var joi  = require("joi"),
    boom = require("boom"),
    urlRegex = require("./regex-url"),
    valid = {
        id : require("../valid-id")
    };

function validate(type) {
    switch(type) {
        case "text" :
        case "title" :
        case "markdown" :
            return joi.string();

        case "url" :
        case "image" :
        case "video" :
            return joi.string().regex(urlRegex, "URL");
        
        default:
            return joi.any();
    }
}

exports.register = function(plugin, options, next) {
    var db = plugin.app.models.types;
    
    db.find({}, function(err, types) {
        var schemas = [];
        
        if(err) {
            return next(err);
        }
        
        // Build dynamic validators for each type
        // TODO: won't re-build on type edit
        types.forEach(function(type) {
            var validator = {
                    type    : joi.string().allow(type.name)
                };
            
            type.fields.forEach(function(field) {
                validator[field.name] = validate(field.type);
                
                if(field.required) {
                    validator[field.name].required();
                }
            });
            
            schemas.push(validator);
        });
        
        valid.types = schemas.length ? joi.alternatives().try(schemas) : joi.any();
        
        // Get All
        plugin.route({
            path    : "/items",
            method  : "GET",
            handler : function(req, reply) {
                req.models.items.find({}, function(error, docs) {
                    if(error) {
                        return reply(error);
                    }
                    
                    reply(docs.map(function(doc) { return doc._id; }));
                });
            }
        });
        
        // Get One
        plugin.route({
            path    : "/items/{id}",
            method  : "GET",
            config  : {
                validate : {
                    params : {
                        id : valid.id
                    }
                }
            },
            handler : function(req, reply) {
                req.models.items.findOne(
                    { _id : req.params.id },
                    function(error, doc) {
                        if(error) {
                            return reply(error);
                        }

                        if(!doc) {
                            return reply(boom.notFound("Unknown Item"));
                        }

                        reply(doc);
                    }
                );
            }
        });
        
        // Create One
        plugin.route({
            path    : "/items",
            method  : "POST",
            config  : {
                validate : {
                    payload : valid.types
                }
            },
            handler : function(req, reply) {
                req.models.items.insert(req.payload, reply);
            }
        });
        
        // Edit One
        plugin.route({
            path    : "/items/{id}",
            method  : "PUT",
            config  : {
                validate : {
                    params : {
                        id : valid.id
                    }
                }
            },
            handler : function(req, reply) {
                req.models.items.update(
                    { _id : req.params.id },
                    req.payload,
                    {},
                    function(error, modified) {
                        if(error) {
                            return reply(error);
                        }

                        if(!modified) {
                            return reply(boom.notFound("Unknown Item"));
                        }

                        reply({ modified : modified });
                    }
                );
            }
        });
        
        // Delete One
        plugin.route({
            path    : "/items/{id}",
            method  : "DELETE",
            config  : {
                validate : {
                    params : {
                        id : valid.id
                    }
                }
            },
            handler : function(req, reply) {
                req.models.items.remove(
                    { _id : req.params.id },
                    {},
                    function(error, removed) {
                        if(error) {
                            return reply(error);
                        }

                        if(!removed) {
                            return reply(boom.notFound("Unknown Item"));
                        }

                        reply({ removed : removed });
                    }
                );
            }
        });
        
        next();
    });
};

exports.register.attributes = {
    pkg : require("./package.json")
};
