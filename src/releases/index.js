/*jshint node:true */
"use strict";

var dumb = function(req, reply) {
        reply({ "text" : "hi" });
    };

exports.register = function(plugin, options, next) {
    // Get All
    plugin.route({
        path    : "/api/release",
        method  : "GET",
        handler : dumb
    });
    
    // Add
    plugin.route({
        path    : "/api/release",
        method  : "POST",
        handler : dumb
    });
    
    // Get One
    plugin.route({
        path    : "/api/release/{id}",
        method  : "GET",
        handler : dumb
    });
    
    // Create One
    plugin.route({
        path    : "/api/release/{id}",
        method  : "POST",
        handler : dumb
    });
    
    // Edit One
    plugin.route({
        path    : "/api/release/{id}",
        method  : "PUT",
        handler : dumb
    });
    
    // Delete One
    plugin.route({
        path    : "/api/release/{id}",
        method  : "DELETE",
        handler : dumb
    });
};

exports.register.attributes = {
    pgk : require("./package.json")
};
