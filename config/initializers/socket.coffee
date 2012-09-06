scores = {}
scores.calculateStar = (gameId,userId,connecting)->
  ranking = this.calculateRanking gameId,userId
  if(connecting < 3)
    if ranking==1
      return 1
    else
      return 0
  if(connecting >=3 and connecting <=10)
    if ranking < 3
      return 2
    else if ranking > 8
      return -1
    else
      return 0
  if(connecting > 10)
    if ranking < 5
      return 3

connecting=(gameId)->
  return app.io.sockets.clients(gameId).length


scores.calculateRanking = (gameId,userId)->
  allPlayerScores = this[gameId]
  console.log "all player scores is"+allPlayerScores
  theUserScores = this[gameId][userId]
  console.log "the user scores is"+theUserScores
  console.log theUserScores
  ranking = 1
  for key,thePlayerScores of allPlayerScores
    ranking++ if thePlayerScores[thePlayerScores.length-1] > theUserScores[theUserScores.length-1]
    console.log "thePlayerScore is"+thePlayerScores[thePlayerScores.length-1]
    console.log "theUserScore is"+theUserScores[theUserScores.length-1]
  return ranking

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
    app.io.sockets.in(gameId).emit "userIn",connecting(gameId)

  socket.on "sendScore", (data)->
    score = data.score
    userId = data.userId
    User.find userId, (err,user)->
      console.log err if err
      socket.get 'gameId',(err,gameId)->
        console.log err if err
        scores[gameId][userId].push score
        ranking = scores.calculateRanking gameId,userId
        connecting = app.io.sockets.clients(gameId).length
        star = scores.calculateStar gameId,userId,connecting
        socket.emit 'scoreResult',{star:star, ranking:ranking}
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
        app.io.sockets.in(gameId).emit 'userOut',connecting(gameId)


