load 'application'
before(use('requireAuthenticate'))

before 'load room', ->
    Room.find params.id, (err, room) =>
        if err
            redirect path_to.rooms()
        else
            @room = room
            @posts_users = []
            room.posts (err,posts)=>
              @posts = posts
              posts.forEach (post)=>
                User.find post.user(), (err,user) =>
                  if err
                    redirect path_to.rooms()
                  else
                    console.log post.body
                    @posts_users.push {user_name:user.name, post_body:post.body}
                  console.log @posts_users
                  next()
, only: ['show', 'edit', 'update', 'destroy']

action 'new', ->
    @room = new Room
    @title = 'New room'
    render()

action 'create', ->
    Room.create body.Room, (err, room) =>
        if err
            flash 'error', 'Room can not be created'
            @room = room
            @title = 'New room'
            render 'new'
        else
            flash 'info', 'Room created'
            redirect path_to.rooms()

action 'index', ->
    Room.all (err, rooms) =>
        @rooms = rooms
        @title = 'Rooms index'
        render()

action 'show', ->
    @title = 'Room show'
    render()

action 'edit', ->
    @title = 'Room edit'
    render()

action 'update', ->
    @room.updateAttributes body.Room, (err) =>
        if !err
            flash 'info', 'Room updated'
            redirect path_to.room(@room)
        else
            flash 'error', 'Room can not be updated'
            @title = 'Edit room details'
            render 'edit'

action 'destroy', ->
    @room.destroy (error) ->
        if error
            flash 'error', 'Can not destroy room'
        else
            flash 'info', 'Room successfully removed'
        send "'" + path_to.rooms() + "'"

