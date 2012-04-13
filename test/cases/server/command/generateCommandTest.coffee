command = ->
  defaultArgs = ["node", "tower", "generate"]
  (new Tower.Command.Generate(defaultArgs.concat(_.args(arguments)))).program

describe "Tower.Command.Generate", ->
  describe "tower generate scaffold", ->
    