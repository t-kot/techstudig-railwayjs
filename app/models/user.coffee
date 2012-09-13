User.hasMany Post, {as: 'posts', foreignKey: 'userId'}
User.hasMany Game, {as: 'games', foreignKey: 'ownerId'}

User.authenticate =(name,password,callback)->
  User.all {where: {name: name, password: password} },callback

User.validatesPresenceOf 'name', 'password'
User.validatesUniquenessOf 'name', {message: 'is not unique'}

User.type = {
  "general":1,
  "admin":2
}

