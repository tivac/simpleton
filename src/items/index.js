/*jshint node:true */
"use strict";

var joi      = require("joi"),
    urlRegex = require("./regex-url");

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

exports.register = function(server, options, next) {
    var db = server.app.models.types;
    
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
        
        server.route([
            // Get All
            {
                path    : "/items",
                method  : "GET",
                handler : require("../generic/route-all")("items", "Item")
            },
            
            // Get One
            {
                path    : "/items/{id}",
                method  : "GET",
                config  : {
                    validate : {
                        params : {
                            id : require("../valid-id")
                        }
                    }
                },
                handler : require("../generic/route-one")("items", "Item")
            },
            
            // Create One
            {
                path    : "/items",
                method  : "POST",
                config  : {
                    validate : {
                        payload : schemas.length ? joi.alternatives().try(schemas) : joi.any()
                    }
                },
                handler : require("../generic/route-create")("items", "Item")
            },
            
            // Edit One
            {
                path    : "/items/{id}",
                method  : "PUT",
                config  : {
                    validate : {
                        params : {
                            id : require("../valid-id")
                        }
                    }
                },
                handler : require("../generic/route-edit")("items", "Item")
            },
            
            // Delete One
            {
                path    : "/items/{id}",
                method  : "DELETE",
                config  : {
                    validate : {
                        params : {
                            id : require("../valid-id")
                        }
                    }
                },
                handler : require("../generic/route-delete")("items", "Item")
            }
        ]);
        
        next();
    });
};

exports.register.attributes = {
    pkg : require("./package.json")
};
