(function() {
  var Http;

  Http = (function() {

    function Http() {}

    Http.prototype.response = function(server, req, res, msg) {
      var callback, check, issue, test, token;
      check = function() {
        try {
          server.__port = server.address().port;
          server.__listening = true;
        } catch (err) {
          process.nextTick(check);
          return;
        }
        if (server.__deferred) {
          server.__deferred.forEach(function(fn) {
            return fn();
          });
          return server.__deferred = null;
        }
      };
      issue = function() {
        var data, encoding, method, request, requestTimeout, status, timer;
        timer = void 0;
        method = req.method || "GET";
        status = res.status || res.statusCode;
        data = req.data || req.body;
        requestTimeout = req.timeout || 0;
        encoding = req.encoding || "utf8";
        request = http.request({
          host: "127.0.0.1",
          port: server.__port,
          path: req.url,
          method: method,
          headers: req.headers
        });
        check = function() {
          if (--server.__pending === 0) {
            server.close();
            return server.__listening = false;
          }
        };
        if (requestTimeout) {
          timer = setTimeout(function() {
            check();
            delete req.timeout;
            return test.failure(new Error(msg + "Request timed out after " + requestTimeout + "ms."));
          }, requestTimeout);
        }
        if (data) request.write(data);
        request.on("response", function(response) {
          response.body = "";
          response.setEncoding(encoding);
          response.on("data", function(chunk) {
            return response.body += chunk;
          });
          return response.on("end", function() {
            var actual, eql, expected, i, idx, keys, len, name;
            if (timer) clearTimeout(timer);
            try {
              if (res.body !== undefined) {
                eql = (res.body instanceof RegExp ? res.body.test(response.body) : res.body === response.body);
                assert.ok(eql, msg + "Invalid response body.\n" + "    Expected: " + util.inspect(res.body) + "\n" + "    Got: " + util.inspect(response.body));
              }
              if (typeof status === "number") {
                assert.equal(response.statusCode, status, msg + colorize("Invalid response status code.\n" + "    Expected: [green]{" + status + "}\n" + "    Got: [red]{" + response.statusCode + "}"));
              }
              if (res.headers) {
                keys = Object.keys(res.headers);
                i = 0;
                len = keys.length;
                while (i < len) {
                  name = keys[i];
                  actual = response.headers[name.toLowerCase()];
                  expected = res.headers[name];
                  eql = (expected instanceof RegExp ? expected.test(actual) : expected === actual);
                  assert.ok(eql, msg + colorize("Invalid response header [bold]{" + name + "}.\n" + "    Expected: [green]{" + expected + "}\n" + "    Got: [red]{" + actual + "}"));
                  ++i;
                }
              }
              callback(response);
              return test.success(msg);
            } catch (err) {
              test.failure(err);
              return test.callback();
            } finally {
              idx = test._pending.indexOf(token);
              if (idx >= 0) {
                test._pending.splice(idx, 1);
              } else {
                test.failure(new Error("Request succeeded, but token vanished: " + msg));
              }
              check();
            }
          });
        });
        return request.end();
      };
      test = assert._test;
      callback = (typeof res === "function" ? res : (typeof msg === "function" ? msg : function() {}));
      if (typeof msg === "function") msg = null;
      msg = msg || test.title;
      msg += ". ";
      token = new Error("Response not completed: " + msg);
      test._pending.push(token);
      server.__pending = server.__pending || 0;
      server.__pending++;
      if (!server.fd) {
        server.__deferred = server.__deferred || [];
        server.listen(server.__port = port++, "127.0.0.1", check);
      } else if (!server.__port) {
        server.__deferred = server.__deferred || [];
        process.nextTick(check);
      }
      if (!server.__listening) {
        server.__deferred.push(issue);
      } else {
        return issue();
      }
    };

    return Http;

  })();

  module.exports = Http;

}).call(this);
