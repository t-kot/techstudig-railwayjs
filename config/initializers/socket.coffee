scores = {}
app.io = require('socket.io').listen(app)
app.io.sockets.on 'connection', (socket)->


  socket.on "enterGame",(data)->
    gameId = data.gameId
    userId = data.userId
    scores[gameId] =  {} unless scores[gameId]?
    scores[gameId][userId] = [] unless scores[gameId][userId]?
    socket.join gameId
    socket.set 'gameId', gameId
    socket.set 'userId', userId
    scores[gameId][userId].push 50
    count = app.io.sockets.clients(gameId).length
    app.io.sockets.in(gameId).emit "userIn",count

  socket.on "sendScore", (data)->
    score = data.score
    userId = data.userId
    User.find userId, (err,user)->
      console.log err if err
      #star = calculateStar(msg.score, scores, count)
      socket.get 'gameId',(err,gameId)->
        console.log err if err
        scores[gameId][userId].push score
        console.log scores[gameId][userId]
        star = 1
        app.io.sockets.emit 'scoreResult',star
        user.star += star
        user.save()

  socket.on "disconnect", ->
    socket.get 'gameId',(err,gameId)->
      console.log err if err
      return unless gameId?
      socket.get 'userId',(err,userId)->
        console.log err if err
        return unless userId?
        delete scores[gameId][userId]
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



