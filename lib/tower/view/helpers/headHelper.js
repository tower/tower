var __slice = Array.prototype.slice;

Tower.View.HeadHelper = {
  metaTag: function(name, content) {
    return meta({
      name: name,
      content: content
    });
  },
  snapshotLinkTag: function(href) {
    return this.linkTag({
      rel: "imageSrc",
      href: href
    });
  },
  html4ContentTypeTag: function(charset, type) {
    if (charset == null) charset = "UTF-8";
    if (type == null) type = "text/html";
    return this.httpMetaTag("Content-Type", "" + type + "; charset=" + charset);
  },
  html5ContentTypeTag: function(charset) {
    if (charset == null) charset = "UTF-8";
    return meta({
      charset: charset
    });
  },
  contentTypeTag: function(charset) {
    return this.html5ContentTypeTag(charset);
  },
  searchLinkTag: function(href, title) {
    return this.linkTag({
      rel: "search",
      type: "application/opensearchdescription+xml",
      href: href,
      title: title
    });
  },
  faviconLinkTag: function(favicon) {
    if (favicon == null) favicon = "/favicon.ico";
    return this.linkTag({
      rel: "shortcut icon",
      href: favicon,
      type: "image/x-icon"
    });
  },
  linkTag: function(options) {
    if (options == null) options = {};
    return link(options);
  },
  ieApplicationMetaTags: function(title, options) {
    var result;
    if (options == null) options = {};
    result = [];
    result.push(this.metaTag("application-name", title));
    if (options.hasOwnProperty("tooltip")) {
      result.push(this.metaTag("msapplication-tooltip", options.tooltip));
    }
    if (options.hasOwnProperty("url")) {
      result.push(this.metaTag("msapplication-starturl", options.url));
    }
    if (options.hasOwnProperty("width") && options.hasOwnProperty("height")) {
      result.push(this.metaTag("msapplication-window", "width=" + options.width + ";height=" + options.height));
      if (options.hasOwnProperty("color")) {
        result.push(this.metaTag("msapplication-navbutton-color", options.color));
      }
    }
    return result.join("\n");
  },
  ieTaskMetaTag: function(name, path, icon) {
    var content;
    if (icon == null) icon = null;
    content = [];
    content.push("name=" + name);
    content.push("uri=" + path);
    if (icon) content.push("icon-uri=" + icon);
    return this.metaTag("msapplication-task", content.join(";"));
  },
  appleMetaTags: function(options) {
    var result;
    if (options == null) options = {};
    result = [];
    result.push(this.appleViewportMetaTag(options));
    if (options.hasOwnProperty("fullScreen")) {
      result.push(this.appleFullScreenMetaTag(options.fullScreen));
    }
    if (options.hasOwnProperty("mobile")) {
      result.push(this.appleMobileCompatibleMetaTag(options.mobile));
    }
    return result.join();
  },
  appleViewportMetaTag: function(options) {
    var viewport;
    if (options == null) options = {};
    viewport = [];
    if (options.hasOwnProperty("width")) viewport.push("width=" + options.width);
    if (options.hasOwnProperty("height")) {
      viewport.push("height=" + options.height);
    }
    viewport.push("initial-scale=" + (options.scale || 1.0));
    if (options.hasOwnProperty("min")) {
      viewport.push("minimum-scale=" + options.min);
    }
    if (options.hasOwnProperty("max")) {
      viewport.push("maximum-scale=" + options.max);
    }
    if (options.hasOwnProperty("scalable")) {
      viewport.push("user-scalable=" + (this.boolean(options.scalable)));
    }
    return this.metaTag("viewport", viewport.join(", "));
  },
  appleFullScreenMetaTag: function(value) {
    return this.metaTag("apple-touch-fullscreen", this.boolean(value));
  },
  appleMobileCompatibleMetaTag: function(value) {
    return this.metaTag("apple-mobile-web-app-capable", this.boolean(value));
  },
  appleTouchIconLinkTag: function(path, options) {
    var rel;
    if (options == null) options = {};
    rel = ["apple-touch-icon"];
    if (options.hasOwnProperty("size")) {
      rel.push("" + options.size + "x" + options.size);
    }
    if (options.precomposed) rel.push("precomposed");
    return this.linkTag({
      rel: rel.join("-"),
      href: path
    });
  },
  appleTouchIconLinkTags: function() {
    var options, path, result, size, sizes, _i, _len;
    path = arguments[0], sizes = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (typeof sizes[sizes.length - 1] === "object") {
      options = sizes.pop();
    } else {
      options = {};
    }
    result = [];
    for (_i = 0, _len = sizes.length; _i < _len; _i++) {
      size = sizes[_i];
      result.push(this.appleTouchIconLinkTag(path, _.extend({
        size: size
      }, options)));
    }
    return result.join();
  },
  openGraphMetaTags: function(options) {
    var result;
    if (options == null) options = {};
    result = [];
    if (options.title) {
      result.push(this.openGraphMetaTag("og:title", options.title));
    }
    if (options.type) result.push(this.openGraphMetaTag("og:type", options.type));
    if (options.image) {
      result.push(this.openGraphMetaTag("og:image", options.image));
    }
    if (options.site) {
      result.push(this.openGraphMetaTag("og:siteName", options.site));
    }
    if (options.description) {
      result.push(this.openGraphMetaTag("og:description", options.description));
    }
    if (options.email) {
      result.push(this.openGraphMetaTag("og:email", options.email));
    }
    if (options.phone) {
      result.push(this.openGraphMetaTag("og:phoneNumber", options.phone));
    }
    if (options.fax) {
      result.push(this.openGraphMetaTag("og:faxNumber", options.fax));
    }
    if (options.lat) {
      result.push(this.openGraphMetaTag("og:latitude", options.lat));
    }
    if (options.lng) {
      result.push(this.openGraphMetaTag("og:longitude", options.lng));
    }
    if (options.street) {
      result.push(this.openGraphMetaTag("og:street-address", options.street));
    }
    if (options.city) {
      result.push(this.openGraphMetaTag("og:locality", options.city));
    }
    if (options.state) {
      result.push(this.openGraphMetaTag("og:region", options.state));
    }
    if (options.zip) {
      result.push(this.openGraphMetaTag("og:postal-code", options.zip));
    }
    if (options.country) {
      result.push(this.openGraphMetaTag("og:country-name", options.country));
    }
    return result.join("\n");
  },
  openGraphMetaTag: function(property, content) {
    return this.meta({
      property: property,
      content: content
    });
  }
};

module.exports = Tower.View.HeadHelper;
