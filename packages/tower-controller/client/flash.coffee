Tower.ControllerFlash =
  InstanceMethods:
    # Both send and recieve flash messages

    flash: (type, msg) ->
      msgs = $.jStorage.get("flash", {})
      if type && msg
        msgs[type] = String msg
        $.jStorage.set("flash", msgs)
      else if type
        arr = msgs[type]
        delete msgs[type]
        $.jStorage.set("flash", msgs)
        String arr || ""
      else
        $.jStorage.set("flash", {})
        msgs

module.exports = Tower.ControllerFlash
