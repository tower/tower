Tower.Support = {}

Tower._ = global._

require './shared/array'
require './shared/number'
require './shared/object'
require './shared/regexp'
require './shared/string'
require './shared/geo'

Tower._.mixin Tower.SupportArray
Tower._.mixin Tower.SupportNumber
Tower._.mixin Tower.SupportObject
Tower._.mixin Tower.SupportRegExp
Tower._.mixin Tower.SupportString

# hack
try _.string.isBlank = Tower.SupportObject

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
