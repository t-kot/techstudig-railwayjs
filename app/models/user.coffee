User.authenticate =(name,password,callback)->
  User.all {where: {name: name, password: password} },callback
