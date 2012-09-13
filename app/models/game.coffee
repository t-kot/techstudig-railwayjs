Game.validatesPresenceOf 'title'
Game.validatesUniquenessOf 'title', {message: 'User name is not unique'}
Game.belongsTo User, {as: "owner", foreignKey: "ownerId"}
Game.typeFormatJa = {
  1:"インベーダー",
  2:"ハロウィーン"
}
Game.type = {
  "invader":1,
  "halloween":2
}
Game.modeFormatJa = {
  1:"楽しくワイワイ",
  2:"ガンガン賭ける",
  3:"ノーレート"
}
Game.modeFormat = {
  relax:1,
  hardbet:2,
  noRate:3
}

Game.newsType = {
  excellentScore:1,
  jackpot:2,
  kiribanScore:3
}
