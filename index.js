/*jshint node:true */
"use strict";

var path = require("path"),
    orm = require("orm");

orm.connect("sqlite://db.sqlite", function(err, db) {
    if(err) {
        return console.error(err);
    }
     
    db.load("./models/release", function(err) {
        var Release = db.models.release;
        
        Release.sync(function() {
            Release.find({
                name : "Fooga"
            }, function(err, releases) {
                
                releases.forEach(function(release) {
                    release.launch = new Date();
                    
                    release.save();
                });
            });
        });
    });
});
