fs            = require 'fs'
path          = require 'path'
_path         = require 'path'
_             = Tower._

# @module
# Tower.module "Application.Assets"
# https://github.com/tomgallacher/gzippo
Tower.ApplicationAssets =
  # Loads "public/assets/manifest.json".
  #
  # @return [Object] the JSON contained in that file.
  loadManifest: ->
    try
      Tower.assetManifest = JSON.parse(Tower.readFileSync('public/asset-manifest.json', 'utf-8'))
    catch error
      Tower.assetManifest = {}

  # Minify and gzip assets for production.
  #
  # @return [void]
  bundle: (options = {}) ->
    gzip          = require 'gzip'
    mint          = Tower.module('mint')
    options.minify = true unless options.hasOwnProperty('minify')

    manifest = {}

    bundle = (type, extension, compressor, callback) ->
      assets      = Tower.config.assets[type]

      compile = (data, next) ->
        {name, paths} = data
        # queue.push name: name, paths: paths, extension: extension, type: type, compressor: compressor
        console.log "Bundling public/#{type}/#{name}#{extension}"
        content = ''

        for path in paths
          content += Tower.readFileSync("public/#{type}#{path}#{extension}", 'utf-8') + "\n\n"

        Tower.writeFileSync "public/#{type}/#{name}#{extension}", content

        if options.minify
          process.nextTick ->
            compressor content, {}, (error, content) ->
              if error
                console.log error
                return next(error)

              do (content) =>
                result = content
                digestPath  = Tower.digestFileSync("public/#{type}/#{name}#{extension}")

                manifest["#{name}#{extension}"]  = Tower.basename(digestPath)

                #gzip result, (error, result) ->
                Tower.writeFile digestPath, result, ->
                  next()
        else
          process.nextTick(next)

      assetBlocks = []

      for name, paths of assets
        assetBlocks.push name: name, paths: paths

      Tower.async assetBlocks, compile, (error) ->
        callback(error)

    bundleIterator = (data, next) ->
      bundle data.type, data.extension, data.compressor, next

    bundles = [
      {type: "stylesheets", extension: ".css", compressor: mint.yui},
      {type: "javascripts", extension: ".js", compressor: mint.uglifyjs}
    ]

    process.nextTick ->
      Tower.async bundles, bundleIterator, (error) ->
        throw error if error
        console.log 'Writing public/asset-manifest.json'
        Tower.writeFile "public/asset-manifest.json", JSON.stringify(manifest, null, 2), ->
          process.nextTick ->
            process.exit()
        #process.nextTick ->
        #  invoke 'stats'

  # Upload assets to Amazon S3
  #
  # @return [void]
  upload: (block) ->
    gzip = require 'gzip'
    cachePath = 'tmp/asset-cache.json'
    fs.mkdirSync('tmp') unless Tower.existsSync('tmp')

    try
      assetCache  = if Tower.existsSync(cachePath) then JSON.parse(Tower.readFileSync(cachePath, 'utf-8')) else {}
    catch error
      console.log error.message
      assetCache  = {}

    config = try Tower.config.credentials.s3
    if config && config.bucket
      console.log "Uploading to #{config.bucket}"

    images      = _.select Tower.files('public/images'), (path) -> !!path.match(/\.(gif|ico|png|jpg)$/i)
    fonts       = _.select Tower.files('public/fonts'), (path) -> !!path.match(/\.(tff|woff|svg|eot)$/i)
    stylesheets = _.select Tower.files('public/assets'), (path) -> !!path.match(/-[a-f0-9]+\.(css)$/i)
    javascripts = _.select Tower.files('public/assets'), (path) -> !!path.match(/-[a-f0-9]+\.(js)$/i)

    paths       = _.map images.concat(fonts).concat(stylesheets).concat(javascripts), (path) -> path.replace(/^public\//, "")

    expirationDate  = new Date()
    expirationDate.setTime(expirationDate.getTime() + 1000 * 60 * 60 * 24 * 365)

    # http://code.google.com/intl/en/speed/page-speed/docs/caching.html#LeverageBrowserCaching
    cacheHeaders    =
      'Cache-Control':  'public'
      'Expires':        expirationDate.toUTCString()

    gzipHeaders     = {}
      #'Content-Encoding': 'gzip'
      #'Vary':             'Accept-Encoding'

    process.on 'exit', ->
      # :) this should use the not createWriteStream API (https://gist.github.com/2947293)
      Tower.writeFileSync(cachePath, JSON.stringify(assetCache, null, 2))

    process.on 'SIGINT', ->
      process.exit()

    # images
    upload    = (path, next) ->
      console.log "Uploading /#{path}"

      headers = _.extend {}, cacheHeaders

      if !!path.match(/^(stylesheets|javascripts)/)
        headers = _.extend headers, gzipHeaders, {'Etag': Tower.pathFingerprint(path)}
      else
        headers = _.extend headers, {'Etag': Tower.digestPathSync("public/#{path}")}

      # This won't do anything for assets with md5 hash, 
      # since old bundles are removed. Need to make more robust.
      # Also, the asset-cache.json file should be updated whenever a file is removed.
      # Should also maybe ping S3 first, to see if file on S3 is older than current file
      # (it would be ideal if you could do this all in 1 request, with "if not match" or whatever).
      cached    = assetCache[path]

      unless !!(cached && cached['Etag'] == headers['Etag'])
        cached = _.extend {}, headers

        block "public/#{path}", "/#{path}", headers, (error, result) ->
          console.log error if error

          process.nextTick ->
            assetCache[path] = cached
            next(error)
      else
        next()

    Tower.async paths, upload, (error) ->
      console.log(error) if error
      # change this, it causes cake command to freeze (well, not exit).
      process.nextTick ->
        Tower.writeFile cachePath, JSON.stringify(assetCache, null, 2), ->
          process.nextTick ->
            process.exit()

  # Make sure you install knox
  uploadToS3: (callback) ->
    knox    = require('knox')
    client  = knox.createClient Tower.config.credentials.s3

    @upload (from, to, headers, next) ->
      # @todo use putStream
      client.putFile from, to, headers, next

  stats: ->
    Table     = require 'cli-table'
    manifest  = Tower.assetManifest

    table     = new Table
      head:       ['Path', 'Compressed (kb)', 'Normal (kb)', '%']
      colWidths:  [60, 20, 20, 10]

    for big, small of manifest
      path = "public/assets/#{small}"
      stat = Tower.statSync(path)
      compressedSize = stat.size / 1000.0
      path = "public/assets/#{big}"
      stat = Tower.statSync(path)
      normalSize = stat.size / 1000.0

      percent = (1 - (compressedSize / normalSize)) * 100.0
      percent = percent.toFixed(1)

      compressedSize  = compressedSize.toFixed(1)
      normalSize      = normalSize.toFixed(1)

      if compressedSize == normalSize == '0.0'
        percent = '-'
      else
        percent = "#{percent}%"

      table.push [path, compressedSize, normalSize, percent]

    console.log table.toString()

module.exports = Tower.ApplicationAssets
