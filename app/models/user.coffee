User.hasMany Post, {as: 'posts', foreignKey: 'userId'}
User.hasMany Game, {as: 'games', foreignKey: 'ownerId'}

User.authenticate =(name,password,callback)->
  User.all {where: {name: name, password: password} },callback

User.validatesPresenceOf 'name', 'password'
User.validatesUniquenessOf 'name', {message: 'User name is not unique'}

User.type = {
  "general":1,
  "admin":2
}

User.prototype.title =->
  if this.star < 10 then return "Prince"
  if 10<= this.star && this.star < 30 then return "Ace"
  if 30<= this.star && this.star < 100 then return "Knight"
  if 100<=star then return "Jack"
