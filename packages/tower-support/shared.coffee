Tower.Support = {}

require './shared/array'
require './shared/number'
require './shared/object'
require './shared/regexp'
require './shared/string'
require './shared/geo'

_.mixin Tower.Support.Array
_.mixin Tower.Support.Number
_.mixin Tower.Support.Object
_.mixin Tower.Support.RegExp
_.mixin Tower.Support.String

# hack
try _.string.isBlank = Tower.Support.Object

require './shared/callbacks'
require './shared/shared'
require './shared/class'
require './shared/eventEmitter'
require './shared/i18n'
require './shared/url'
require './shared/locale/en'
require './shared/format'
require './shared/factory'

module.exports = Tower.Support
