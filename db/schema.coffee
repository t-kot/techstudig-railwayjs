User = define 'User', ->
   property 'name', String, index: true
   property 'password', String
   property 'createdAt', Date, default: Date()
   property 'image', String

Post = describe 'Post', () ->
    property 'userId', String
    property 'body', String
    property 'createdAt', Date, default: Date()
Room = describe 'Room', () ->
    property 'userId', Number
    property 'title', String
    property 'createdAt', Date, default: Date()
