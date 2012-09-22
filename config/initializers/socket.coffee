utility = require('../../lib/utility')
scores = require('../../lib/score').scores
_ = require('underscore')._

jackpot = {}
connecting=(gameId)->
  return app.io.sockets.clients(gameId).length

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
      #100人超えてたらランダムでボス出現
      #TODO ボスを倒したらどうなるかなどはとくにない
      if utility.rand(0,10) == 0 #&& connecting(gameId) > 100
        app.io.sockets.in(gameId).emit "emergeBoss"
      User.find userId,(err,user)->
        console.log err+"user find err"  if err
        scores[gameId][userId] or= []
        scores[gameId][userId].push 50
        socket.set 'userId', userId
        socket.emit "userStatus",{name:user.name,star:user.star}

  socket.on "sendScore", (data)->
    score = data.score
    total = data.total
    userId = data.userId
    User.find userId, (err,user)->
      console.log err+"user find err" if err
      socket.get 'gameId',(err,gameId)->
        kiriban =  utility.intermediateCheck total-score,total
        if kiriban?
          app.io.sockets.in(gameId).emit "news",{type:Game.newsType["kiribanScore"],data:{score:kiriban,user:user.name}}
        if score > 300
          app.io.sockets.in(gameId).emit "news",{type:Game.newsType["excellentScore"],data:{score:score,user:user.name}}
        console.log err+"game get error" if err
        scores[gameId][userId].push score
        ranking = scores.calculateRanking gameId,userId
        if ranking == 1 && utility.rand(0,10) == 0 && connecting(gameId) > 10
          app.io.sockets.in(gameId).emit "news",{type:Game.newsType["jackpot"],data:{user:user.name,jackpot:jackpot[gameId]}}
          jackpot[gameId] = 100
        socket.get 'gameMode', (err,gameMode)->
          console.log err+"gamemode get error" if err
          if gameMode==Game.modeFormat["noRate"]
            star = 0
          else
            star = scores.calculateStar {gameId:gameId,userId:userId,connect:connecting(gameId), gameMode:gameMode}
            user.star += star
            user.save()
          socket.emit 'scoreResult',{ranking:ranking,star:star,score:score}

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
