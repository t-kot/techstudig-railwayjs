exports.routes = (map)->
  map.root 'home#index'
  map.resources 'posts'
  map.resources 'users'
  map.resources 'sessions', {only: ['new','create','destroy']}
  # Generic routes. Add all your routes below this line
  # feel free to remove generic routes
  map.all ':controller/:action'
  map.all ':controller/:action/:id'
