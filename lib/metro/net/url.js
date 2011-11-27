
  Metro.Net.Url = (function() {

    Url.key = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "fragment"];

    Url.aliases = {
      anchor: "fragment"
    };

    Url.parser = {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    };

    Url.querystringParser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g;

    Url.fragmentParser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g;

    Url.typeParser = /(youtube|vimeo|eventbrite)/;

    Url.parse = function(string, strictMode) {
      var i, key, res, type, url;
      key = Url.key;
      string = decodeURI(string);
      res = Url.parser[(strictMode || false ? "strict" : "loose")].exec(string);
      url = {
        attr: {},
        param: {},
        seg: {}
      };
      i = 14;
      while (i--) {
        url.attr[key[i]] = res[i] || "";
      }
      url.param["query"] = {};
      url.param["fragment"] = {};
      url.attr["query"].replace(Url.querystringParser, function($0, $1, $2) {
        if ($1) return url.param["query"][$1] = $2;
      });
      url.attr["fragment"].replace(Url.fragmentParser, function($0, $1, $2) {
        if ($1) return url.param["fragment"][$1] = $2;
      });
      url.seg["path"] = url.attr.path.replace(/^\/+|\/+$/g, "").split("/");
      url.seg["fragment"] = url.attr.fragment.replace(/^\/+|\/+$/g, "").split("/");
      url.attr["base"] = (url.attr.host ? url.attr.protocol + "://" + url.attr.host + (url.attr.port ? ":" + url.attr.port : "") : "");
      type = Url.typeParser.exec(url.attr.host);
      if (type) url.attr["type"] = type[0];
      return url;
    };

    function Url(url, strictMode) {
      if (typeof url === "object") {
        this.data = url;
      } else {
        if (arguments.length === 1 && url === true) {
          strictMode = true;
          url = void 0;
        }
        this.strictMode = strictMode || false;
        url = url;
        if (typeof window !== "undefined" && window !== null) {
          if (url == null) url = window.location.toString();
        }
        this.data = Url.parse(url, strictMode);
      }
    }

    Url.prototype.attr = function(attr) {
      attr = Url.aliases[attr] || attr;
      if (attr !== void 0) {
        return this.data.attr[attr];
      } else {
        return this.data.attr;
      }
    };

    Url.prototype.param = function(param) {
      if (param !== void 0) {
        return this.data.param.query[param];
      } else {
        return this.data.param.query;
      }
    };

    Url.prototype.fparam = function(param) {
      if (param !== void 0) {
        return this.data.param.fragment[param];
      } else {
        return this.data.param.fragment;
      }
    };

    Url.prototype.segment = function(seg) {
      if (seg === void 0) {
        return this.data.seg.path;
      } else {
        seg = (seg < 0 ? this.data.seg.path.length + seg : seg - 1);
        return this.data.seg.path[seg];
      }
    };

    Url.prototype.fsegment = function(seg) {
      if (seg === void 0) {
        return this.data.seg.fragment;
      } else {
        seg = (seg < 0 ? this.data.seg.fragment.length + seg : seg - 1);
        return this.data.seg.fragment[seg];
      }
    };

    return Url;

  })();

  module.exports = Metro.Net.Url;
