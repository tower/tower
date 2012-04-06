Tower.Support = {}

require './support/array'
require './support/number'
require './support/object'
require './support/regexp'
require './support/string'

_.mixin Tower.Support.Array
_.mixin Tower.Support.Number
_.mixin Tower.Support.Object
_.mixin Tower.Support.RegExp
_.mixin Tower.Support.String

require './support/callbacks'
require './support/class'
require './support/eventEmitter'
require './support/i18n'
require './support/url'
require './support/locale/en'

require './support/format'

module.exports = Tower.Support
