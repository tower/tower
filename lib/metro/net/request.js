
  Metro.Net.Request = (function() {

    function Request(data) {
      if (data == null) data = {};
      this.url = data.url;
      this.parsedUrl = data.parsedUrl;
      this.pathname = this.parsedUrl.attr("path");
      this.query = this.parsedUrl.data.query;
      this.title = data.title || document.title;
      this.body = data.body || {};
      this.headers = data.headers || {};
      this.method = data.method || "GET";
    }

    return Request;

  })();
