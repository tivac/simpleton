"use strict";

var got = require("got"),
    boom = require("boom"),
    hoek = require("hoek");

exports.register = function(server, options, next) {
    // Cookie auth is automatically applied to most routes
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

    // OAuth setup for /login route
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
            password     : "fooga",
            clientId     : "43B254C9-F61B-E311-AEF8-0017A47704A4",
            clientSecret : "DA15D9B7-60EE-47E2-9CCF-525F20FE7EB0",
            isSecure     : false
        });

    });
    
    server.route({
        method : [ "GET", "POST" ],
        path : "/login",
        config : {
            auth : {
                strategy : "oauth",
                mode     : "required"
            },
            handler : function(req, reply) {
                if(!req.auth.isAuthenticated) {
                    return reply(boom.unauthorized("Authentication failed due to: " + req.auth.error.message));
                }

                // TODO: turn session token into portal user details
                got("https://api-dev.ncplatform.net/v2/me?access_token=" + req.auth.credentials.token, function(err, data) {
                    if(err) {
                        return reply(boom.unauthorized(err));
                    }

                    data = JSON.parse(data);

                    req.auth.session.set(hoek.applyToDefaults(req.auth.credentials, data));
                
                    reply.redirect("/");
                });
            }
        }
    });

    server.route({
        method : "GET",
        path : "/logout",
        config : {
            auth : false,
            handler : function(req, reply) {
                req.auth.session.clear();

                reply.redirect("/");
            }
        }
    });

    next();
};

exports.register.attributes = {
    pkg : require("./package.json")
};
