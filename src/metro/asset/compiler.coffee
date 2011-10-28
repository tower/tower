async = require 'async'
_     = require 'underscore'

class Compiler
  # Directives will only be picked up if they are in the header
  # of the source file. C style (/* */), JavaScript (//), and
  # Ruby/Coffeescript (#) comments are supported.
  #
  # Directives in comments after the first non-whitespace line
  # of code will not be processed.
  #
  @HEADER_PATTERN: /^(\/\*\s*(?:(?!\*\/).|\n)*\*\/)|(?:\#\#\#\s*(?:(?!\#\#\#).|\n)*\#\#\#)|(?:\/\/\s*.*\s*?)+|(?:#\s*.*\s*?)/g
  
  # Directives are denoted by a `=` followed by the name, then
  # argument list.
  #
  # A few different styles are allowed:
  #
  #     // =require foo
  #     //= require foo
  #     //= require "foo"
  #
  @DIRECTIVE_PATTERN: /(?:\/\/|#| *)\s*=\s*(require)\s*['"]?([^'"]+)['"]?[\s]*?\n?/
  
  render: (options, callback) ->
    if typeof(options) == "function"
      callback  = options
      options   = {}
    options ?= {}
    
    result      = ""
    terminator  = "\n"
    self        = @
    
    @parse options, (parts) ->
      for part in parts
        result += part.content
      result += terminator
      callback.call(self, result)
  
  parse: (options, callback) ->
    Metro.raise("errors.missingCallback", "Asset#parse") unless callback and typeof(callback) == "function"
    
    self        = @
    extension   = @extension
    result      = []
    terminator  = "\n"
    
    @parts options, (parts) ->
      iterate = (part, next) ->
        if part.hasOwnProperty("content")
          self.compile part.content, _.extend({}, options), (data) ->
            part.content = data
            result.push(part)
            next()
        else
          child = Metro.Asset.find(part.path, extension: extension)
          if child
            child.render _.extend({}, options), (data) ->
              part.content = data
              result.push(part)
              next()
          else
            console.log "Dependency '#{part.path}' not found in #{self.path}"
            next()
    
      async.forEachSeries parts, iterate, ->
        callback.call(self, result)
  
  parts: (options, callback) ->
    Metro.raise("errors.missingOption", "path", "Asset#parse") unless @path
    
    self        = @
    extension   = @extension
    
    requireDirectives = if options.hasOwnProperty("require") then options.require else true
    
    data = @read()
    
    if requireDirectives
      callback.call self, self.parseDirectives(data, self.path)
    else
      callback.call self, [content: data, path: self.path]
  
  parseDirectives: (string, path) ->
    self                    = @
    directivePattern       = @constructor.DIRECTIVE_PATTERN
    
    lines                   = string.match(@constructor.HEADER_PATTERN)
    directivesString       = ''
    parts                   = []
    
    if lines && lines.length > 0
      last                  = lines[lines.length - 1]
      # string                = string.substr(string.indexOf(last) + last.length)
      for line in lines
        directive           = line.match(directivePattern)
        if directive
          parts.push(path: directive[2])
          
    parts.push(path: path, content: string)

    parts
    
  compile: (data, options, callback) ->
    options ?= {}
    self    = @
    iterate = (engine, next) ->
      engine.render data, _.extend({}, options), (error, result) ->
        data = result
        next()

    async.forEachSeries @engines(), iterate, ->
      callback.call(self, data)
  
  paths: (options, callback) ->
    self = @
    @parts options, (parts) ->
      paths = []
      paths.push(part.path) for part in parts
      callback.call self, paths
    
  engines: ->
    unless @_engines
      extensions  = @extensions()
      result      = []
      
      for extension in extensions
        engine = Metro.engine(extension[1..-1])
        result.push(engine) if engine
        
      @_engines = result
      
    @_engines

module.exports = Compiler
