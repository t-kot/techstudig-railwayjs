exports.routes = (map)->
  map.resources 'users'
  map.resources 'sessions', {only: ['new']}
  # Generic routes. Add all your routes below this line
  # feel free to remove generic routes
  map.all ':controller/:action'
  map.all ':controller/:action/:id'
