class Metro.Net.Response
  constructor: (data = {}) ->
    @url        = data.url
    @parsedUrl  = data.parsedUrl
    @pathname   = @parsedUrl.attr("path")
    @query      = @parsedUrl.data.query
    @title      = data.title    || document.title
    @headers    = data.headers  || {}
    @headerSent = false
    @statusCode = 200
    @body       = ""

  # writeHead(200, controller.headers)
  writeHead: (statusCode, headers) ->
    @statusCode = statusCode
    @headers    = headers

  setHeader: (key, value) ->
    throw new Error("Headers already sent") if @headerSent
    @headers[key] = value

  write: (body = '') ->
    @body += body

  end: (body = '') ->
    @body       += body
    @sent       = true
    @headerSent = true
