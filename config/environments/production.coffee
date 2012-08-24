app.configure 'production', ->
    app.disable 'view cache'
    app.disable 'model cache'
    app.disable 'eval cache'
    app.disable 'merge javascripts'
    app.disable 'merge stylesheets'
    app.disable 'assets timestamps'
    app.use require('express').errorHandler()
    app.disable 'quiet'

