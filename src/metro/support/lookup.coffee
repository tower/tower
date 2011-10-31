# https://github.com/sstephenson/hike/blob/master/lib/hike/index.rb
class Metro.Support.Lookup
  
  # new Metro.Support.Lookup paths: ["./app/assets/stylesheets"], extensions: [".js", ".coffee"], aliases: ".coffee": [".coffeescript"]
  constructor: (options = {}) ->
    @root       = options.root
    @extensions = @_normalizeExtensions(options.extensions)
    @aliases    = @_normalizeAliases(options.aliases || {})
    @paths      = @_normalizePaths(options.paths)
    @patterns   = {}
    @_entries   = {}
  
  # find "application", ["./app/assets"]
  # 
  # use this method to find the string for a helper method, not to find the actual file
  find: (source) ->
    source  = source.replace(/(?:\/\.{2}\/|^\/)/g, "")
    result  = []
    root    = @root
    
    paths   = if source[0] == "." then [Metro.Support.Path.absolutePath(source, root)] else @paths.map (path) -> Metro.Support.Path.join(path, source)
    
    for path in paths
      directory = Metro.Support.Path.dirname path
      basename  = Metro.Support.Path.basename path
      
      # in case they try to use "../../.." to get to a directory that's not supposed to be accessed.
      if @pathsInclude(directory)
        result = result.concat @match(directory, basename)
    
    result
    
  pathsInclude: (directory) ->
    for path in @paths
      if path.substr(0, directory.length) == directory
        return true
    false
    
  match: (directory, basename) ->
    entries = @entries(directory)
    pattern = @pattern(basename)
    matches = []
    
    for entry in entries
      if Metro.Support.Path.isFile(Metro.Support.Path.join(directory, entry)) && !!entry.match(pattern)
        matches.push(entry)
      
    matches = @sort(matches, basename)
    for match, i in matches
      matches[i] = Metro.Support.Path.join(directory, match)
    
    matches
    
  sort: (matches, basename) ->
    matches
    
  _normalizePaths: (paths) ->
    result = []
    
    for path in paths
      if path != ".." and path != "."
        result.push Metro.Support.Path.absolutePath path, @root
    result
    
  _normalizeExtension: (extension) ->
    extension.replace(/^\.?/, ".")
    
  _normalizeExtensions: (extensions) ->
    result = []
    for extension in extensions
      result.push @_normalizeExtension(extension)
    result
    
  _normalizeAliases: (aliases) ->
    return null unless aliases
    result = {}
    for key, value of aliases
      result[@_normalizeExtension(key)] = @_normalizeExtensions(value)
    result
  
  # RegExp.escape
  escape: (string) ->
    string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    
  escapeEach: ->
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
      if Metro.Support.Path.exists(path)
        entries = Metro.Support.Path.entries(path)
      else
        entries = []
      
      for entry in entries
        result.push(entry) unless entry.match(/^\.|~$|^\#.*\#$/)
      
      @_entries[path] = result.sort()
    
    @_entries[path]
    
  pattern: (source) ->
    @patterns[source] ||= @buildPattern(source)
  
  # Returns a `Regexp` that matches the allowed extensions.
  #
  #     buildPattern("index.html") #=> /^index(.html|.htm)(.builder|.erb)*$/  
  buildPattern: (source) ->
    extension   = Metro.Support.Path.extname(source)
    
    slug        = Metro.Support.Path.basename(source, extension)
    extensions  = [extension]
    extensions  = extensions.concat @aliases[extension] if @aliases[extension]
    
    new RegExp "^" + @escape(slug) + "(?:" + @escapeEach(extensions).join("|") + ").*"
    
module.exports = Metro.Support.Lookup
