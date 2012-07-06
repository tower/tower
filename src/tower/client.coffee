window.global       ||= window
module                = global.module || {}
global.Tower = Tower  = Ember.Namespace.create()
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
  coffeecup:  if global.CoffeeCup then global.CoffeeCup else global.CoffeeKup
  socketio:   try global.io
  sockjs:     try global.SockJS
  _:          _

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
require './net'
require './client/net'
require './middleware'

#_.extend T,
#  M: T.Model
#  V: T.View
#  C: T.Controller
#  S: T.Store

Tower.goTo = (string, params) ->
  History.pushState(params, params?.title, string)

# compile pattern for location?
# location = new RegExp(window.location.hostname)

if typeof History != 'undefined'
  Tower.history     = History
  Tower.forward     = History.forward
  Tower.back        = History.back
  Tower.go          = History.go
