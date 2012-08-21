# @mixin
Tower.ViewEmberHelper =
  hEach: ->
    hBlock 'each', arguments...

  hWith: ->
    hBlock 'with', arguments...

  hIf: ->
    hBlock 'if', arguments...

  hElse: ->
    text '{{else}}'

  hUnless: ->
    hBlock 'unless', arguments...

  # @example Inline view
  #   {{view infoView}}
  #
  # @example Block view
  #   # input
  #   hView 'App.InfoView', ->
  #     b 'Posts: {{posts}}'
  #     b 'Hobbies: {{hobbies}}'
  #   # output
  #   {{#view App.InfoView}}
  #     <b>Posts: {{posts}}</b>
  #     <b>Hobbies: {{hobbies}}</b>
  #   {{/view}}
  hView: ->
    hBlock 'view', arguments...

  # @example
  #   # input
  #   hBindAttr src: "src", ->
  #   # output
  #   {{bindAttr src="src"}}
  hBindAttr: ->
    hAttr 'bindAttr', arguments...

  # @example
  #   # input
  #   hAction "anAction", target: "App.viewStates"
  #   # output
  #   {{action "anAction" target="App.viewStates"}}
  hAction: ->
    hAttr 'action', arguments...

  hAttr: (key, string, options) ->
    if typeof string == 'object'
      options = string
      string  = ""
    else
      string = " \"#{string}\""

    if options
      for k, v of options
        string += """ #{k}="#{v}"
"""

    text "{{#{key}#{string}}}"

  hBlock: (key, string, options, block) ->
    if typeof options == 'function'
      block   = options
      options = {}
    options ||= {}

    unless _.isBlank(string)
      string = " #{string}"
      for k, v of options
        string += """ #{k}="#{v}"
"""

    text "{{##{key}#{string}}}#{if block then "\n" else ""}"
    if block
      block()
      text "{{/#{key}}}"

module.exports = Tower.ViewEmberHelper
