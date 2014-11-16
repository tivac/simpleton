module.exports = function(db, cb) {
    db.define("release", {
        id     : { type : "serial", key : true },
        name   : { type : "text", required : true },
        launch : { type : "date" }
    });
    
    return cb();
};
