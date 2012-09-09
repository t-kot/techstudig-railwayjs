load 'application'
before use('requireAuthenticate'),{only: ['logout']}

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
        response.cookie 'user_id',users[0].id
        flash 'info', 'Successfully login!'
        if users[0].type is User.type.admin
          redirect path_to.admin()
        else
          redirect path_to.games()


#caution
#HTTPメソッドdeleteだとJSの関係でcookieの更新はできない
#GET /logout
action 'logout', ->
  res.clearCookie('user_id')
  flash 'info', 'Successfully logout!'
  @title = 'SUCCESS'
  redirect path_to.root
