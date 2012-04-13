command = ->
  defaultArgs = ["node", "tower", "console"]
  (new Tower.Command.Console(defaultArgs.concat(_.args(arguments)))).program

describe "Tower.Command.Console", ->
  describe "tower console", ->
