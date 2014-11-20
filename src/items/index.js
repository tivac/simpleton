/*jshint node:true */
"use strict";

var joi  = require("joi"),
    boom = require("boom"),
    valid = {
        id : joi.string().length(16)
    };

function validate(type) {
    switch(type) {
        case "text":
        case "markdown":
        case "title" :
            return joi.string();

        case "image" :
        case "url"   :
        case "video" :
            return joi.string().regex("./regex-url", "URL");
        
        default:
            return joi.any();
    }
}

exports.register = function(plugin, options, next) {
    var db = plugin.app.models.types;
    
    db.find({}, function(err, types) {
        if(err) {
            return next(err);
        }
        
        // Build dynamic validators for each type
        // TODO: won't re-build on change.
        types.forEach(function(type) {
            var validator = {};
            
            type.fields.forEach(function(field) {
                validator[field.name] = validate(field.type);
                
                if(field.required) {
                    validator[field.name].required();
                }
            });
            
            valid[type.name] = validator;
        });
        
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
