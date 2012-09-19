exec  = require("child_process").exec
File  = require("pathfinder").File
fs    = require 'fs'

# @mixin
Tower.GeneratorHelpers =
  route: (routingCode) ->
    # @log "route", routingCode

    @inRoot =>
      if @controller.namespaced
        # @todo, add namespaces and such
        @injectIntoFile "app/config/shared/routes.coffee", "  #{routingCode}\n", after: /\.Route\.draw ->\n/, duplicate: false
      else
        @injectIntoFile "app/config/shared/routes.coffee", "  #{routingCode}\n", after: /\.Route\.draw ->\n/, duplicate: false

  seed: (model) ->
    string = """
\ \ (callback) =>
\ \ \ \ _(20).timesAsync callback, (next) =>
\ \ \ \ \ \ Tower.Factory.create '#{@model.name}', (error, record) =>
\ \ \ \ \ \ \ \ console.log _.stringify(record)
\ \ \ \ \ \ \ \ next()

"""
    @injectIntoFile "data/seeds.coffee", string, after: /_.series *\[ *\n/i, duplicate: false

  bootstrap: (model) ->
    @inRoot =>
      # bootstrap into client side
      @injectIntoFile "app/config/client/bootstrap.coffee",
        "  #{@app.namespace}.#{model.className}.load(data.#{model.namePlural}) if data.#{model.namePlural}\n",
          after: /bootstrap\ = *\(data\) *-\> *\n/i
          duplicate: false

      # bootstrap into server side
      string = """
\ \ \ \ \ \ (next) => #{@app.namespace}.#{@model.className}.all (error, #{@model.namePlural}) =>
        data.#{@model.namePlural} = #{@model.namePlural}
        next()

"""
      @injectIntoFile "app/controllers/server/applicationController.coffee", string, after: /_.series *\[ *\n/i, duplicate: false

  asset: (path, options = {}) ->
    bundle = options.bundle || "application"
    @inRoot =>
      @injectIntoFile "app/config/server/assets.coffee", "      \'#{path}\'\n",
        after: new RegExp("\\s*#{bundle}: *\\[[^\\]]*\\n", "i"),
        duplicate: false

  navigation: (key, path) ->
    pattern = /div *class: *'nav-collapse' *, *->\s+ul *class: *'nav', *-> */
    content = """\n    li ->
\ \ \ \ \ \ a '{{action index#{@model.className} href=true}}', t('links.#{key}')
"""
#    content = """\n    navItem t('links.#{key}'), #{path}
#"""

    @inRoot =>
      @injectIntoFile "app/templates/shared/layout/_navigation.coffee", content, after: pattern, duplicate: false

  locale: (pattern, content) ->
    @inRoot =>
      @injectIntoFile "app/config/shared/locales/en.coffee", content, after: pattern, duplicate: false

  inRoot: (block) ->
    @inside ".", block

module.exports = Tower.GeneratorHelpers
