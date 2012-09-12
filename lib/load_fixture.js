exports.load = function(setting){
    // setting {path: "/db/fixtures.json", host: "localhost", db: "techstudig_test"}
    var path = setting.path || "/db/fixtures.json";
    var host = setting.host || "localhost";
    var sync = require('synchronize');
    var fs = require('fs');
    var mongoSync = require('mongo-sync');
    var cwd = process.cwd();
    var fixture = JSON.parse(fs.readFileSync(cwd + path));
    var Server = mongoSync.Server;
    var server = new Server(host);
    var db = server.db(setting.db);
    sync.fiber(function(){
        for(var collection in fixture){
            var cols = db.getCollection(collection);
            if(cols.count() !==0){
                cols.drop();
            }
            for(var model in fixture[collection]){
                db[collection].save(fixture[collection][model]);
            }
        }
    });
};
