# @mixin
Tower.ControllerSockets =
  ClassMethods:
    
    # Working on the server
    on: ->
    	#Tower.Application.instance().socket()

Tower.Controller.reopen
	
	# Working on the server:
	emit: ->
		console.log "Working..."


module.exports = Tower.ControllerSockets
