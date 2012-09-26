# http://en.wikipedia.org/wiki/List_of_HTTP_header_fields
# testing these integration-style so we have examples of how to use them,
# and make sure the edge cases work.
# http://news.ycombinator.org/item?id=1523664
# http://freelancing-gods.com/posts/versioning_your_ap_is
# http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
# https://gist.github.com/3786217
describe 'controller/server/headersTest', ->
  beforeEach (done) ->
    Tower.start(done)
  
  afterEach ->
    Tower.stop()

  describe 'request', ->
    describe 'standard', ->
      describe 'Accept', ->
        test 'undefined', (done) ->
          headers = {}

          _.get '/headers/acceptUndefined', headers: headers, (response) ->
            assert.equal response.headers['connection'], 'keep-alive'
            assert.equal response.headers['transfer-encoding'], 'chunked'
            assert.equal response.headers['content-type'], 'text/plain'
            done()

        test 'json', (done) ->
          headers = accept: 'application/json'

          _.get '/headers/acceptJSON', headers: headers, (response) ->
            assert.equal response.headers['connection'], 'keep-alive'
            assert.equal response.headers['transfer-encoding'], 'chunked'
            assert.equal response.headers['content-type'], 'application/json; charset=utf-8'
            done()

        # the charset param on `Accept` is not explicitly forbidden, but it is not in RFC, 
        # though many large sites use it. It's supposed to go on Accept-Charset
        #test 'Accept: application/json; charset=UTF-8; q=1.0', (done) ->
        #  headers = 'Accept': 'application/json; charset=UTF-8'
        #
        #  _.get '/headers/acceptWithCharsetParam', headers: headers, (response) ->
        #    done()

        # @todo express doesn't support this
        # test 'Accept: application/json;charset=UTF-8\nAccept-Charset: ISO-8859-1'

        test 'Accept: application/vnd.scalarium-v1+json'
        test 'Accept: text/html; q=1.0, text/*; q=0.8, image/gif; q=0.6, image/jpeg; q=0.6, image/*; q=0.5, */*; q=0.1'

      # http://stackoverflow.com/questions/7055849/accept-and-accept-charset-which-is-superior
      describe 'Accept-Charset', ->
        test 'utf-8', (done) ->
          headers = 'accept-charset': 'utf-8', 'accept': 'application/json'

          _.get '/headers/acceptCharsetUTF8', headers: headers, (response) ->
            assert.equal response.headers['content-type'], 'application/json; charset=utf-8'
            done()

        # @todo don't want to integrate iconv just yet, has cross-os issues.
        #test 'ISO-8859-1', (done) ->
        #  headers = 'accept-charset': 'ISO-8859-1', 'accept': 'application/json'
        #
        #  _.get '/headers/acceptCharsetISO', headers: headers, (response) ->
        #    assert.equal response.headers['content-type'], 'application/json; charset=ISO-8859-1'
        #    assert.equal response.text, '{"symbol":"OE"}'
        #    done()

      test 'Accept-Encoding'
      test 'Accept-Language'
      test 'Accept-Datetime'
      test 'Authorization'
      test 'Cache-Control'
      test 'Connection'
      test 'Cookie'
      test 'Content-Length'
      test 'Content-MD5'
      
      describe 'Content-Type', ->
        test 'GET should fail'
        test 'PUT'
        test 'POST'
        test 'DELETE should fail'

      test 'Date'
      test 'Expect'
      test 'From'
      test 'Host'
      test 'If-Match'
      test 'If-Modified-Since'
      test 'If-None-Match'
      test 'If-Range'
      test 'If-Unmodified-Since'
      test 'Max-Forwards'
      test 'Pragma'
      test 'Proxy-Authorization'
      test 'Range'
      # ha! Referer is misspelled
      test 'Referer'
      test 'TE'
      test 'Upgrade'
      test 'User-Agent'
      test 'Via'
      test 'Warning'

    describe 'non-standard', ->
      test 'X-Requested-With'

  describe 'response', ->
    describe 'standard', ->
      test 'Access-Control-Allow-Origin'
      test 'Accept-Ranges'
      test 'Age'
      test 'Allow'
      test 'Cache-Control'
      test 'Connection'
      test 'Content-Encoding'
      test 'Content-Language'
      test 'Content-Length'
      test 'Content-Location'
      test 'Content-MD5'
      test 'Content-Disposition'
      test 'Content-Range'
      test 'Content-Type'
      test 'Date'
      test 'ETag'
      test 'Expires'
      test 'Last-Modified'
      test 'Link'
      test 'Location'
      test 'Pragma'
      test 'Refresh'
      test 'Retry-After'
      test 'Server'
      test 'Set-Cookie'
      test 'Trailer'
      test 'Transfer-Encoding'
      test 'Vary'
      test 'Via'
      test 'Warning'
      test 'WWW-Authenticate'

    describe 'non-standard', ->
      test 'X-Frame-Options'
      test 'X-XSS-Protection'
      # Recommends the preferred rendering engine (often a backward-compatibility mode) to use to display the content. Also used to activate Chrome Frame in Internet Explorer.
      test 'X-UA-Compatible'