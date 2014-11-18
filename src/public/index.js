/*jshint node:true */
"use strict";

exports.register = function(plugin, options, next) {
    // Default public files route
    plugin.route({
        method: "GET",
        path: "/{param*}",
        handler: {
            directory: {
                path: "public"
            }
        },
        config : {
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
