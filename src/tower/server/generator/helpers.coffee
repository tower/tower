exec  = require("child_process").exec
File  = require("pathfinder").File
fs    = require 'fs'

# @mixin
Tower.Generator.Helpers =
  route: (routingCode) ->
    # @log "route", routingCode

    @inRoot =>
      if @controller.namespaced
        # @todo, add namespaces and such
        @injectIntoFile "config/routes.coffee", "  #{routingCode}\n", after: /\.Route\.draw ->\n/, duplicate: false
      else
        @injectIntoFile "config/routes.coffee", "  #{routingCode}\n", after: /\.Route\.draw ->\n/, duplicate: false

  bootstrap: (model) ->
    @inRoot =>
      # bootstrap into client side
      @injectIntoFile "app/client/config/application.coffee",
        "    @#{model.className}.load(data.#{model.namePlural}) if data.#{model.namePlural}\n", after: /bootstrap\: *\(data\) *-\> *\n/i

      # bootstrap into server side
      string = """
\ \ \ \ \ \ (next) => #{@app.namespace}.#{@model.className}.all (error, #{@model.namePlural}) =>
        data.#{@model.namePlural} = #{@model.namePlural}
        next()

"""
      @injectIntoFile "app/controllers/applicationController.coffee", string, after: /_.series *\[ *\n/i

  asset: (path, options = {}) ->
    bundle = options.bundle || "application"
    @inRoot =>
      @injectIntoFile "config/assets.coffee", "      \"#{path}\"\n", after: new RegExp("\\s*#{bundle}: *\\[[^\\]]+\\n", "i")

  navigation: (key, path) ->
    pattern = /div *class: *"nav-collapse" *, *->\s+ul *class: *"nav", *-> */
    content = """\n    navItem t("links.#{key}"), #{path}
"""

    @inRoot =>
      @injectIntoFile "app/views/shared/_navigation.coffee", content, after: pattern

  locale: (pattern, content) ->
    @inRoot =>
      @injectIntoFile "config/locales/en.coffee", content, after: pattern

  inRoot: (block) ->
    @inside ".", block
    
module.exports = Tower.Generator.Helpers
