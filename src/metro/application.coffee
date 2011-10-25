class Application
  @Configuration: require './application/configuration'
  @Server:        require './application/server'
  
  @instance: -> 
    @_instance ?= new Metro.Application
  
module.exports = Application
