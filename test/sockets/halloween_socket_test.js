//テスト用のレコードを投入
require('../test_helper.js');
var sinon = require('sinon');
client = require('socket.io-client');
var mongoose = require('mongoose');

//ここのうまい書き方がよく分からなかった
function loadObjectId(callback){
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
            callback({users:userIds,games:gameIds});
        });
    });
}

loadObjectId(function(results){
    var gameIds = results.games;
    var userIds = results.users;
    var socket = client.connect('http://localhost:3000/');
    socket.on('connect', function(){
        console.log('yea!');
    });
    socket.emit("enterGame",{gameId:gameIds[0], userId:userIds[0]});
});
