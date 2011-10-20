# Mock Request/Response
class Http
  # https://github.com/visionmedia/expresso/blob/c6454b4ffbbfba6b6b803017fecbccbf3f768ad5/bin/expresso#L383
  # https://github.com/senchalabs/connect/blob/master/test/connect.test.js
  response: (server, req, res, msg) ->
    check = ->
      try
        server.__port = server.address().port
        server.__listening = true
      catch err
        process.nextTick check
        return
      if server.__deferred
        server.__deferred.forEach (fn) ->
          fn()

        server.__deferred = null
    issue = ->
      timer   = undefined
      method  = req.method or "GET"
      status  = res.status or res.statusCode
      data    = req.data or req.body
      requestTimeout = req.timeout or 0
      encoding = req.encoding or "utf8"
      request = http.request(
        host: "127.0.0.1"
        port: server.__port
        path: req.url
        method: method
        headers: req.headers
      )
      check = ->
        if --server.__pending is 0
          server.close()
          server.__listening = false

      if requestTimeout
        timer = setTimeout(->
          check()
          delete req.timeout

          test.failure new Error(msg + "Request timed out after " + requestTimeout + "ms.")
        , requestTimeout)
      
      request.write data if data
      
      request.on "response", (response) ->
        response.body = ""
        response.setEncoding encoding
        response.on "data", (chunk) ->
          response.body += chunk

        response.on "end", ->
          clearTimeout timer  if timer
          try
            if res.body isnt `undefined`
              eql = (if res.body instanceof RegExp then res.body.test(response.body) else res.body is response.body)
              assert.ok eql, msg + "Invalid response body.\n" + "    Expected: " + util.inspect(res.body) + "\n" + "    Got: " + util.inspect(response.body)
            assert.equal response.statusCode, status, msg + colorize("Invalid response status code.\n" + "    Expected: [green]{" + status + "}\n" + "    Got: [red]{" + response.statusCode + "}")  if typeof status is "number"
            if res.headers
              keys = Object.keys(res.headers)
              i = 0
              len = keys.length

              while i < len
                name = keys[i]
                actual = response.headers[name.toLowerCase()]
                expected = res.headers[name]
                eql = (if expected instanceof RegExp then expected.test(actual) else expected is actual)
                assert.ok eql, msg + colorize("Invalid response header [bold]{" + name + "}.\n" + "    Expected: [green]{" + expected + "}\n" + "    Got: [red]{" + actual + "}")
                ++i
            callback response
            test.success msg
          catch err
            test.failure err
            test.callback()
          finally
            idx = test._pending.indexOf(token)
            if idx >= 0
              test._pending.splice idx, 1
            else
              test.failure new Error("Request succeeded, but token vanished: " + msg)
            check()

      request.end()
    test = assert._test
    callback = (if typeof res is "function" then res else (if typeof msg is "function" then msg else ->
    ))
    msg = null  if typeof msg is "function"
    msg = msg or test.title
    msg += ". "
    token = new Error("Response not completed: " + msg)
    test._pending.push token
    server.__pending = server.__pending or 0
    server.__pending++
    unless server.fd
      server.__deferred = server.__deferred or []
      server.listen server.__port = port++, "127.0.0.1", check
    else unless server.__port
      server.__deferred = server.__deferred or []
      process.nextTick check
    unless server.__listening
      server.__deferred.push issue
      return
    else
      issue()
module.exports = Http
