# This defines all the meta tag and other html `<head>` helpers.
#
# @mixin
Tower.View.HeadHelper =
  metaTag: (name, content) ->
    meta name: name, content: content

  snapshotLinkTag: (href) ->
    linkTag rel: "imageSrc", href: href

  html4ContentTypeTag: (charset = "UTF-8", type = "text/html") ->
    httpMetaTag "Content-Type", "#{type}; charset=#{charset}"

  chromeFrameTag: ->
    html4ContentTypeTag()
    meta "http-equiv": "X-UA-Compatible", content: "IE=Edge,chrome=1"

  html5ContentTypeTag: (charset = "UTF-8") ->
    meta charset: charset

  contentTypeTag: (charset) ->
    html5ContentTypeTag charset

  csrfMetaTag: ->
    metaTag "csrf-token", @request.session._csrf

  searchLinkTag: (href, title) ->
    linkTag rel: "search", type: "application/opensearchdescription+xml", href: href, title: title

  faviconLinkTag: (favicon = "/favicon.ico") ->
    linkTag rel: "shortcut icon", href: favicon, type: "image/x-icon"

  linkTag: (options = {}) ->
    link options

  ieApplicationMetaTags: (title, options = {}) ->
    result = []

    result.push metaTag("application-name", title)
    result.push metaTag("msapplication-tooltip", options.tooltip) if options.hasOwnProperty("tooltip")
    result.push metaTag("msapplication-starturl", options.url) if options.hasOwnProperty("url")

    if options.hasOwnProperty("width") && options.hasOwnProperty("height")
      result.push metaTag("msapplication-window", "width=#{options.width};height=#{options.height}")
      result.push metaTag("msapplication-navbutton-color", options.color) if options.hasOwnProperty("color")

    result.join("\n")

  ieTaskMetaTag: (name, path, icon = null) ->
    content = []

    content.push "name=#{name}"
    content.push "uri=#{path}"
    content.push "icon-uri=#{icon}" if icon

    @metaTag "msapplication-task", content.join(";")

  appleMetaTags: (options = {}) ->
    result = []

    result.push appleViewportMetaTag(options)
    result.push appleFullScreenMetaTag(options.fullScreen) if options.hasOwnProperty("fullScreen")
    result.push appleMobileCompatibleMetaTag(options.mobile) if options.hasOwnProperty("mobile")

    result.join()

  # http://www.html5rocks.com/en/mobile/mobifying.html
  appleViewportMetaTag: (options = {}) ->
    viewport = []

    viewport.push "width=#{options.width}" if options.hasOwnProperty("width")
    viewport.push "height=#{options.height}" if options.hasOwnProperty("height")
    viewport.push "initial-scale=#{options.scale || 1.0}"
    viewport.push "minimum-scale=#{options.min}" if options.hasOwnProperty("min")
    viewport.push "maximum-scale=#{options.max}" if options.hasOwnProperty("max")
    viewport.push "user-scalable=#{boolean(options.scalable)}" if options.hasOwnProperty("scalable")

    metaTag "viewport", viewport.join(", ")

  appleFullScreenMetaTag: (value) ->
    metaTag "apple-touch-fullscreen", boolean(value)

  appleMobileCompatibleMetaTag: (value) ->
    metaTag "apple-mobile-web-app-capable", boolean(value)

  appleTouchIconLinkTag: (path, options = {}) ->
    rel = ["apple-touch-icon"]
    rel.push "#{options.size}x#{options.size}" if options.hasOwnProperty("size")
    rel.push "precomposed" if options.precomposed

    linkTag rel: rel.join("-"), href: path

  appleTouchIconLinkTags: (path, sizes...) ->
    if typeof sizes[sizes.length - 1] == "object"
      options = sizes.pop()
    else
      options = {}

    result  = []

    for size in sizes
      result.push appleTouchIconLinkTag(path, _.extend(size: size, options))

    result.join()

  openGraphMetaTags: (options = {}) ->
    openGraphMetaTag("og:title", options.title) if options.title
    openGraphMetaTag("og:type", options.type) if options.type
    openGraphMetaTag("og:image", options.image) if options.image
    openGraphMetaTag("og:siteName", options.site) if options.site
    openGraphMetaTag("og:description", options.description) if options.description
    openGraphMetaTag("og:email", options.email) if options.email
    openGraphMetaTag("og:phoneNumber", options.phone) if options.phone
    openGraphMetaTag("og:faxNumber", options.fax) if options.fax
    openGraphMetaTag("og:latitude", options.lat) if options.lat
    openGraphMetaTag("og:longitude", options.lng) if options.lng
    openGraphMetaTag("og:street-address", options.street) if options.street
    openGraphMetaTag("og:locality", options.city) if options.city
    openGraphMetaTag("og:region", options.state) if options.state
    openGraphMetaTag("og:postal-code", options.zip) if options.zip
    openGraphMetaTag("og:country-name", options.country) if options.country

    null

  openGraphMetaTag: (property, content) ->
    meta property: property, content: content

module.exports = Tower.View.HeadHelper
