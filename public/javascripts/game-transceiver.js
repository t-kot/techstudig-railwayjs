var host = location.href;
var socket = io.connect("/");

// RECEIVER
socket.on("connection", function(msg){
    console.log("connection receive!");
});
socket.on("userIn",function(data){
    console.log("Now playing is "+data);
    GetGameParam.prototype.NOW_PLAYING = data;
});
socket.on("userOut",function(data){
    console.log("Now playing is "+data);
    GetGameParam.prototype.NOW_PLAYING = data;
});

socket.on('scoreResult', function(data){
    console.log("You got " + data.star);
    console.log("Your score is " + data.ranking + "place for this term");
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
