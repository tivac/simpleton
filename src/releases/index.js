/*jshint node:true */
"use strict";

var joi = require("joi"),
    dumb = function(req, reply) {
        console.log(req.models);
        
        reply({ "text" : "hi" });
    };

exports.register = function(plugin, options, next) {
    console.log(plugin.config);
    
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
                    id : joi.number().integer().min(1)
                }
            }
        },
        handler : function(req, reply) {
            req.models.releases.findOne({ _id : req.params.id }, reply);
        }
    });
    
    // Create One
    plugin.route({
        path    : "/releases",
        method  : "POST",
        config  : {
            validate : {
                payload : joi.object().keys({
                    name : joi.string(),
                    live : joi.date().optional()
                })
            }
        },
        handler : function(req, reply) {
            req.models.releases.insert(req.payload, function(error, doc) {
                if(error) {
                    return reply(error);
                }

                reply(doc);
            });
        }
    });
    
    // Edit One
    plugin.route({
        path    : "/releases/{id}",
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
        path    : "/releases/{id}",
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
