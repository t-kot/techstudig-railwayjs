console.log("transceiver");
var host = location.href;
var socket = io.connect("/");

socket.on("connect", function(msg){
    console.log("connection submit!");
});

function sendScore(){
    console.log("send score");
    var score = 100;
    var user = $.cookie("user_id");
    socket.emit("news", {score:score, user_id:user});
}

$(function(){
    $("#canvas").bind('touchstart',sendScore);
    $("#canvas").click(sendScore);
});
