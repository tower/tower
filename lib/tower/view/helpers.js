
Tower.View.Helpers = {
  titleTag: function(title) {
    return "<title>" + title + "</title>";
  },
  metaTag: function(name, content) {
    return "<meta name=\"" + name + "\" content=\"" + content + "\"/>";
  },
  tag: function(name, options) {},
  linkTag: function(title, path, options) {},
  imageTag: function(path, options) {},
  csrfMetaTag: function() {
    return this.metaTag("csrf-token", this.request.session._csrf);
  },
  contentTypeTag: function(type) {
    if (type == null) type = "UTF-8";
    return "<meta charset=\"" + type + "\" />";
  },
  javascriptTag: function(path) {
    return "<script type=\"text/javascript\" src=\"" + path + "\" ></script>";
  },
  stylesheetTag: function(path) {
    return "<link href=\"" + path + "\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\"/>";
  },
  mobileTags: function() {
    return "<meta content='yes' name='apple-mobile-web-app-capable'>\n<meta content='yes' name='apple-touch-fullscreen'>\n<meta content='initial-scale = 1.0, maximum-scale = 1.0, user-scalable = no, width = device-width' name='viewport'>";
  }
};

module.exports = Tower.View.Helpers;
