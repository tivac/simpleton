/*jshint node:true */
"use strict";

function throwError(err) {
    if (err) {
        throw err;
    }
}

var Hapi  = require("hapi"),
    server = new Hapi.Server();

server.connection({
    host : "localhost",
    port : 3000
});

// Hapi Plugins
server.register([
    require("lout"),
    require("tv"),
    {
        register : require("good"),
        options  : {
            reporters : [{
                reporter : require("good-console"),
                args     : [{ log : "*", ops : "*", response : "*", error : "*" }]
            }]
        }
    },
], throwError);

// Auth
server.register([
    require("./auth")
], throwError);

// Debugging route
server.route({
    method : "GET",
    path : "/",
    handler : function(req, reply) {
        if(!req.auth.isAuthenticated) {
            reply("You aren't logged in");
        }

        reply("hi " + req.auth.credentials.name + "(" + req.auth.credentials.email + ")");
    },
    config : {
        auth : {
            strategy : "session",
            mode     : "try"
        }
    }
});

// API implementation plugins
server.register([
    require("./databases"),
    require("./releases"),
    require("./types"),
    require("./items"),
    require("./public")
], {
    routes : {
        prefix : "/api"
    }
}, throwError);

server.start(function () {
    server.log("info", "Server running at: " + server.info.uri);
});
