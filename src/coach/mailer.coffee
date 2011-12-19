class Coach.Mailer extends Coach.Class

require './mailer/configuration'
require './mailer/rendering'

Coach.Mailer.include Coach.Mailer.Configuration
Coach.Mailer.include Coach.Mailer.Rendering

module.exports = Coach.Mailer
