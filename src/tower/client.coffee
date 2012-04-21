window.global       ||= window
module                = global.module || {}
global.Tower = Tower  = {}
Tower.version         = "0.0.0" # this is dynamically modified so it doesn't really matter what it is.
Tower.logger          = console
# include underscore.string mixins
_.mixin(_.string.exports())

Tower.modules =
  validator:  global
  accounting: global.accounting
  moment:     global.moment
  geo:        global.geolib
  inflector:  global.inflector # https://github.com/gmosx/inflection
  async:      global.async # https://github.com/gmosx/inflection

require './support'
require './application'
require './client/application'
require './store'
require './client/store'
require './model'
require './view'
require './client/view'
require './controller'
require './client/controller'
require './http'
require './middleware'
