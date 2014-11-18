/*jshint node:true */
"use strict";

var joi = require("joi"),
    dumb = function(req, reply) {
        reply({ "text" : "hi" });
    };

exports.register = function(plugin, options, next) {
    // Get All
    plugin.route({
        path    : "/api/releases",
        method  : "GET",
        handler : dumb
    });
    
    // Get One
    plugin.route({
        path    : "/api/releases/{id}",
        method  : "GET",
        handler : dumb,
        config  : {
            validate : {
                params : {
                    id : joi.number().integer().min(1)
                }
            }
        }
    });
    
    // Create One
    plugin.route({
        path    : "/api/releases",
        method  : "POST",
        handler : dumb,
        config  : {
            validate : {
                payload : joi.object().keys({
                    name : joi.string(),
                    live : joi.date().optional()
                })
            }
        }
    });
    
    // Edit One
    plugin.route({
        path    : "/api/releases/{id}",
        method  : "PUT",
        handler : dumb,
        config  : {
            validate : {
                params : {
                    id : joi.number().integer().min(1)
                }
            }
        }
    });
    
    // Delete One
    plugin.route({
        path    : "/api/releases/{id}",
        method  : "DELETE",
        handler : dumb,
        config  : {
            validate : {
                params : {
                    id : joi.number().integer().min(1)
                }
            }
        }
    });
    
    next();
};

exports.register.attributes = {
    pkg : require("./package.json")
};
