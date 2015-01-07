/*jshint node:true */
"use strict";

exports.register = function(server, options, next) {
    server.route([
        // Get All
        {
            path    : "/types",
            method  : "GET",
            handler : require("./route-all")
        },
        
        // Get One
        {
            path    : "/types/{id}",
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
            path    : "/types",
            method  : "POST",
            config  : {
                validate : {
                    payload : require("./valid-type")
                }
            },
            handler : require("./route-create")
        },
        
        // Edit One
        {
            path    : "/types/{id}",
            method  : "PUT",
            config  : {
                validate : {
                    params : {
                        id : require("../valid-id")
                    },
                    payload : require("./valid-type")
                }
            },
            handler : require("./route-edit")
        },
        
        // Delete One
        {
            path    : "/types/{id}",
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
