require "../../config"

describe "Tower.Command", ->
  test "aliases", ->
    assert.deepEqual Tower.Command.aliases, 
      c: "console"
      g: "generate"
      s: "server"