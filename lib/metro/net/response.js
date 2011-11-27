
  Metro.Net.Response = (function() {

    function Response(data) {
      if (data == null) data = {};
      this.url = data.url;
      this.parsedUrl = data.parsedUrl;
      this.pathname = this.parsedUrl.attr("path");
      this.query = this.parsedUrl.data.query;
      this.title = data.title || document.title;
      this.headers = data.headers || {};
      this.headerSent = false;
      this.statusCode = 200;
      this.body = "";
    }

    Response.prototype.writeHead = function(statusCode, headers) {
      this.statusCode = statusCode;
      return this.headers = headers;
    };

    Response.prototype.setHeader = function(key, value) {
      if (this.headerSent) throw new Error("Headers already sent");
      return this.headers[key] = value;
    };

    Response.prototype.write = function(body) {
      if (body == null) body = '';
      return this.body += body;
    };

    Response.prototype.end = function(body) {
      if (body == null) body = '';
      this.body += body;
      this.sent = true;
      return this.headerSent = true;
    };

    return Response;

  })();
