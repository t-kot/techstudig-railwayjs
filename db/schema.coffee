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
    property 'userId', String
    property 'title', String
    property 'createdAt', Date, default: Date()
Game = describe 'Game', () ->
    property 'ownerId',String
    property 'ownerName', String
    property 'title', String
    property 'type', Number
    property 'joined', Number, default: 1
    property 'createdAt', Date, default: Date()
