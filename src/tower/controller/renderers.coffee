mime = require 'mime'

Tower.Controller.addRenderers
  json: (json, options, callback) ->
    json = JSON.stringify(json) unless typeof(json) == "string"
    json = "#{options.callback}(#{json})" if options.callback
    @contentType ||= mime.lookup("json")
    callback null, json if callback
    json
  
  # https://github.com/wdavidw/node-csv-parser
  # csv: (csv, options, callback) ->
    
  # https://github.com/devongovett/pdfkit
  # pdf: (data, options, callback) ->
    