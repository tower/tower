class Tower.Dispatch.Request
  constructor: (data = {}) ->
    @url        = data.url
    @location   = data.location
    @pathname   = @location.path
    @query      = @location.query
    @title      = data.title
    @title    ||= document?.title
    @body       = data.body     || {}
    @headers    = data.headers  || {}
    @method     = data.method   || "GET"

module.exports = Tower.Dispatch.Request
