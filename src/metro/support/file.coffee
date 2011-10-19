fs      = require('fs')
crypto  = require('crypto')
mime    = require('mime')
_path   = require('path')
util    = require('util')

class File
  @stat: (path) ->
    fs.statSync(path)
  
  # see http://nodejs.org/docs/v0.3.1/api/crypto.html#crypto
  @digest_hash: ->
    crypto.createHash('md5')
    
  @digest: (path, data) ->
    stat = @stat(path)
    return unless stat?
    data ?= @read(path)
    return unless data?
    @digest_hash().update(data).digest("hex")
    
  @read: (path) ->
    fs.readFileSync(path)
    
  @slug: (path) ->
    @basename(path).replace(new RegExp(@extname(path) + "$"), "")
    
  @content_type: (path) ->
    mime.lookup(path)
    
  @mtime: (path) ->
    @stat(path).mtime
    
  @expand_path: (path) ->
    _path.normalize(path)
  
  @basename: (path) ->
    _path.basename(path)
    
  @extname: (path) ->
    _path.extname(path)
    
  @exists: (path) ->
    _path.exists(path)
    
  @extensions: (path) ->
    @basename(path).split(".")[1..-1]
  
  # http://stackoverflow.com/questions/4568689/how-do-i-move-file-a-to-a-different-partition-in-node-js  
  # https://gist.github.com/992478
  @copy: (from, to) ->
    old_file = fs.createReadStream(from)
    new_file = fs.createWriteStream(to)
    new_file.once 'open', (data) ->
      util.pump(old_file, new_file)
      
  @watch: ->
  
  constructor: (path) ->
    @path           = path
    @previous_mtime  = @mtime()
    
  stale: ->
    old_mtime   = @previous_mtime
    new_mtime   = @mtime()
    result      = old_mtime.getTime() != new_mtime.getTime()
    
    console.log "stale? #{result.toString()}, old_mtime: #{old_mtime}, new_mtime: #{new_mtime}"
    
    # update
    @previous_mtime = new_mtime
    
    result
    
  mtime: ->
    @constructor.mtime(@path)

module.exports = File
