before 'protect from forgery', ->
    protectFromForgery '4fcfcad7e3fceb8c12a8ffe842e8e59fea795096'



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

requireAuthenticate= ()->
  if @current_user == null
    flash 'error', 'You must login for continue'
    redirect path_to.new_session
  else
    next()
publish('requireAuthenticate', requireAuthenticate)

checkValidateUser= ()->
  if @current_user == null || @current_user.id != params.id
    redirect path_to.root()
    console.log params
  next()

publish('checkValidateUser',checkValidateUser)
