#relation ship
User.hasMany Post, {as: 'posts', foreignKey: 'userId'}

User.authenticate =(name,password,callback)->
  User.all {where: {name: name, password: password} },callback

User.validatesPresenceOf 'name', 'password'
User.validatesUniquenessOf 'name', {message: 'User name is not unique'}
