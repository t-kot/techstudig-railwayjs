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


app.games = {}
console.log "init app.games"
count = 0
scores = []
app.io.sockets.on 'connection', (socket)->


  socket.on "enterGame",(gameid)->
    console.log "===socket join "+gameid
    socket.join gameid
    socket.set 'gameid', gameid
    count = app.io.sockets.clients(gameid).length
    console.log "======count is======"+count
    app.io.sockets.in(gameid).emit "userIn",count

  socket.on "sendScore", (msg)->
    User.find msg.user_id, (err,user)->
      if err
        console.log("USER FIND!")
      else
        star = calculateStar(msg.score, scores, count)
        #star = 10
        scores.push msg.score
        app.io.sockets.emit 'scoreResult',star
        user.star += star
        user.save()

  socket.on "disconnect", ->
    socket.get 'gameid',(err,gameid)->
      console.log "====gameid is ====="+gameid+err
      socket.leave(gameid)
      count = app.io.sockets.clients(gameid).length
      app.io.sockets.in(gameid).emit('userOut',count)


memcache = require('memcache')
app.client = new memcache.Client()
app.client.connect()

calculateStar = (score,scores,count)->
  console.log scores
  if count ==1
    return 0
  start = scores.length - count + 1
  rivals = scores.splice(start)
  ranking = 1
  rivals.forEach (val)->
    ranking++ if val > score
  console.log ranking
  if ranking == count
    return 0
  else
    return 2


