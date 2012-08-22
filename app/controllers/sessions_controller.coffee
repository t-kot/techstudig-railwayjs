load 'application'

action 'new', ->
  @title = "NEW session"
  console.log(@user)
  render()

action 'create', ->
  User.authenticate body["user_name"], body["password"],(err,users)=>
    if err
      flash 'error', 'Something went wrong'
      redirect path_to.root()
    else
      if users.length !=1
        flash 'error', 'You might mistype!'
        redirect path_to.new_session()
      else
        response.cookie 'techstudig_user_id',users[0].id
        users[0]
        flash 'info', 'Successfully login!'
        redirect path_to.user(users[0])

action 'destroy', ->
  response.cookie 'techstudig_user_id',''
  flash 'info', 'Successfully logout!'
  redirect path_to.root
