load 'application'
before use('checkValidateUser'), {only: ['edit','update','destroy'] }

before 'load user', ->
  User.find params.id, (err, user) =>
    if err
      redirect path_to.users()
    else
      @user = user
      next()
, only: ['show', 'edit', 'update', 'destroy']

action 'new', ->
  if @current_user
    flash 'error', 'You are already login'
    redirect path_to.root()
    return
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
      flash 'info', 'Welcome! Account is successfully created!'
      response.cookie 'user_id',user.id
      redirect path_to.users()

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
  uploadPhoto()
  @user.updateAttributes body.User, (err) =>
    if !err
      flash 'info', 'User updated'
      redirect path_to.user(@user)
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
      send "'" + path_to.users() + "'"

uploadPhoto= ->
  if(req.files)
    path = req.files.User.image.path
    split_path = path.split("/")
    new_path = "/"+split_path[1]+"/"+split_path[2]
    body.User['image'] = new_path
    console.log new_path
