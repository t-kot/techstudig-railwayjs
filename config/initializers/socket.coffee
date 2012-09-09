_ = require('underscore')._
GAMEMODE = {
  relax:1,
  hardBet:2,
  noRate:3
}
NEWSTYPE = {
  excellentScore:1,
  jackpot:2,
  connectingNum:3
}
jackpot = {}
scores = {}
scores.calculateStar = (data)->
  #例えば6人のときだと
  #1位:3点,2位:2点,3位:1点,4位:-1点,5位:−2点,6位:−3点
  #7人だと
  #1位:3点,2位:2点,3位:1点,4位:0点,5位:-1点,6位:−2点,7位:−3点
  #がベーススコアで、これにgameModeによる倍率がかかる
  connect = data.connect
  ranking = @calculateRanking data.gameId,data.userId
  if connect%2==0
    baseScore =  connect/2+1-ranking if(ranking <= connect/2)
    baseScore =  connect/2-ranking if(connect/2 < ranking)
  else
    baseScore =  (connect-1)/2+1-ranking

  switch data.gameMode
    when 1 then return baseScore
    when 2 then return baseScore*3
    else return 0

connecting=(gameId)->
  return app.io.sockets.clients(gameId).length


scores.calculateRanking = (gameId,userId)->
  allPlayerScores = @[gameId]
  theUserScores = @[gameId][userId]
  ranking = 1
  for key,thePlayerScores of allPlayerScores
    ranking++ if _(thePlayerScores).last() > _(theUserScores).last()
  return ranking

app.io = require('socket.io').listen(app)
app.io.sockets.on 'connection', (socket)->

  socket.on "enterGame",(data)->
    gameId = data.gameId
    userId = data.userId
    Game.find gameId,(err,game)->
      console.log err if err
      scores[gameId] or=  {}
      jackpot[gameId] or=  100
      jackpot[gameId] += 10
      socket.join gameId
      socket.set 'gameId', gameId
      socket.set 'gameMode',game.mode
      app.io.sockets.in(gameId).emit "userIn",{connect:connecting(gameId),jackpot:jackpot[gameId]}
      User.find userId,(err,user)->
        console.log err+"user find err"  if err
        #scores[gameId][userId] = [] unless scores[gameId][userId]?
        scores[gameId][userId] or= []
        scores[gameId][userId].push 50
        socket.set 'userId', userId
        socket.emit "userStatus",{name:user.name,star:user.star}

  socket.on "sendScore", (data)->
    score = data.score
    userId = data.userId
    User.find userId, (err,user)->
      console.log err+"user find err" if err
      socket.get 'gameId',(err,gameId)->
        if score > 150
          app.io.sockets.in(gameId).emit "news",{type:NEWSTYPE["excellentScore"],data:{score:score,user:user.name}}
        console.log err+"game get error" if err
        scores[gameId][userId].push score
        ranking = scores.calculateRanking gameId,userId
        socket.emit 'scoreResult',ranking
        socket.get 'gameMode', (err,gameMode)->
          console.log err+"gamemode get error" if err
          unless gameMode==GAMEMODE["noRate"]
            star = scores.calculateStar {gameId:gameId,userId:userId,connect:connecting(gameId), gameMode:gameMode}
            socket.emit 'starResult',star
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
