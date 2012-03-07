require 'Tower'

task 'routes', ->
  invoke 'environment'
  
  result  = []
  routes  = Tower.Route.all()
  
  result