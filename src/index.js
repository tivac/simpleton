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

// Debugging route
server.route({
    method : "GET",
    path : "/",
    handler : function(req, reply) {
        reply("hi");
    },
    config : {
        auth : false
    }
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

// Cookie auth on most routes
server.register(require("hapi-auth-cookie"), function(err) {
    if(err) {
        throw err;
    }

    server.auth.strategy("session", "cookie", "required", {
        // TODO: This needs to be a real password
        password : "secret",
        cookie   : "s",
        isSecure : false
    });
});

// OAuth, has to come before any of our routes are added
server.register(require("bell"), function(err) {
    if(err) {
        throw err;
    }

    server.auth.strategy("oauth", "bell", {
        provider : {
            protocol : "oauth2",
            auth     : "https://account-dev.ncplatform.net/oauth2/authorization",
            token    : "https://account-dev.ncplatform.net/oauth2/token",
            version  : "2",
            scope    : [ "account" ]
        },
        // TODO: This needs to be a real password
        password : "fooga",
        clientId : "43B254C9-F61B-E311-AEF8-0017A47704A4",
        clientSecret : "DA15D9B7-60EE-47E2-9CCF-525F20FE7EB0",
        isSecure : false
    });

    server.route({
        method : [ "GET", "POST" ],
        path : "/login",
        config : {
            auth : {
                strategy : "oauth",
                mode : "try"
            },
            handler : function(req, reply) {
                if(!req.auth.isAuthenticated) {
                    return reply("Authentication failed due to: " + req.auth.error.message);
                }

                req.auth.session.set(req.auth.credentials);
                
                reply("authed");
            }
        }
    });
});

// Simpleton plugins
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
