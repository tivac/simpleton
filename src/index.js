/*jshint node:true */
"use strict";

var path = require("path"),
    
    Nedb  = require("nedb"),
    
    Hapi  = require("hapi"),
    Good  = require("good"),
    Blipp = require("blipp"),
    
    shell = require("shelljs"),
    
    server = new Hapi.Server(3000),
    
    releases = new Nedb({ filename : "../data/releases.db", autoload : true }),
    types    = new Nedb({ filename : "../data/types.db", autoload : true }),
    users    = new Nedb({ filename : "../data/users.db", autoload : true });

// Default public files route
server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'public'
        }
    }
});

server.pack.register([
    {
        plugin : Good,
        options : {
            reporters : [{
                reporter : require("good-console"),
                args : [{ log : "*", request : "*" }]
            }]
        }
    },
    //{ plugin : Blipp },
    { plugin : require("./releases") }
], function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {
        server.log("info", "Server running at: " + server.info.uri);
    });
});
