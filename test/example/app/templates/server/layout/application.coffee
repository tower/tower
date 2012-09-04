doctype 5
html ->
  head ->
    partial 'shared/meta'
  body role: 'application', ->
    # if browserIs 'ie'
    #   javascriptTag 'http://html5shiv.googlecode.com/svn/trunk/html5.js'
    script type: 'text/x-handlebars', 'data-template-name': 'application', ->

    #if hasContentFor 'bottom'
    #  yields 'bottom'

    javascripts 'vendor'
    javascripts 'lib', 'application'
    if Tower.env == 'development'
      javascripts 'development'

      # @todo tmp hack way of limiting what tests are run.
      if @params.test
        tests   = _.map @params.test.split(/,\s+/), (i) ->
          _.regexpEscape(i)

        pattern = new RegExp(tests.join('|'), 'i')

        for js in Tower.config.assets.javascripts.tests
          if js.match(pattern)
            javascriptTag "/javascripts#{js}.js"
      else
        javascripts 'tests'

    script "App.bootstrap(#{JSON.stringify(@bootstrapData, null, [])})" if @bootstrapData
    
    div id: "mocha", ->