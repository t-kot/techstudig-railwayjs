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
app.games["hoge"] = 1
count = 0
scores = []
app.io.sockets.on 'connection', (socket)->

  #Receive the message
  socket.on "enterGame",()->
    console.log count
    console.log "enter game"
    scores.push 50
    count++
    app.io.sockets.emit 'user_in',count
  socket.on "message", (msg)->
    User.find msg.user_id,(err,user)->
      msg.sender_image = user.image
      app.io.sockets.emit 'message',msg
  socket.on "scoreSend", (msg)->
    console.log scores
    User.find msg.user_id, (err,user)->
      if err
        console.log
      else
        star = calculateStar(msg.score, scores, count)
        scores.push msg.score
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

calculateStar = (score,scores,count)->
  if count ==1
    return 0
  console.log scores.length
  console.log count
  start = scores.length - count + 1
  rivals = scores.slice(start)
  ranking = 1
  return 100
  rivals.forEach (val)->
    ranking++ if val > score
  console.log ranking
  if ranking == count
    console.log 0
    return 0
  else
    console.log 2
    return 2


