/*jshint node:true */
"use strict";

exports.register = function(server, options, next) {
    server.route([
        // Get All
        {
            path    : "/releases",
            method  : "GET",
            handler : require("./route-all")
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
            handler : require("./route-one")
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
            handler : require("./route-create")
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
            handler : require("./route-edit")
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
            handler : require("./route-delete")
        }
    ]);
    
    next();
};

exports.register.attributes = {
    pkg : require("./package.json")
};
