var host = location.href;
var socket = io.connect("/");
var NEWSTYPE = {
    excellentScore:1,
    jackpot:2,
    kiribanScore:3
};

// RECEIVER
socket.on("connection", function(msg){
    console.log("connection receive!");
});
socket.on("userStatus", function(data){
    GameCtrl.prototype.STAR = data.star;
    if (data.star < 10){
        GameCtrl.prototype.GRADE = "Troy";
    }else if(data.star >=10 && data.star<30){
        GameCtrl.prototype.GRADE = "Horse";
    }else if(data.star >=30 && data.star < 100){
        GameCtrl.prototype.GRADE = "Pumpkin";
    }else{
        GameCtrl.prototype.GRADE = "Knight";
    }
    console.log("You have "+data.star+" stars now");
    console.log("Welcome "+data.name+"!");
});
socket.on("userIn",function(data){
    GameCtrl.prototype.CONNECTS_NUM = data.connect;
    GameCtrl.prototype.JACKPOT = data.jackpot;
    switch(data.connect){
        case 100:
            if(GameCtrl.prototype.NEWS === null){
                GameCtrl.prototype.NEWS = "接続人数が100人を超えました！";
            }
            break;
        case 500:
            if(GameCtrl.prototype.NEWS === null){
                GameCtrl.prototype.NEWS = "接続人数が500人を超えました！";
            }
            break;
        case 1000:
            if(GameCtrl.prototype.NEWS === null){
                GameCtrl.prototype.NEWS = "接続人数が1000人を超えました！";
            }
            break;
    }
});
socket.on("userOut",function(data){
    GameCtrl.prototype.CONNECTS_NUM = data;
});

socket.on('scoreResult', function(data){
    console.log("ラップスコアは" + GameCtrl.prototype.CONNECTS_NUM +"人中 "+data.ranking + "位です！");
    if(data.star > 0){
        msg = data.star + "個スターを獲得しました！";
        GameCtrl.prototype.STAR += data.star;
    }else if(data.star < 0){
        msg = -data.star + "個スターを失いました...";
        GameCtrl.prototype.STAR += data.star;
    }else{
        msg = '';
    }
    if(GameCtrl.prototype.NEWS === null){
        GameCtrl.prototype.NEWS = "ラップスコアは"+data.score+"点! "+GameCtrl.prototype.CONNECTS_NUM +"人中 "+data.ranking + "位!"+msg;
    }
});
//socket.on('starResult', function(star){
//    console.log("You got " + star);
//});
socket.on('news', function(news){
    console.log("news!!!!!!!!!");
    switch(news.type){
        case NEWSTYPE.excellentScore:
            console.log("excellent score! "+news.data.user+" got "+news.data.score+" score!");
            msg = "excellent score! "+news.data.user+"さんがラップスコアで"+news.data.score+"点を記録しました";
            break;
        case NEWSTYPE.jackpot:
            msg = "Congulaturation!!! "+news.data.user+"さんがジャックポットを獲得しました";
            GameCtrl.prototype.JACKPOT = 100;
            console.log(msg);
            break;
        case NEWSTYPE.kiribanScore:
            msg = news.data.user+"さんの合計スコアが"+news.data.score+"点を突破しました";
            console.log(msg);
            break;
    }
    if(GameCtrl.prototype.NEWS === null){
        GameCtrl.prototype.NEWS = msg;
    }
});
socket.on('emergeBoss', function(){
    console.log("boss!");
    if(!GameCtrl.prototype.BOSS_FLAG){
        GameCtrl.prototype.EMERGE_BOSS = true;
    }
});

// TRANSMITTER
TRANSMITTER = {
    enterGame: function(){
        userId = $.cookie("user_id");
        gameId = this.util.getMongoId();
        socket.emit("enterGame",{gameId:gameId,userId:userId});
    },
    sendScore: function(score,total){
        var userId = $.cookie("user_id");
        socket.emit("sendScore", {score:score, userId:userId,total:total});
    },
    util:{
        getMongoId: function(){
            id = location.href.split("/").pop();
            end = id.indexOf("?");
            if(end > 0) {id = id.substr(0,end);}
            return id;
        }
    }
};
