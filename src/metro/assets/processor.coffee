file   = require("file")
fs     = require('fs')
_      = require("underscore")

# http://sstephenson.github.com/strscan-js/
# http://stackoverflow.com/questions/406230/regular-expression-to-match-string-not-containing-a-word
class Processor
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
  @DIRECTIVE_PATTERN: /(?:\/\/|#| *)\s*=\s*(require)\s*['"]?(.+)['"]?[\s]*?\n?/
  
  constructor: (compressor) ->
    @_compressor = compressor
    
  compressor: ->
    @_compressor
    
  process: (options) ->
    self   = @
    result = {}
    
    if _.isArray(options.files)
      options.map = _.inject(
        options.files, 
        (hash, file) -> hash[file.replace(/\.(js|css)$/, "")] = Array(file) ; hash, 
        {}
      )
    else
      options.map = {}
      #files = {}
      for key, value of options.files
        options.map[key.replace(/\.(js|css)$/, "")] = if typeof(value) == "string" then Array(value) else value
        # files = files.concat value
        #options.files[key.replace(/\.(js|css)$/, "")] = Array(value)
      #options.files = files
    
    for key, files of options.map
      string = ''
      for path in options.paths
        file.walkSync path, (_path, _directories, _files) ->
          items = _.intersection(files, _files)
          for item in items
            data = fs.readFileSync([_path, item].join("/"), 'utf8')
            string = string + self.process_directives(data)
      result[key] = self.compressor().compress(string)
    result
    
  render: (string) ->
    @process_directives(string)
    
  process_directives: (string) ->
    self                    = @
    directive_pattern       = @constructor.DIRECTIVE_PATTERN
    lines                   = string.match(@constructor.HEADER_PATTERN)
    directives_string       = ''
    if lines && lines.length > 0
      last                  = lines[lines.length - 1]
      # string                = string.substr(string.indexOf(last) + last.length)
      for line in lines
        directive           = line.match(directive_pattern)
        if directive
          directives_string = directives_string + self.process_directives(fs.readFileSync(directive[2], 'utf8')) + self.terminator
    
    directives_string + string + self.terminator
  
  compile: (options) ->
    dir  = options.path
    throw new Error("You must pass in a directory as 'path'") unless dir?
    data = @process(options)
    ext  = "." + @extension
    for key, string of data
      name = [dir, key].join("/") + ext
      fs.writeFileSync name, string
    
module.exports = Processor
