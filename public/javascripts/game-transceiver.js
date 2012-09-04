var TRANSCEIVER = {};
var host = location.href;
var socket = io.connect("/");

// RECEIVER
socket.on("connection", function(msg){
    console.log("connection receive!");
});
socket.on("user_in",function(data){
    console.log(data);
    GetGameParam.prototype.NOW_PLAYING = data;
});
socket.on("user_out",function(data){
    GetGameParam.prototype.NOW_PLAYING = data;
});

socket.on('score_news_push', function(msg){
    console.log(arc);
    console.log("receive score");
    console.log(msg);
    var text = new arc.display.TextField();
    text.setFont("Monotype Corsiva", 20, true);
    text.setColor(0xFFFFFF);
    text.setX(100);
    text.setY(200);
    text.setText(msg.point + "Get!");
    GetGameParam.prototype.GAME_HANDLER.addChild(text);

});

// TRANSFER
TRANSCEIVER.enterGame = function(){
    socket.emit("enterGame",{});
};

TRANSCEIVER.sendScore = function(score){
    console.log("send score");
    var user = $.cookie("user_id");
    socket.emit("scoreSend", {score:score, user_id:user});
};

