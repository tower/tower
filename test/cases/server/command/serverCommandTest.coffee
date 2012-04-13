command = ->
  defaultArgs = ["node", "tower", "server"]
  (new Tower.Command.Server(defaultArgs.concat(_.args(arguments)))).program

describe "Tower.Command.Server", ->
  describe "tower server", ->
