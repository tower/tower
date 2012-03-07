window.global       ||= window
module                = global.module || {}
global.Tower = Tower  = {}
Tower.version         = "0.3.0"
Tower.logger          = console

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
