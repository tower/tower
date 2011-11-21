class Metro.Net.Request
  constructor: (data = {}) ->
    @url        = data.url
    @parsedUrl  = data.parsedUrl
    @pathname   = @parsedUrl.attr("path")
    @query      = @parsedUrl.data.query
    @title      = data.title    || document.title
    @body       = data.body     || {}
    @headers    = data.headers  || {}
    @method     = data.method   || "GET"
