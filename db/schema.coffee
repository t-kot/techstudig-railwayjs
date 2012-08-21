define 'User', ->
    property 'email', String, index: true
    property 'password', String
    property 'activated', Boolean, default: false

User = describe 'User', () ->
    property 'name', String
    property 'password', String
    property 'createdAt', Date
