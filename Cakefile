fs     = require('fs')
watch  = require('./node_modules/watch')
Metro  = require('./lib/metro')
_      = require('./node_modules/underscore')

Metro.configure ->
  @assets.path            = "./spec/tmp/assets"
  @assets.css_compressor  = "yui"
  @assets.js_compressor   = "uglifier"
  @assets.js              = ["application.js"]
  @assets.js_paths        = ["./spec/fixtures"]
  
task 'watch', ->
  watch.watchTree './spec/fixtures', (f, curr, prev) ->
    if typeof f == "object" && prev == null && curr == null
      #Finished walking the tree
      console.log "walked"
      @
    else if prev == null
      # f is a new file
      console.log "new"
      @
    else if curr.nlink == 0
      # f was removed
      console.log "removed"
      @
    else
      # f was changed
      console.log "changed"
      Metro.Asset.compile()
      @
    # console.log curr