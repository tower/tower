# https://github.com/sstephenson/hike/blob/master/lib/hike/index.rb
class Lookup
  root:       null
  extensions: null
  # extension aliases
  aliases:    null
  paths:      null
  patterns:   null
  
  # new Metro.Support.Lookup paths: ["./app/assets/stylesheets"], extensions: [".js", ".coffee"], aliases: ".coffee": [".coffeescript"]
  constructor: (options = {}) ->
    @root       = options.root
    @extensions = @_normalize_extensions(options.extensions)
    @aliases    = @_normalize_aliases(options.aliases)
    @paths      = @_normalize_paths(options.paths)
    @patterns   = {}
    @_entries   = {}
  
  # find "application", ["./app/assets"]
  # 
  # use this method to find the string for a helper method, not to find the actual file
  find: (source) ->
    source = @_normalize_source(source)
    result = []
    
    for path in @paths
      full_path = Metro.Support.File.join(path, source)
      directory = Metro.Support.File.dirname full_path
      basename  = Metro.Support.File.basename full_path
      
      # in case they try to use "../../.." to get to a directory that's not supposed to be accessed.
      if @paths_include(directory)
        result = result.concat @match(directory, basename)
    
    result
    
  paths_include: (directory) ->
    for path in @paths
      if path.substr(0, directory.length) == directory
        return true
    false
    
  match: (directory, basename) ->
    entries = @entries(directory)
    pattern = @pattern(basename)
    matches = []
    
    for entry in entries
      matches.push(entry) if !!entry.match(pattern)
      
    matches = @sort(matches, basename)
    for match, i in matches
      matches[i] = Metro.Support.File.join(directory, match)
    
    matches
    
  sort: (matches, basename) ->
    matches
    
  _normalize_paths: (paths) ->
    result = []
    for path in paths
      result.push Metro.Support.File.expand_path path
    result
    
  _normalize_source: (source) ->
    source.replace(/^\/?/, "")
    
  _normalize_extension: (extension) ->
    extension.replace(/^\.?/, ".")
    
  _normalize_extensions: (extensions) ->
    result = []
    for extension in extensions
      result.push @_normalize_extension(extension)
    result
    
  _normalize_aliases: (aliases) ->
    return null unless aliases
    result = {}
    for key, value of aliases
      result[@_normalize_extension(key)] = @_normalize_extensions(value)
    result
  
  # RegExp.escape
  escape: (string) ->
    string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    
  escape_each: ->
    result = []
    args   = arguments[0]
    for item, i in args
      result[i] = @escape(item)
    result
    
  # A cached version of `Dir.entries` that filters out `.` files and
  # `~` swap files. Returns an empty `Array` if the directory does
  # not exist.
  entries: (path) ->
    unless @_entries[path]
      result  = []
      entries = Metro.Support.File.entries(path)
      
      for entry in entries
        result.push(entry) unless entry.match(/^\.|~$|^\#.*\#$/)
      
      @_entries[path] = result.sort()
    
    @_entries[path]
    
  pattern: (source) ->
    @patterns[source] ?= @build_pattern(source)
  
  # Returns a `Regexp` that matches the allowed extensions.
  #
  #     build_pattern("index.html") #=> /^index(.html|.htm)(.builder|.erb)*$/  
  build_pattern: (source) ->
    extension   = Metro.Support.File.extname(source)
    
    slug        = Metro.Support.File.basename(source, extension)
    extensions  = [extension]
    extensions  = extensions.concat @aliases[extension] if @aliases[extension]
    
    new RegExp "^" + @escape(slug) + "(?:" + @escape_each(extensions).join("|") + ").*"
    
module.exports = Lookup
