Tower.View.Helpers =
  titleTag: (title) ->
    "<title>#{title}</title>"

  metaTag: (name, content) ->
    """<meta name="#{name}" content="#{content}"/>"""

  tag: (name, options) ->

  linkTag: (title, path, options) ->

  imageTag: (path, options) ->

  csrfMetaTag: ->
    @metaTag("csrf-token", @request.session._csrf)

  contentTypeTag: (type = "UTF-8") ->
    "<meta charset=\"#{type}\" />"

  javascriptTag: (path) ->
    "<script type=\"text/javascript\" src=\"#{path}\" ></script>"

  stylesheetTag: (path) ->
    "<link href=\"#{path}\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\"/>"

  mobileTags: ->
    """
    <meta content='yes' name='apple-mobile-web-app-capable'>
    <meta content='yes' name='apple-touch-fullscreen'>
    <meta content='initial-scale = 1.0, maximum-scale = 1.0, user-scalable = no, width = device-width' name='viewport'>
    """

module.exports = Tower.View.Helpers
