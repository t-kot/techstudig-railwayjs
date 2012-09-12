var scores = require('../../lib/score').scores;

exports['calculateRanking'] = {
    setUp: function (callback){
        scores.game1={
            user1:[10,20,30],
            user2:[20,10,40],
            user3:[50,10,20]
        };
        scores.game2={
            user1:[10,80,30],
            user2:[40,20,40],
            user3:[10,50,40]
        };
        scores.game3={
            user1:[10,80,40],
            user2:[40,20,40],
            user3:[10,50,40]
        };
        callback();
    },
    'game1ではuser1は2位であること': function(test){
        test.equal(scores.calculateRanking("game1","user1"),2);
        test.done();
    },
    'game1ではuser2は1位であること': function(test){
        test.equal(scores.calculateRanking("game1","user2"),1);
        test.done();
    },
    'game2ではuser2は1位であること': function(test){
        test.equal(scores.calculateRanking("game2","user2"),1);
        test.done();
    },
    'game2ではuser1は3位であること': function(test){
        test.equal(scores.calculateRanking("game2","user1"),3);
        test.done();
    },
    'game3では全員1位であること': function(test){
        test.equal(scores.calculateRanking("game3","user1"),1);
        test.equal(scores.calculateRanking("game3","user2"),1);
        test.equal(scores.calculateRanking("game3","user3"),1);
        test.done();
    }
};

exports['calculateRanking'] = {
    setUp: function (callback){
        scores.game1={
            user1:[10,20,30],
            user2:[20,10,40],
            user3:[50,10,20]
        };
        scores.game2={
            user1:[10,80,30],
            user2:[40,20,40],
            user3:[10,50,40]
        };
        scores.game3={
            user1:[10,80,40],
            user2:[40,20,40],
            user3:[10,50,40]
        };
        callback();
    },
    'game1ではuser1はnoRateのときスターを0獲得すること': function(test){
        test.equal(scores.calculateStar({gameId:"game1",userId:"user1",connect:3,gameMode:3}), 0);
        test.done();
    },
    'game1ではuser1はmode1のときスターを0獲得すること': function(test){
        test.equal(scores.calculateStar({gameId:"game1",userId:"user1",connect:3,gameMode:1}), 0);
        test.done();
    },
    'game1ではuser2はmode1のときスターを1獲得すること': function(test){
        test.equal(scores.calculateStar({gameId:"game1",userId:"user2",connect:3,gameMode:1}), 1);
        test.done();
    },
    'game1ではuser2はmode2のときスターを3獲得すること': function(test){
        test.equal(scores.calculateStar({gameId:"game1",userId:"user2",connect:3,gameMode:2}), 3);
        test.done();
    }
};

