load 'application'
before 'set layout',->
  if @current_user? && @current_user.type is User.type.admin
    layout('admin')
    next()
  else
    flash 'error', 'You must login as administrator'
    redirect path_to.root
