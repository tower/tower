require './user'

class App.Admin extends App.User
  @scope "subclassNamedScope", likes: ">": 0