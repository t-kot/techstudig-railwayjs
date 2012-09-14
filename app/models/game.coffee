Game.validatesPresenceOf 'title'
Game.validatesUniquenessOf 'title', {message: 'is not unique'}
Game.belongsTo User, {as: "owner", foreignKey: "ownerId"}
Game.typeFormatJa = {
  1:"インベーダー",
  2:"ハロウィーン",
  3:"モンスター",
  4:"ポップ"
}
Game.type = {
  "invader":1,
  "halloween":2,
  "monstar":3,
  "pop":4
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
