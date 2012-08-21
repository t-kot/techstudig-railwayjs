User = define 'User', ->
   property 'name', String, index: true
   property 'password', String
   property 'createdAt', Date, default: Date()

