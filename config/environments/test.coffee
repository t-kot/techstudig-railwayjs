app.configure 'test', ->
    app.use require('express').errorHandler dumpExceptions: true, showStack: true
    #require('../../lib/load_fixture').load {path: "/db/fixtures.json", host: "localhost", db: "techstudig_test"}
    require('load_fixture').load {path: "/db/fixtures.json", host: "localhost", db: "techstudig_test"}
    app.settings.quiet = true
    app.enable 'view cache'
    app.enable 'model cache'
    app.enable 'eval cache'
