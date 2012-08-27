User = define 'User', ->
   property 'name', String, index: true
   property 'password', String
   property 'createdAt', Date, default: Date()
   property 'image', String

Post = describe 'Post', () ->
    property 'userId', String
    property 'roomId', String
    property 'body', String
    property 'createdAt', Number, default: Date.now()
Room = describe 'Room', () ->
    property 'userId', Number
    property 'title', String
    property 'createdAt', Number, default: Date.now()

