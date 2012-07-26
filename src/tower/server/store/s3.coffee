class Tower.Store.S3 extends Tower.Store
  client: ->
    return @_client if @_client
    knox      = require('knox')
    @_client  = knox.createClient Tower.config.credentials.s3

  insert: (cursor, callback) ->
    files   = [cursor]
    client  = @client()
    mime    = require('mime')
    fs      = require('fs')
    
    create = (file, next) =>
      # tmp
      delete file._data

      fs.stat file.path, (error, stats) =>
        file.length = stats.size
        
        # @todo tmp
        file.to ||= "/test-images/#{file.filename}"

        # @todo far-future expires headers
        headers = 
          'Content-Length': file.length,
          'Content-Type':   file.mime || mime.lookup(file.filename)
          'x-amz-acl':      'public-read'

        upload = =>
          stream  = fs.createReadStream(file.path)

          client.putStream stream, file.to, headers, (error, response) =>
            stream.destroy()
            next(error)

        upload()

    Tower.series files, create, (error) =>
      callback.call(@, error) if callback

  create: ->
    @insert arguments...

  update: (updates, cursor, callback) ->

  destroy: (cursor, callback) ->
    paths = _.castArray(cursor)

    destroy = (path, next) =>
      return next() unless path?
      knox.deleteFile(path, next)

    Tower.series paths, destroy, (error) =>
      callback.call(@, error) if callback

  createDatabase: ->
    @createBucket(arguments...)

  createBucket: ->
    