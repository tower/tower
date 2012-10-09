fs = require('fs')
_path = require('path')

Tower.hashingAlgorithm = 'md5'

# @todo Simplified interface over `fs`, `path`, and `wrench` for dealing with files.
#
# @module
Tower._.extend Tower,
  PATHS: {}

  statSync: (path) ->
    fs.statSync(path)

  stat: (path, callback) ->
    fs.stat(path, callback)
  
  readFile: ->
    fs.readFile(arguments...)

  # Tower.readFileSync
  readFileSync: ->
    fs.readFileSync(arguments...)

  writeFile: (path, data, callback) ->
    @createDirectorySync @dirname(path)
    
    fs.writeFile(path, data, callback)
    
  writeFileSync: (path, data) ->
    @createDirectorySync @dirname(path)
    fs.writeFileSync(path, data)
    
  removeFile: (path, callback) ->
    fs.unlink(path, callback)

  removeFileSync: (path) ->
    fs.unlinkSync(path)

  createDirectorySync: (path, mode) ->
    Tower.module('wrench').mkdirSyncRecursive(path, mode)

  removeDirectorySync: (path) ->
    Tower.module('wrench').rmdirSyncRecursive(path, true) # failSilent

  copyDirectorySync: (from, to, options = {}) ->
    Tower.module('wrench').copyDirSyncRecursive(from, to, options)
  
  # http://stackoverflow.com/questions/4568689/how-do-i-move-file-a-to-a-different-partition-in-node-js  
  # https://gist.github.com/992478
  copyFile: (from, to) ->
    oldFile = fs.createReadStream(from)
    newFile = fs.createWriteStream(to)
    newFile.once 'open', (data) ->
      util.pump(oldFile, newFile)
    
  mkdirpSync: (dir) ->
    dir = _path.resolve(_path.normalize(dir))
    try
      fs.mkdirSync(dir, parseInt('0755'))
    catch e
      switch e.errno
        when 47
          break
        when 34
          @mkdirpSync _path.dirname(dir)
          return @mkdirpSync(dir)
        else
          throw e

  entries: (path, callback) ->
    fs.readdir(path, callback)

  entriesSync: (path) ->
    fs.readdirSync(path)

  # Tower.contentType
  contentType: (path) ->
    Tower.module('mime').lookup(path)
  
  # Tower.mtime 
  mtime: (path, callback) ->
    @_statProperty(path, 'mtime', callback)
  
  mtimeSync: (path) ->
    @statSync(path).mtime

  size: (path, callback) ->
    @_statProperty(path, 'size', callback)

  sizeSync: (path) ->
    @statSync(path).size
    
  exists: (path, callback) ->
    fs.exists(path, callback)

  existsSync: (path) ->
    fs.existsSync(path)
    
  glob: ->
    paths   = _.flatten _.args(arguments)
    wrench  = Tower.module('wrench')
    result  = []
    for path in paths
      if @existsSync(path)
        found = wrench.readdirSyncRecursive(path)
        for item, index in found
          result.push(path + _path.sep + item)
    result
    
  files: ->
    paths   = @glob(arguments...)
    result  = []
    for path in paths
      result.push(path) if @isFileSync(path)
    result
    
  directories: ->
    paths   = @glob(arguments...)
    result  = []
    for path in paths
      result.push(path) if @isDirectorySync(path) && !(path == '.' || path == '..')
    result
    
  isDirectory: (path, callback) ->
    @_statMethod(path, 'isDirectory', callback)

  isDirectorySync: (path) ->
    @statSync(path).isDirectory()
    
  isFile: (path, callback) ->
    @_statMethod path, 'isDirectory', (error, isDirectory) =>
      callback.call(@, error, !isDirectory)

  isFileSync: (path) ->
    !@isDirectorySync(path)

  expandPath: (path, root) ->
    @absolutePath(path, root)

  normalizePath: (path) ->
    _path.normalize(path)
    
  absolutePath: (path, root = @pwd()) ->
    path = root + '/' + path unless path.charAt(0) == '/'
    _path.normalize(path)

  relativePath: (path, root = @pwd()) ->
    _path.relative(root, path)

  relativePathOld: (path, root = @pwd()) ->
    path = @join(root, path) if path[0] == '.'
    _path.normalize(path.replace(new RegExp('^' + root.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '/'), ''))

  resolvePath: (path) ->
    _path.resolve(path)
   
  extensions: (path) ->
    @basename(path).match(/(\.\w+)/g)
    
  join: ->
    _path.join(arguments...)

  isUrl: (path) ->
    !!path.match(/^[-a-z]+:\/\/|^cid:|^\/\//)
  
  # @todo windows
  isAbsolute: (path) ->
    path.charAt(0) == '/'
    
  pwd: ->
    process.cwd()
  
  basename: ->
    _path.basename(arguments...)
    
  dirname: (path) ->
    _path.dirname(path)
    
  extname: (path) ->
    _path.extname(path)
  
  # Tower.pathSlug('/Users/name/app/server.js') #=> "server"
  slug: (path) ->
    @basename(path).replace(new RegExp(@extname(path) + '$'), '')
  
  digestFileSync: (path) ->
    @pathWithFingerprint(path, @digestPathSync(path))
    
  pathFingerprint: (path) ->
    result = @basename(path).match(/-([0-9a-f]{32})\.?/)
    if result? then result[1] else null
    
  pathWithFingerprint: (path, digest) ->
    if oldDigest = @pathFingerprint(path)
      path.replace(oldDigest, digest)
    else
      path.replace(/\.(\w+)$/, "-#{digest}.\$1")
  
  # see http://nodejs.org/docs/latest/api/crypto.html#crypto_crypto_createhash_algorithm
  digestHash: ->
    Tower.module('crypto').createHash(Tower.hashingAlgorithm)
    
  digestPath: (path, data, callback) ->
    @stat path, (error, stat) =>
      unless stat?
        callback.call(@) if callback
        return

      hash = @digestHash()

      if typeof data == 'function'
        callback = data
        data = null

      unless data?
        @readFile path, 'utf-8', (error, data) =>
          callback.call(@, error, hash.update(data).digest('hex'))
      else
        callback.call(@, null, hash.update(data).digest('hex'))

  digestPathSync: (path, data) ->
    stat = @statSync(path)
    return unless stat?
    data ||= @readFileSync(path)
    return unless data?
    @digestHash().update(data).digest('hex')
    
  stale: (path) ->
    oldMtime  = @PATHS[path]
    newMtime  = @mtime(path)
    result    = !!(oldMtime && oldMtime.getTime() != newMtime.getTime())
    
    @PATHS[path] = newMtime
    
    result

  touch: (path, callback) ->
    exec "touch -m #{path.replace(/\ /, '\\ ')}", (error) =>
      if callback
        callback.call(@, error)
      else
        throw error if error

  _statProperty: (path, property, callback) ->
    @stat path, (error, stat) =>
      return callback.call(@, error) if error
      callback.call(@, null, stat[property])

  _statMethod: (path, method, callback) ->
    @stat path, (error, stat) =>
      return callback.call(@, error) if error
      callback.call(@, null, stat[method]())
