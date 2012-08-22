User = define 'User', ->
   property 'name', String, index: true
   property 'password', String
   property 'createdAt', Date, default: Date()

Post = describe 'Post', () ->
    property 'userId', String
    property 'body', String
    property 'createdAt', Date, default: Date()
