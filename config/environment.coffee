express = require 'express'
lessMiddleware = require('less-middleware')

app.configure ->
    cwd = process.cwd()
    app.set 'view engine', 'jade'
    app.set 'view options', complexNames: true
    app.enable 'coffee'

    #app.use(require('less-middleware')({ src: cwd+'/public'}))
    #app.use(express.compiler({ src:cwd+'/public', enable: ['less']}))
    app.use(lessMiddleware({
      src:cwd+'/public',
      compress: true
    }))
    app.use express.static(cwd + '/public', maxAge: 86400000)
    app.use express.bodyParser {uploadDir:'./public/uploads'}
    app.use express.cookieParser 'secret'
    app.use express.session secret: 'secret'
    app.use express.methodOverride()
    app.use app.router
