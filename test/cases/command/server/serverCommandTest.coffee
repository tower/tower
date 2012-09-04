command = ->
  defaultArgs = ["node", "tower", "server"]
  (new Tower.CommandServer(defaultArgs.concat(_.args(arguments)))).program

describe "Tower.CommandServer", ->
  describe "tower server", ->
