exports.routes = (map)->
  map.resources 'rooms'
  map.root 'home#index'
  map.get('game','home#arctic')
  map.get('logout','sessions#logout')
  map.resources 'posts'
  map.resources 'users'
  map.resources 'sessions', {only: ['new','create']}
  # Generic routes. Add all your routes below this line
  # feel free to remove generic routes
  map.all ':controller/:action'
  map.all ':controller/:action/:id'
