load 'admin/application'

before 'load user', ->
  User.find params.id, (err, user) =>
    if err
      redirect path_to.admin()
    else
      @user = user
      next()
, only: ['show', 'edit', 'update', 'destroy']

action 'new', ->
  @user = new User
  @title = 'New user'
  render()

action 'create', ->
  User.create body.User, (err, user) =>
    if err
      flash 'error', 'User can not be created'
      @user = user
      @title = 'New user'
      render 'new'
    else
      flash 'info', 'Account is successfully created!'
      redirect path_to.admin_users()

action 'index', ->
  User.all (err, users) =>
    @users = users
    @title = 'Users index'
    render()

action 'show', ->
  @title = 'User show'
  render()

action 'edit', ->
  @title = 'User edit'
  render()

action 'update', ->
  #uploadPhoto()
  @user.updateAttributes body.User, (err) =>
    if !err
      flash 'info', 'User updated'
      redirect path_to.admin_user(@user)
    else
      flash 'error', 'User can not be updated'
      @title = 'Edit user details'
      render 'edit'

action 'destroy', ->
  @user.destroy (error) ->
    if error
      flash 'error', 'Can not destroy user'
    else
      flash 'info', 'User successfully removed'
      send "'" + path_to.admin_users() + "'"

uploadPhoto= ->
  if(req.files)
    #console.log req.files.User.image.name
    console.log req.files.User.image.path
    console.log app.root
    ins = fs.createReadStream(req.files.User.image.path)
    ous = fs.createWriteStream(app.root+'/public/uploads/'+req.files.User.image.name)
    #console.log req.files
    #path = req.files.User.image.path
    ##console.log User.image
    #console.log User.image.filename
    #split_path = path.split("/")
    #new_path = "/"+split_path[1]+"/"+split_path[2]
    #body.User['image'] = User.image.name
