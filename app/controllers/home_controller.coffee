load 'application'
before use('requireAuthenticate'), {only: ['arctic']}

action 'index', ->
  @title="Welcome"
  render()

