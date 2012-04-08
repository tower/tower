# @mixin
Tower.View.StringHelper =
  # Characters that need to be escaped to HTML entities from user input
  HTML_ESCAPE:
    '&': '&amp;'
    '<': '&lt;'
    '>': '&gt;'
    '"': '&quot;'
    "'": '&#039;'

  preserve: (text) ->
    text.replace(/\n/g, '&#x000A;').replace(/\r/g, '')

  htmlEscape: (text) ->
    text.replace /[\"><&]/g, (_) => @HTML_ESCAPE[_]

  t: (string) ->
    Tower.Support.I18n.translate(string)

  l: (object) ->
    Tower.Support.I18n.localize(string)

  boolean: (boolean) ->
    if boolean then "yes" else "no"

module.exports = Tower.View.StringHelper
