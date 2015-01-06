/*jshint node:true */
"use strict";

exports.register = function(server, options, next) {
    // Default public files route
    server.route({
        method: "GET",
        path: "/{param*}",
        handler: {
            directory: {
                path: "public"
            }
        },
        config : {
            auth : false,
            plugins: {
                lout: false
            }
        }
    });
    
    next();
};

exports.register.attributes = {
    pkg : require("./package.json")
};
