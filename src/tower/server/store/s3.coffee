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

      return next(new Error('Must specify the upload path, file.to, for ' + file.path)) unless file.to?

      fs.stat file.path, (error, stats) =>
        file.length = stats.size

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
    paths   = _.castArray(cursor)
    client  = @client()

    destroy = (path, next) =>
      return next() unless path?
      client.deleteFile(path, next)

    Tower.series paths, destroy, (error) =>
      callback.call(@, error) if callback

  createDatabase: ->
    @createBucket(arguments...)

  createBucket: ->

module.exports = Tower.Store.S3
