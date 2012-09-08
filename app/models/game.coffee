Game.belongsTo User, {as: "owner", foreignKey: "ownerId"}
Game.typeFormatJa = {
  1:"1000人耐久モード",
  2:"サバイバル"
}
Game.modeFormatJa = {
  1:"楽しくワイワイ",
  2:"ガンガン賭ける",
  3:"ノーレート"
}
