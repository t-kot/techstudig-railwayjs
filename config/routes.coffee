exports.routes = (map)->
  map.resources 'games',{except: ['edit','update']}
  map.resources 'rooms'
  map.root 'home#index'
  map.get('logout','sessions#logout')
  map.resources 'posts'
  map.resources 'users',{except: ['index']}
  map.resources 'sessions', {only: ['new','create']}
  map.namespace 'admin',(admin)->
    admin.root 'home#index'
    admin.resources 'users'
    admin.resources 'games'
    admin.resources 'rooms'
  # Generic routes. Add all your routes below this line
  # feel free to remove generic routes
  # map.all ':controller/:action'
  # map.all ':controller/:action/:id'
