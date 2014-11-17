/*jshint node:true */
"use strict";

module.exports = {
    method  : "GET",
    path    : "/",
    handler : function(req, reply) {
        reply("Hi");
    }
};
