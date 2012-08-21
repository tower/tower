command = ->
  defaultArgs = ["node", "tower", "generate"]
  (new Tower.CommandGenerate(defaultArgs.concat(_.args(arguments)))).program

describe "Tower.CommandGenerate", ->
  describe "tower generate scaffold", ->
    