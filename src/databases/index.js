/*jshint node:true */
"use strict";

var path  = require("path"),
    async = require("async"),
    Nedb  = require("nedb"),
    
    dir   = path.resolve(__dirname, "../../data");

function loadDb(file, done) {
    var db = new Nedb({ filename : path.join(dir, file) });
            
    db.loadDatabase(function(err) {
        if(err) {
            return done(err);
        }
        
        done(null, db);
    });
}

exports.register = function(plugin, options, next) {
    async.parallel({
        releases : loadDb.bind(null, "releases.json"),
        types : loadDb.bind(null, "types.json"),
        users : loadDb.bind(null, "users.json"),
        items : loadDb.bind(null, "items.json")
    }, function(error, models) {
        if(error) {
            return next(error);
        }
        
        // Require that types have unique names
        models.types.ensureIndex({ fieldName : "name", unique : true }, function(error) {
            if(error) {
                next(error.message);
            }
        });
        
        // Require that items have unique URLs
        models.items.ensureIndex({ fieldName : "url", unique : true }, function(error) {
            if(error) {
                next(error.message);
            }
        });
        
        plugin.app.models = models;
        
        plugin.ext("onPreHandler", function(request, done) {
            request.models = models;
            
            done();
        });
        
        next();
        
    });
    
};

exports.register.attributes = {
    pkg : require("./package.json")
};
