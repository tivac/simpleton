/*jshint node:true */
"use strict";

var Hapi  = require("hapi"),
    server = new Hapi.Server();

server.connection({
    host : "localhost",
    port : 3000
});

server.register([
    require("lout"),
    {
        register : require("good"),
        options  : {
            reporters : [{
                reporter : require("good-console"),
                args : [{ log : "*", request : "*" }]
            }]
        }
    },
    // My plugins
    require("./databases"),
    require("./releases"),
    require("./types"),
    require("./items"),
    require("./public")
], {
    routes : {
        prefix : "/api"
    }
}, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }
});

server.route({
    method : "GET",
    path : "/",
    handler : function(req, reply) {
        reply("hi");
    }
});

server.start(function () {
    server.log("info", "Server running at: " + server.info.uri);
});
