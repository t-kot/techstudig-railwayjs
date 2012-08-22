load 'application'

action 'index', ->
  console.log(req.cookies)
  @title="Welcome"
  render()
