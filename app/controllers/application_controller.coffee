before 'protect from forgery', ->
    protectFromForgery '4fcfcad7e3fceb8c12a8ffe842e8e59fea795096'



#ログインしてなかったらログイン画面に飛ばす
requireAuthenticate= ()->
  User.find request.cookies.techstudig_user_id,(err,user)=>
    if err || !user?
      flash 'error', 'You must login for continue'
      redirect path_to.new_session
    else
      @current_user = user
      next()

publish('requireAuthenticate', requireAuthenticate)

