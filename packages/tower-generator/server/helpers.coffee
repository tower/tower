_ = Tower._

# @mixin
Tower.GeneratorHelpers =
  route: (routingCode) ->
    # @log "route", routingCode

    if @controller.namespaced
      # @todo, add namespaces and such
      @injectIntoFile "#{Tower.root}/app/config/shared/routes.coffee", "  #{routingCode}\n", after: /\.Route\.draw ->\n/, duplicate: false
    else
      @injectIntoFile "#{Tower.root}/app/config/shared/routes.coffee", "  #{routingCode}\n", after: /\.Route\.draw ->\n/, duplicate: false

  seed: (model) ->
    string = """
\ \ (callback) =>
\ \ \ \ _(20).timesAsync callback, (next) =>
\ \ \ \ \ \ Tower.Factory.create '#{@model.name}', (error, record) =>
\ \ \ \ \ \ \ \ console.log _.stringify(record)
\ \ \ \ \ \ \ \ next()

"""
    @injectIntoFile "#{Tower.root}/data/seeds.coffee", string, after: /_.series *\[ *\n/i, duplicate: false

  bootstrap: (model) ->
    # bootstrap into client side
    @injectIntoFile "#{Tower.root}/app/config/client/bootstrap.coffee",
      "  #{@app.namespace}.#{model.className}.load(data.#{model.namePlural}) if data.#{model.namePlural}\n",
        after: /bootstrap\ = *\(data\) *-\> *\n/i
        duplicate: false

    # bootstrap into server side
    string = """
\ \ \ \ \ \ (next) => #{@app.namespace}.#{@model.className}.all (error, #{@model.namePlural}) =>
        data.#{@model.namePlural} = #{@model.namePlural}
        next()

"""
    @injectIntoFile "#{Tower.root}/app/controllers/server/applicationController.coffee", string, after: /_.series *\[ *\n/i, duplicate: false

  asset: (path, options = {}) ->
    bundle = options.bundle || "application"

    @injectIntoFile "#{Tower.root}/app/config/server/assets.coffee", "      \'#{path}\'\n",
      after: new RegExp("\\s*#{bundle}: *\\[[^\\]]*\\n", "i"),
      duplicate: false

  navigation: (key, path) ->
    pattern = /div *class: *'nav-collapse' *, *->\s+ul *class: *'nav', *-> */
    content = """\n    li '{{bindAttr class="App.#{@model.className}Controller.isActive:active"}}', ->
\ \ \ \ \ \ a '{{action index#{@model.className} href=true}}', t('links.#{key}')
"""
#    content = """\n    navItem t('links.#{key}'), #{path}
#"""

    @injectIntoFile "#{Tower.root}/app/templates/shared/layout/_navigation.coffee", content, after: pattern, duplicate: false

  locale: (pattern, content) ->
    @injectIntoFile "#{Tower.root}/app/config/shared/locales/en.coffee", content, after: pattern, duplicate: false
