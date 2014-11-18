/*jshint node:true */
"use strict";

var async    = require("async"),
    Nedb     = require("nedb");

exports.register = function(plugin, options, next) {
    async.parallel({
        releases : function(cb) {
            var db = new Nedb({ filename : "../data/releases.db" });
            
            db.loadDatabase(function(err) {
                if(err) {
                    return cb(err);
                }
                
                cb(null, db);
            });
        },
        types    : function(cb) {
            var db = new Nedb({ filename : "../data/types.db" });
            
            db.loadDatabase(function(err) {
                if(err) {
                    return cb(err);
                }
                
                cb(null, db);
            });
        },
        users    : function(cb) {
            var db = new Nedb({ filename : "../data/users.db" });
            
            db.loadDatabase(function(err) {
                if(err) {
                    return cb(err);
                }
                
                cb(null, db);
            });
        }
    }, function(error, models) {
        if(error) {
            return next(error);
        }
        
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
