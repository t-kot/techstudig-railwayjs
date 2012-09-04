#!/usr/bin/env coffee

app = module.exports = require('railway').createServer()

if not module.parent
  port = process.env.PORT or 3000
  app.listen port
  console.log "Railway server listening on port %d within %s environment", port, app.settings.env

app.io = require('socket.io').listen(app)

app.configure 'production',->
  app.io.configure ->
    app.io.set 'transports', ["xhr-polling"]
    app.io.set 'polling duration',10


count = 0;
app.io.sockets.on 'connection', (socket)->
  count++
  app.io.sockets.emit 'user_in',count

  #Receive the message
  socket.on "message", (msg)->
    User.find msg.user_id,(err,user)->
      msg.sender_image = user.image
      app.io.sockets.emit 'message',msg
  socket.on "score_news_send", (msg)->
    User.find msg.user_id, (err,user)->
      if err
        console.log
      else
        score = {}
        [score.user,score.point]=[user.name,msg.score]
        app.io.sockets.emit 'score_news_push',score

  socket.on "disconnect", ->
    count--
    console.log "Disconnect"
    app.io.sockets.emit "user_out",count


memcache = require('memcache')
app.client = new memcache.Client()
app.client.connect()
app.client.set 'hoge', 'fuga', (err,result)->
  console.log err if err
app.client.get 'hoge',(err,result)->
  console.log result
  console.log err if err
