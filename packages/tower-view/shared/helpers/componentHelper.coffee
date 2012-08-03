Tower.View.ComponentHelper =
  formFor: ->
    _c = if typeof(__cc) == 'undefined' then __ck else __cc
    Tower.View.Form.render(_c, arguments...)

  tableFor: ->
    _c = if typeof(__cc) == 'undefined' then __ck else __cc
    Tower.View.Table.render(_c, arguments...)

  widget: ->

  linkTo: (title, path, options = {}) ->
    a _.extend(options, href: path, title: title), title.toString()

  navItem: (title, path, options = {}) ->
    li ->
      linkTo title, path, options
      
  term: (key, value) ->
    dt key
    dd value

module.exports = Tower.View.ComponentHelper
