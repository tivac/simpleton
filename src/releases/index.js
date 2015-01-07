/*jshint node:true */
"use strict";

exports.register = function(server, options, next) {
    server.route([
        // Get All
        {
            path    : "/releases",
            method  : "GET",
            handler : require("../generic/route-all")("releases", "Release")
        },
        
        // Get One
        {
            path    : "/releases/{id}",
            method  : "GET",
            config  : {
                validate : {
                    params : {
                        id : require("../valid-id")
                    }
                }
            },
            handler : require("../generic/route-one")("releases", "Release")
        },
        
        // Create One
        {
            path    : "/releases",
            method  : "POST",
            config  : {
                validate : {
                    payload : require("./valid-release")
                }
            },
            handler : require("../generic/route-create")("releases", "Release")
        },
        
        // Edit One
        {
            path    : "/releases/{id}",
            method  : "PUT",
            config  : {
                validate : {
                    params : {
                        id : require("../valid-id")
                    },
                    payload : require("./valid-release")
                }
            },
            handler : require("../generic/route-edit")("releases", "Release")
        },
        
        // Delete One
        {
            path    : "/releases/{id}",
            method  : "DELETE",
            config  : {
                validate : {
                    params : {
                        id : require("../valid-id")
                    }
                }
            },
            handler : require("../generic/route-delete")("releases", "Release")
        }
    ]);
    
    next();
};

exports.register.attributes = {
    pkg : require("./package.json")
};
