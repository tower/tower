command = ->
  defaultArgs = ["node", "tower", "console"]
  (new Tower.CommandConsole(defaultArgs.concat(_.args(arguments)))).program

describe "Tower.CommandConsole", ->
  describe "tower console", ->
