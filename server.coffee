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

app.io.sockets.on 'connection', (socket)->
  console.log "connection!"

  #Receive the message
  socket.on "message", (msg)->
    console.log msg
    User.find msg.user_id,(err,user)->
      msg.sender_image = user.image
      app.io.sockets.emit 'message',msg
      Room.find msg.room_id,(err,room)->
        if err
          console.log err
        else
          room.posts.create {userId: user.id,body: msg.message_text},(err)->
            console.log err if err

  socket.on "disconnect", ->
    console.log "Disconnect"

