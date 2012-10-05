_ = Tower._
fs    = require 'fs'
path  = require 'path'

assert.file = (path, arg) ->
  try
    stat = fs.statSync(path)
    assert.ok stat, "#{path} exists"
    assert.ok !stat.isDirectory(), "#{path} is file"
  catch error
    assert.ok false, "#{path} exists"
    arg() if typeof arg == "function"
    return

  return unless arg

  content = fs.readFileSync(path, "utf-8")

  switch _.kind(arg)
    when "regex"
      assert.match content, arg
    else
      arg.call @, content
