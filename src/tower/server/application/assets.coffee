{exec, spawn} = require 'child_process'
async         = require 'async'
fs            = require 'fs'
path          = require 'path'
mint          = require 'mint'
_path         = require 'path'
Pathfinder    = require 'pathfinder'
File          = Pathfinder.File
puts          = require('util').puts
print         = require('util').print

# @module
# Tower.module "Application.Assets"
# https://github.com/tomgallacher/gzippo
Tower.Application.Assets =
  # Loads "public/assets/manifest.json".
  #
  # @return [Object] the JSON contained in that file.
  loadManifest: ->
    try
      Tower.assetManifest = JSON.parse(require('fs').readFileSync('public/assets/manifest.json', 'utf-8'))
    catch error
      Tower.assetManifest = {}

  # Minify and gzip assets for production.
  #
  # @return [void]
  bundle: ->
    gzip          = require 'gzip'

    exec "rm -r public/assets", ->
      exec "mkdir public/assets", ->
        manifest = {}

        bundle = (type, extension, compressor, callback) ->
          assets      = Tower.config.assets[type]

          compile = (data, next) ->
            {name, paths} = data
            # queue.push name: name, paths: paths, extension: extension, type: type, compressor: compressor
            _console.debug "Bundling public/assets/#{name}#{extension}"
            content = ""

            for path in paths
              content += File.read("public/#{type}#{path}#{extension}") + "\n\n"

            fs.writeFileSync "public/assets/#{name}#{extension}", content

            process.nextTick ->
              compressor content, {}, (error, result) ->
                if error
                  console.log error
                  return next(error)
                digestPath  = File.digestFile("public/assets/#{name}#{extension}")

                manifest["#{name}#{extension}"]  = File.basename(digestPath)

                #gzip result, (error, result) ->
                fs.writeFileSync digestPath, result
                next()

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
            _console.debug "Writing public/assets/manifest.json"
            fs.writeFileSync "public/assets/manifest.json", JSON.stringify(manifest, null, 2)
            process.exit()
            #process.nextTick ->
            #  invoke 'stats'

  # Upload assets to Amazon S3
  #
  # @return [void]
  upload: (block) ->
    gzip          = require 'gzip'

    cachePath = "tmp/asset-cache.json"

    fs.mkdirSync "tmp" unless _path.existsSync("tmp")

    assetCache  = if File.exists(cachePath) then JSON.parse(File.read(cachePath)) else {}

    _console.debug "Uploading to #{Tower.secrets.s3.bucket}"

    images      = _.select File.files("public/images"), (path) -> !!path.match(/\.(gif|ico|png|jpg)$/i)
    fonts       = _.select File.files("public/fonts"), (path) -> !!path.match(/\.(tff|woff|svg|eot)$/i)
    stylesheets = _.select File.files("public/assets"), (path) -> !!path.match(/-[a-f0-9]+\.(css)$/i)
    stylesheets = _.map stylesheets, (path) -> path.replace(/^public\/assets/, "stylesheets")
    javascripts = _.select File.files("public/assets"), (path) -> !!path.match(/-[a-f0-9]+\.(js)$/i)
    javascripts = _.map javascripts, (path) -> path.replace(/^public\/assets/, "javascripts")

    paths       = _.map images.concat(fonts).concat(stylesheets).concat(javascripts), (path) -> path.replace(/^public\//, "")

    expirationDate  = new Date()
    expirationDate.setTime(expirationDate.getTime() + 1000 * 60 * 60 * 24 * 365)

    # http://code.google.com/intl/en/speed/page-speed/docs/caching.html#LeverageBrowserCaching
    cacheHeaders    =
      "Cache-Control":  "public"
      "Expires":        expirationDate.toUTCString()

    gzipHeaders     =
      "Content-Encoding": "gzip"
      "Vary":             "Accept-Encoding"

    process.on 'exit', ->
      File.write(cachePath, JSON.stringify(assetCache, null, 2))
    process.on 'SIGINT', ->
      process.exit()

    # images
    upload    = (path, next) ->
      _console.debug "Uploading /#{path}"

      headers = _.extend {}, cacheHeaders

      if !!path.match(/^(stylesheets|javascripts)/)
        headers = _.extend headers, gzipHeaders, {"Etag": File.pathFingerprint(path)}
      else
        headers = _.extend headers, {"Etag": File.digest("public/#{path}")}

      cached    = assetCache[path]

      unless !!(cached && cached["Etag"] == headers["Etag"])
        cached = _.extend {}, headers

        block "public/#{path.replace(/^(stylesheets|javascripts)/, "assets")}", "/#{path}", headers, (error, result) ->
          process.nextTick ->
            assetCache[path] = cached
            next(error)
      else
        next()

    Tower.async paths, upload, (error) ->
      console.log(error) if error

      File.write(cachePath, JSON.stringify(assetCache, null, 2))

  stats: ->
    Table     = require 'cli-table'
    manifest  = Tower.assetManifest

    table     = new Table
      head:       ['Path', 'Compressed (kb)', 'Normal (kb)', '%']
      colWidths:  [60, 20, 20, 10]

    for big, small of manifest
      path = "public/assets/#{small}"
      stat = fs.statSync(path)
      compressedSize = stat.size / 1000.0
      path = "public/assets/#{big}"
      stat = fs.statSync(path)
      normalSize = stat.size / 1000.0

      percent = (1 - (compressedSize / normalSize)) * 100.0
      percent = percent.toFixed(1)
      
      compressedSize  = compressedSize.toFixed(1)
      normalSize      = normalSize.toFixed(1)
      
      if compressedSize == normalSize == "0.0"
        percent = "-"
      else
        percent = "#{percent}%"

      table.push [path, compressedSize, normalSize, percent]

    console.log table.toString()

module.exports = Tower.Application.Assets
