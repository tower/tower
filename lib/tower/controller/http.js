
Tower.Controller.HTTP = {
  head: function(status, options) {
    var location;
    if (options == null) options = {};
    if (typeof status === "object") {
      options = status;
      status = null;
    }
    status || (status = options.status || "ok");
    location = options.location;
    delete options.status;
    delete options.location;
    this.status = status;
    if (location) this.location = urlFor(location);
    if (formats) this.contentType = Mime[formats.first];
    return this.body = " ";
  }
};

module.exports = Tower.Controller.HTTP;
