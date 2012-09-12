//テスト用のレコードを投入
var fixture = require('../../db/fixture');
var sinon = require('sinon');
client = require('socket.io-client');
var sync = require('synchronize');
var mongoose = require('mongoose');
var fs = require('fs');




var targets = ["users","games"];
var Server = require('mongo-sync').Server;
var server = new Server('localhost');
var db = server.db('techstudig_test');
sync.fiber(function(){
    for(var collection in fixture){
        var cols = db.getCollection(collection);
        if(cols.count() !== 0){
            cols.drop();
        }
        for(var model in fixture[collection]){
            console.log(model);
            console.log(fixture[collection]);
            db[collection].save(fixture[collection][model]);
        }
    }
});
