require './server/generator'
require './server/actions'
require './server/configuration'
require './server/helpers'
require './server/resources'
require './server/shell'

Tower.Generator.include Tower.Generator.Actions
Tower.Generator.include Tower.Generator.Configuration
Tower.Generator.include Tower.Generator.Helpers
Tower.Generator.include Tower.Generator.Resources
Tower.Generator.include Tower.Generator.Shell

Tower.Generator.Mocha = {}

require './server/generators/tower/app/appGenerator'
require './server/generators/tower/model/modelGenerator'
require './server/generators/tower/view/viewGenerator'
require './server/generators/tower/controller/controllerGenerator'
require './server/generators/tower/helper/helperGenerator'
require './server/generators/tower/assets/assetsGenerator'
require './server/generators/tower/mailer/mailerGenerator'
require './server/generators/tower/scaffold/scaffoldGenerator'
require './server/generators/mocha/model/modelGenerator'
require './server/generators/mocha/controller/controllerGenerator'
require './server/generators/library/libraryGenerator'
