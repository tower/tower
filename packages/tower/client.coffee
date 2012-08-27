window.global       ||= window
_                     = global._
module                = global.module || {}
global.Tower = Tower  = Ember.Namespace.create()
Tower.version         = "0.0.0" # this is dynamically modified so it doesn't really matter what it is.
Tower.logger          = console
# include underscore.string mixins
_.mixin(_.string.exports())

# @todo lazily load these somehow
Tower._modules =
  validator:  -> global
  accounting: -> global.accounting
  moment:     -> global.moment
  geo:        -> global.geolib
  inflector:  -> global.inflector # https://github.com/gmosx/inflection
  async:      -> global.async # https://github.com/gmosx/inflection
  coffeecup:  -> if global.CoffeeCup then global.CoffeeCup else global.CoffeeKup
  socketio:   -> try global.io
  sockjs:     -> try global.SockJS
  _:          -> _

require '../tower-support/client'
require '../tower-application/client'
require '../tower-store/client'
require '../tower-model/client'
require '../tower-view/client'
require '../tower-controller/client'
require '../tower-net/client'
require '../tower-middleware/server'

Tower.goTo = (string, params) ->
  History.pushState(params, params?.title, string)

# compile pattern for location?
# location = new RegExp(window.location.hostname)

if typeof History != 'undefined'
  Tower.history     = History
  Tower.forward     = History.forward
  Tower.back        = History.back
  Tower.go          = History.go
