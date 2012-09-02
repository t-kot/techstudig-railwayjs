var TRANSCEIVER = {};
console.log("transceiver");
var host = location.href;
var socket = io.connect("/");

socket.on("connect", function(msg){
    console.log("connection submit!");
});

TRANSCEIVER.sendScore = function(score){
    console.log("send score");
    var user = $.cookie("user_id");
    socket.emit("score_news_send", {score:score, user_id:user});
};

socket.on('score_news_push', function(msg){
    console.log("receive score");
    console.log(msg);
});
