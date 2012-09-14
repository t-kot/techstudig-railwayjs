User = define 'User', ->
  property 'name', String, index: true
  property 'password', String
  property 'createdAt', Date, default: Date()
  property 'image', String
  property 'star', Number, default: 10
  property 'type', Number, default: 1
  property 'profile', Text

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
  property 'type', Number, default: 1
  property 'createdAt', Date, default: Date()
  property 'mode', Number, default: 1
