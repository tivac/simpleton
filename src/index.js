/*jshint node:true */
"use strict";

var Hapi  = require("hapi"),
    server = new Hapi.Server(3000);

server.pack.register([
    {
        plugin  : require("good"),
        options : {
            reporters : [{
                reporter : require("good-console"),
                args : [{ log : "*", request : "*" }]
            }]
        }
    },
    require("blipp"),
    require("lout"),
    // My plugins
    require("./databases"),
    require("./releases"),
    require("./types"),
    require("./items"),
    require("./public")
], {
    route : {
        prefix : "/api"
    }
}, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {
        server.log("info", "Server running at: " + server.info.uri);
    });
});
