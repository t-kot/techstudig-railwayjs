//テスト用のレコードを投入
require('../test_helper.js');
var sinon = require('sinon');
client = require('socket.io-client');
var socket = client.connect('http://localhost:3000/');
var mongoose = require('mongoose');
var load_data =  function (callback){
        User.all({}, function(err,users){
            var userIds = [];
            for(var i=0; i<users.length; i++){
                userIds[i] = users[i].id;
            }
            Game.all({}, function(err,games){
                var gameIds = [];
                for(var i=0; i<games.length; i++){
                    gameIds[i] = games[i].id;
                    console.log(games[i].id);
                }
                this.userIds = userIds;
                this.gameIds = gameIds;
                this.socket = client.connect('http://localhost:3000/');
                callback();
            });
        });
};


exports['userIn'] = {
    'user1':function(test){
        socket.on("userStatus", function(data){
            test.ok(data.star);
            test.done();
        });
    }
};
