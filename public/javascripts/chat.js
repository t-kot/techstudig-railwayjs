var host = location.href;
var socket = io.connect("/");


//At connecting server
socket.on('connect', function(msg){
    $('#connectId').html("あなたの接続番号"+socket.socket.transport.sessid);
});

//At receiving message
socket.on('message', function(msg){
    var outer = $("<div class='outer'></div>").appendTo("#receiveMsg");
    var sender_image_path = msg.sender_image;
    var str = "<div class='sender' style='float:left; width:100px; height:100px; background: url(" +sender_image_path + ") no-repeat center; background-size: cover;'></div>";

    $(str).appendTo(outer);
    var elm = $("<canvas class='ballon'></canvas>").appendTo(outer);
    // NOTICE
    // jQuery object[0] means DOM Object
    // $("#id")[0] <=> document.getElementById("id")
    var canvas = elm[0];
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    var text = msg.message_text;

    ctx.beginPath();
    ctx.moveTo(5,5);
    ctx.lineTo(295,5);
    ctx.lineTo(295,145);
    ctx.lineTo(50,145);
    ctx.lineTo(50,30);
    ctx.lineTo(5,5);
    ctx.strokeText(text,60,20);
    ctx.stroke();
    //$("#receiveMsg").append(msg.message_text+"<br />");
});

//At sending message
function sendMsg(){
    var msg = $('#message').val();
    var user = $.cookie("user_id");
    socket.emit('message', {message_text:msg ,user_id:user});
}

//At disconnecting 
function disConnect(){
    var msg = socket.socket.transport.sessid + 'は切断しました';
    socket.emit('message', { message_text: msg});
    socket.disconnect();
}
