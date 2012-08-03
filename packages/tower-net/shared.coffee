# @module
# - Rename to Net (or Transport).
# - Ajax will be like in socket.io, a type of transport used by the store to sync data
# This could also mean all the stores are really transports, so you could
# even use Mongodb with the Memory store...  Hmmm.
Tower.Net = {}

require './shared/agent'
require './shared/cookies'
require './shared/param'
require './shared/route'
require './shared/request'
require './shared/response'
require './shared/url'
require './shared/connection'

module.exports = Tower.Net
