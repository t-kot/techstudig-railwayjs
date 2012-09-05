scores = {}
app.io = require('socket.io').listen(app)
app.io.sockets.on 'connection', (socket)->


  socket.on "enterGame",(gameId)->
    scores[gameId] = scores[gameId] || []
    socket.join gameId
    socket.set 'gameId', gameId
    console.log "scores is "+scores[gameId]
    scores[gameId].push 50
    count = app.io.sockets.clients(gameId).length
    app.io.sockets.in(gameId).emit "userIn",count

  socket.on "sendScore", (msg)->
    User.find msg.userId, (err,user)->
      if err
        console.log err
      else
        #star = calculateStar(msg.score, scores, count)
        socket.get 'gameId',(err,gameId)->
          if err
            console.log err
          else
            scores[gameId].push msg.score
            console.log scores[gameId]
            star = 1
            app.io.sockets.emit 'scoreResult',star
            user.star += star
            user.save()

  socket.on "disconnect", ->
    socket.get 'gameId',(err,gameId)->
      socket.leave(gameId)
      count = app.io.sockets.clients(gameId).length
      app.io.sockets.in(gameId).emit('userOut',count)



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



