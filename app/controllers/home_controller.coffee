load 'application'

action 'index', ->
  @title="Welcome"
  render()

action 'arctic', ->
  @title="arctic"
  layout(false)
  render()
