require './metro/support'

class Metro
  @autoload 'Asset',        './metro/asset'
  @autoload 'Application',  './metro/application'
  @autoload 'Route',        './metro/route'
  @autoload                 './metro/model'
  @autoload                 './metro/view'
  @autoload                 './metro/controller'
  @autoload                 './metro/presenter'
  @autoload                 './metro/middleware'
  @autoload                 './metro/command'
  @autoload                 './metro/generator'
  @autoload                 './metro/spec'

module.exports = global.Metro = Metro
