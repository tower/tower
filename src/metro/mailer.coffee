class Metro.Mailer extends Metro.Object

require './mailer/configuration'
require './mailer/rendering'

Metro.Mailer.include Metro.Mailer.Configuration
Metro.Mailer.include Metro.Mailer.Rendering

module.exports = Metro.Mailer
