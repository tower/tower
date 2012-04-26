var __slice = [].slice;

Tower.View.HeadHelper = {
  metaTag: function(name, content) {
    return meta({
      name: name,
      content: content
    });
  },
  snapshotLinkTag: function(href) {
    return linkTag({
      rel: "imageSrc",
      href: href
    });
  },
  html4ContentTypeTag: function(charset, type) {
    if (charset == null) {
      charset = "UTF-8";
    }
    if (type == null) {
      type = "text/html";
    }
    return httpMetaTag("Content-Type", "" + type + "; charset=" + charset);
  },
  chromeFrameTag: function() {
    html4ContentTypeTag();
    return meta({
      "http-equiv": "X-UA-Compatible",
      content: "IE=Edge,chrome=1"
    });
  },
  html5ContentTypeTag: function(charset) {
    if (charset == null) {
      charset = "UTF-8";
    }
    return meta({
      charset: charset
    });
  },
  contentTypeTag: function(charset) {
    return html5ContentTypeTag(charset);
  },
  csrfMetaTag: function() {
    return metaTag("csrf-token", this.request.session._csrf);
  },
  searchLinkTag: function(href, title) {
    return linkTag({
      rel: "search",
      type: "application/opensearchdescription+xml",
      href: href,
      title: title
    });
  },
  faviconLinkTag: function(favicon) {
    if (favicon == null) {
      favicon = "/favicon.ico";
    }
    return linkTag({
      rel: "shortcut icon",
      href: favicon,
      type: "image/x-icon"
    });
  },
  linkTag: function(options) {
    if (options == null) {
      options = {};
    }
    return link(options);
  },
  ieApplicationMetaTags: function(title, options) {
    var result;
    if (options == null) {
      options = {};
    }
    result = [];
    result.push(metaTag("application-name", title));
    if (options.hasOwnProperty("tooltip")) {
      result.push(metaTag("msapplication-tooltip", options.tooltip));
    }
    if (options.hasOwnProperty("url")) {
      result.push(metaTag("msapplication-starturl", options.url));
    }
    if (options.hasOwnProperty("width") && options.hasOwnProperty("height")) {
      result.push(metaTag("msapplication-window", "width=" + options.width + ";height=" + options.height));
      if (options.hasOwnProperty("color")) {
        result.push(metaTag("msapplication-navbutton-color", options.color));
      }
    }
    return result.join("\n");
  },
  ieTaskMetaTag: function(name, path, icon) {
    var content;
    if (icon == null) {
      icon = null;
    }
    content = [];
    content.push("name=" + name);
    content.push("uri=" + path);
    if (icon) {
      content.push("icon-uri=" + icon);
    }
    return this.metaTag("msapplication-task", content.join(";"));
  },
  appleMetaTags: function(options) {
    var result;
    if (options == null) {
      options = {};
    }
    result = [];
    result.push(appleViewportMetaTag(options));
    if (options.hasOwnProperty("fullScreen")) {
      result.push(appleFullScreenMetaTag(options.fullScreen));
    }
    if (options.hasOwnProperty("mobile")) {
      result.push(appleMobileCompatibleMetaTag(options.mobile));
    }
    return result.join();
  },
  appleViewportMetaTag: function(options) {
    var viewport;
    if (options == null) {
      options = {};
    }
    viewport = [];
    if (options.hasOwnProperty("width")) {
      viewport.push("width=" + options.width);
    }
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
      viewport.push("user-scalable=" + (boolean(options.scalable)));
    }
    return metaTag("viewport", viewport.join(", "));
  },
  appleFullScreenMetaTag: function(value) {
    return metaTag("apple-touch-fullscreen", boolean(value));
  },
  appleMobileCompatibleMetaTag: function(value) {
    return metaTag("apple-mobile-web-app-capable", boolean(value));
  },
  appleTouchIconLinkTag: function(path, options) {
    var rel;
    if (options == null) {
      options = {};
    }
    rel = ["apple-touch-icon"];
    if (options.hasOwnProperty("size")) {
      rel.push("" + options.size + "x" + options.size);
    }
    if (options.precomposed) {
      rel.push("precomposed");
    }
    return linkTag({
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
      result.push(appleTouchIconLinkTag(path, _.extend({
        size: size
      }, options)));
    }
    return result.join();
  },
  openGraphMetaTags: function(options) {
    if (options == null) {
      options = {};
    }
    if (options.title) {
      openGraphMetaTag("og:title", options.title);
    }
    if (options.type) {
      openGraphMetaTag("og:type", options.type);
    }
    if (options.image) {
      openGraphMetaTag("og:image", options.image);
    }
    if (options.site) {
      openGraphMetaTag("og:siteName", options.site);
    }
    if (options.description) {
      openGraphMetaTag("og:description", options.description);
    }
    if (options.email) {
      openGraphMetaTag("og:email", options.email);
    }
    if (options.phone) {
      openGraphMetaTag("og:phoneNumber", options.phone);
    }
    if (options.fax) {
      openGraphMetaTag("og:faxNumber", options.fax);
    }
    if (options.lat) {
      openGraphMetaTag("og:latitude", options.lat);
    }
    if (options.lng) {
      openGraphMetaTag("og:longitude", options.lng);
    }
    if (options.street) {
      openGraphMetaTag("og:street-address", options.street);
    }
    if (options.city) {
      openGraphMetaTag("og:locality", options.city);
    }
    if (options.state) {
      openGraphMetaTag("og:region", options.state);
    }
    if (options.zip) {
      openGraphMetaTag("og:postal-code", options.zip);
    }
    if (options.country) {
      openGraphMetaTag("og:country-name", options.country);
    }
    return null;
  },
  openGraphMetaTag: function(property, content) {
    return meta({
      property: property,
      content: content
    });
  }
};

module.exports = Tower.View.HeadHelper;
