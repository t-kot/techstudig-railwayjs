//テスト用のレコードを投入
require('../test_helper.js');
var sinon = require('sinon');
client = require('socket.io-client');
var mongoose = require('mongoose');

function createObjectId(str){
    return mongoose.mongo.BSONPure.ObjectID.fromString(str);
}

Game.destroyAll(function(){
    User.destroyAll(function(){
        Game1 = {
            id: createObjectId('4edd40c86762e0fb12000005'),
            ownerId: '1',
            ownerName: 'tanaka',
            title: 'test title',
            type: 2,
            mode: 1,
            createdAt: new Date()
        };
        Game2 = {
            id: createObjectId('4edd40c86762e0fb12000002'),
            ownerId: 'asdfgg',
            ownerName: 'miki',
            title: 'fukuda',
            type: 1,
            mode: 2,
            createdAt: new Date()
        };
        User1 = {
            id: createObjectId('4edd40c86762e0fb12000003'),
            name: 'tanaka',
            password: 'oohira',
            createdAt: new Date(),
            star: 10,
            type: 1
        };
        User2 = {
            id: createObjectId('4edd40c86762e0fb12000004'),
            name: 'nakasone',
            password: 'takeshita',
            createdAt: new Date(),
            star: 20,
            type: 2
        };
        console.log("hogehoge");
        User.create(User1,function(err,user1){
            console.log(err);
            console.log(user1);
            User.create(User2,function(err,user2){
                console.log(err);
                console.log(user2);
                Game.create(Game1,function(err,game1){
                    console.log(err);
                    console.log(game1);
                    Game.create(Game2,function(err,game2){
                        console.log(err);
                        console.log(game2);
                        socket = client.connect('http://localhost:3000/');
                        socket.emit("enterGame",{gameId:game1.id,userId:user1.id});
                    });
                });
            });
        });


    });
});

