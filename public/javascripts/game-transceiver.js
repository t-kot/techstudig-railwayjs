var TRANSCEIVER = {};
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

socket.on('scoreResult', function(star){
    console.log("You got " + star);
});

// TRANSFER
TRANSCEIVER.enterGame = function(){
    id = location.href.split("/").pop();
    socket.emit("enterGame",id);
};

TRANSCEIVER.sendScore = function(score){
    console.log("send score");
    var user = $.cookie("user_id");
    socket.emit("sendScore", {score:score, user_id:user});
};

