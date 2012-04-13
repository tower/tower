fs    = require 'fs'
path  = require 'path'

assert.file = (path, arg) ->
  assert.ok path.existsSync(path), "#{path} exists"
  assert.ok !fs.statSync(path).isDirectory(), "#{path} is file"
  
  content = fs.readFileSync(path, "utf-8")
  
  switch _.kind(arg)
    when "regex"
      assert.match content, arg
    else
      arg.call @, content
      