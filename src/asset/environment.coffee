fs      = require('fs')
crypto  = require('crypto')
mime    = require('mime')

class Environment
  ###
  # Mmm, CoffeeScript
  register_engine '.coffee', Tilt::CoffeeScriptTemplate

  # JST engines
  register_engine '.jst',    JstProcessor
  register_engine '.eco',    EcoTemplate
  register_engine '.ejs',    EjsTemplate

  # CSS engines
  register_engine '.less',   Tilt::LessTemplate
  register_engine '.sass',   Tilt::SassTemplate
  register_engine '.scss',   Tilt::ScssTemplate

  # Other
  register_engine '.erb',    Tilt::ERBTemplate
  register_engine '.str',    Tilt::StringTemplate
  ###
  
  stat: (path) ->
    fs.statSync(path)
  
  ###
  see http://nodejs.org/docs/v0.3.1/api/crypto.html#crypto
  ###
  digest: ->
    crypto.createHash('md5')
    
  digest_file: (path, data) ->
    stat = @stat(path)
    return unless stat?
    data ?= @read_file(path)
    return unless data?
    @digest().update(data).digest("hex")
      
  read_file: (path) ->
    fs.readFileSync(path)
    
  content_type: (path) ->
    mime.lookup(path)
    
  mtime: (path) ->
    @stat(path).mtime

exports = module.exports = Environment
