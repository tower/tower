require './server/mailer'
require './server/configuration'
require './server/rendering'

Tower.Mailer.include Tower.Mailer.Configuration
Tower.Mailer.include Tower.Mailer.Rendering
