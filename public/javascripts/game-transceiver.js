var host = location.href;
var socket = io.connect("/");
var NEWSTYPE = {
    excellentScore:1,
    jackpot:2,
    connectingNum:3
};

// RECEIVER
socket.on("connection", function(msg){
    console.log("connection receive!");
});
socket.on("userStatus", function(data){
    console.log("You have "+data.star+" stars now");
    console.log("Welcome "+data.name+"!");
});
socket.on("userIn",function(data){
    console.log("Now playing is "+data);
    GetGameParam.prototype.NOW_PLAYING = data;
});
socket.on("userOut",function(data){
    console.log("Now playing is "+data);
    GetGameParam.prototype.NOW_PLAYING = data;
});

socket.on('scoreResult', function(ranking){
    console.log("Your score is " + ranking + "place for this term");
});
socket.on('starResult', function(star){
    console.log("You got " + star);
});
socket.on('news', function(news){
    console.log("news!!!!!!!!!");
    switch(news.type){
        case NEWSTYPE.excellentScore:
            console.log("excellent score!");
            break;
        case NEWSTYPE.jackpot:
            console.log("jackpot!");
            break;
        case NEWSTYPE.connectingNum:
            console.log("connecting num!");
            break;
    }
});

// TRANSMITTER
TRANSMITTER = {
    enterGame: function(){
        userId = $.cookie("user_id");
        gameId = this.util.getMongoId();
        socket.emit("enterGame",{gameId:gameId,userId:userId});
    },
    sendScore: function(score){
        console.log("send score");
        var userId = $.cookie("user_id");
        socket.emit("sendScore", {score:score, userId:userId});
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
