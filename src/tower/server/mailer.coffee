class Tower.Mailer extends Tower.Class

require './mailer/configuration'
require './mailer/rendering'

Tower.Mailer.include Tower.Mailer.Configuration
Tower.Mailer.include Tower.Mailer.Rendering

module.exports = Tower.Mailer
