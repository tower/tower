Tower.Controller.addRenderers
  json: (json, options, callback) ->
    unless typeof(json) == "string"
      if @params.prettify && @params.prettify.toString() == "true"
        json = JSON.stringify(json, null, 2)
      else
        json = JSON.stringify(json)
    json = "#{options.callback}(#{json})" if options.callback
    @headers["Content-Type"] ||= require("mime").lookup("json")
    callback null, json if callback
    json

  # https://github.com/wdavidw/node-csv-parser
  # csv: (csv, options, callback) ->

  # https://github.com/devongovett/pdfkit
  # pdf: (data, options, callback) ->
