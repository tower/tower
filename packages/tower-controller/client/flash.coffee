Tower.ControllerFlash =
  InstanceMethods:
    # Both send and recieve flash messages
    flash: (type, message) ->
      messages = $.jStorage.get('flash', {})
      if type && message
        messages[type] = String message
        $.jStorage.set('flash', messages)
      else if type
        arr = messages[type]
        delete messages[type]
        $.jStorage.set('flash', messages)
        String arr || ''
      else
        $.jStorage.set('flash', {})
        messages

module.exports = Tower.ControllerFlash
