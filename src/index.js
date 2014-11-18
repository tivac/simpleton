/*jshint node:true */
"use strict";

var Nedb  = require("nedb"),
    
    Hapi  = require("hapi"),
    
    server = new Hapi.Server(3000),
    
    releases = new Nedb({ filename : "../data/releases.db", autoload : true }),
    types    = new Nedb({ filename : "../data/types.db", autoload : true }),
    users    = new Nedb({ filename : "../data/users.db", autoload : true });

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
    require("./releases"),
    require("./public")
], function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {
        server.log("info", "Server running at: " + server.info.uri);
    });
});
