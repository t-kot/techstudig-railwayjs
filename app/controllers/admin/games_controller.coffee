utility = require('../../../lib/utility')
load 'admin/application'
before 'load game', ->
    Game.find params.id, (err, game) =>
        if err
            redirect path_to.admin_games()
        else
            @game = game
            next()
, only: ['show', 'edit', 'update', 'destroy']

action 'new', ->
    @game = new Game
    @title = 'New game'
    @game.ownerId = @current_user.id
    @game.ownerName = @current_user.name
    render()

action 'create', ->
    Game.create body.Game, (err, game) =>
        if err
            flash 'error', 'Game can not be created'
            @game = game
            @title = 'New game'
            render 'new'
        else
            flash 'info', 'Game created'
            redirect path_to.admin_games()

action 'index', ->
    Game.all (err, games) =>
        @games = games
        @title = 'Games index'
        render()

action 'show', ->
  ua = req.headers['user-agent']?.toLowerCase() || "PC"
  layout('mobile') if utility.isSmartPhone(ua)
  @title = 'Game show'
  render()

action 'edit', ->
    @title = 'Game edit'
    render()

action 'update', ->
    @game.updateAttributes body.Game, (err) =>
        if !err
            flash 'info', 'Game updated'
            redirect path_to.admin_game(@game)
        else
            flash 'error', 'Game can not be updated'
            @title = 'Edit game details'
            render 'edit'

action 'destroy', ->
    @game.destroy (error) ->
        if error
            flash 'error', 'Can not destroy game'
        else
            flash 'info', 'Game successfully removed'
        send "'" + path_to.admin_games() + "'"
