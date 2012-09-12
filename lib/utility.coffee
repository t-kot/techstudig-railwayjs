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
