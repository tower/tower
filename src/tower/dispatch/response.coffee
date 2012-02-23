class Tower.Dispatch.Response
  constructor: (data = {}) ->
    @url        = data.url
    @location   = data.location
    @pathname   = @location.path
    @query      = @location.query
    @title      = data.title
    @title    ||= document?.title
    @body       = data.body     || {}
    @headers    = data.headers  || {}
    @headerSent = false
    @statusCode = 200
    @body       = ""

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
    
  redirect: (path, options = {}) ->
    History.push options, null, path

module.exports = Tower.Dispatch.Response
