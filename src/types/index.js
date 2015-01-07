/*jshint node:true */
"use strict";

exports.register = function(server, options, next) {
    server.route([
        // Get All
        {
            path    : "/types",
            method  : "GET",
            handler : require("../generic/route-all")("types", "Type")
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
            handler : require("../generic/route-one")("types", "Type")
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
            handler : require("../generic/route-create")("types", "Type")
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
            handler : require("../generic/route-edit")("types", "Type")
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
            handler : require("../generic/route-delete")("types", "Type")
        }
    ]);

    
    next();
};

exports.register.attributes = {
    pkg : require("./package.json")
};
