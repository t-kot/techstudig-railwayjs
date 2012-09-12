_ = require('underscore')._
exports.GAMEMODE = {
  relax:1,
  hardBet:2,
  noRate:3
}
exports.NEWSTYPE = {
  excellentScore:1,
  jackpot:2,
  kiribanScore:3
}
exports.rand = (min,max)->
  return Math.floor ((max - min) * Math.random()) + min
exports.intermediateCheck = (before,after)->
  if before < after
    _([1000,2000,3000]).detect (num)->
      (before - num)*(after-num) <= 0 and before isnt num
exports.jackpot = {}
exports.scores = {}
exports.scores.calculateStar = (data)->
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
exports.scores.calculateRanking = (gameId,userId)->
  allPlayerScores = @[gameId]
  theUserScores = @[gameId][userId]
  ranking = 1
  for key,thePlayerScores of allPlayerScores
    ranking++ if _(thePlayerScores).last() > _(theUserScores).last()
  return ranking
