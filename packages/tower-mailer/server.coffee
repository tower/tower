require './server/mailer'
require './server/configuration'
require './server/rendering'

Tower.Mailer.include Tower.MailerConfiguration
Tower.Mailer.include Tower.MailerRendering
