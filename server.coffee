#!/usr/bin/env coffee

app = module.exports = require('railway').createServer()

if not module.parent
    port = process.env.PORT or 3000
    app.listen port
    console.log "Railway server listening on port %d within %s environment", port, app.settings.env

app.io = require('socket.io').listen(app)

app.io.configure ->
  #app.io.set 'transports', ["xhr-polling"]
  #app.io.set 'polling duration',10

app.io.sockets.on 'connection', (socket)->
  console.log "connection!"

  #Receive the message
  socket.on "message", (msg)->
    console.log msg
    app.io.sockets.emit 'message',msg

  socket.on "disconnect", ->
    console.log "Disconnect"

