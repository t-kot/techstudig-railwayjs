//var fixture = require('../db/fixture');
var sync = require('synchronize');
var fs = require('fs');
var cwd = process.cwd();
var fixture = JSON.parse(require('fs').readFileSync(cwd + '/db/fixtures.json'));

var Server = require('mongo-sync').Server;
var server = new Server('localhost');
var db = server.db('techstudig_test');
sync.fiber(function(){
    for(var collection in fixture){
        //var cols = db.getCollection(collection);
        //if(cols.count() !== 0){
        //    cols.drop();
        //}
        console.log(fixture[collection]);
        for(var model in fixture[collection]){
        //    console.log(model);
        //    db[collection].save(fixture[collection][model]);
        }
    }
});

