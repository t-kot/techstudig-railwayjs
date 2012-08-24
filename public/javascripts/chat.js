var host = location.href;
var socket = io.connect("/");

//At connecting server
socket.on('connect', function(msg){
  $('#connectId').html("あなたの接続番号"+socket.socket.transport.sessid);
});

//At receiving message
socket.on('message', function(msg){
  console.log(msg.value);
  $("#receiveMsg").append(msg.value+"<br />");
});

//At sending message
function sendMsg(){
  var msg = $('#message').val();
  socket.emit('message', {value:msg});
}

//At disconnecting 
function disConnect(){
  var msg = socket.socket.transport.sessid + 'は切断しました';
  socket.emit('message', { value: msg});
  socket.disconnect();
}
