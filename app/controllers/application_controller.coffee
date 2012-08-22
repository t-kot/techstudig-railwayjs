before 'protect from forgery', ->
    protectFromForgery '4fcfcad7e3fceb8c12a8ffe842e8e59fea795096'


#ログインしてなかったらログイン画面に飛ばす
requireAuthenticate= ()->
  User.find request.cookies.user_id,(err,user)=>
    if err || !user?
      flash 'error', 'You must login for continue'
      redirect path_to.new_session
    else
      next()

before 'set current user', ->
  #console.log(req.cookies)
  @current_user = null
  User.find req.cookies.user_id,(err,user)=>
    if err || !user?
      console.log("try find but not found")
      @current_user = null
    else
      console.log("user was found")
      @current_user = user
    next()


publish('requireAuthenticate', requireAuthenticate)

