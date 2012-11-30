_ = Tower._

Tower.ControllerFlash =
  # Both send and recieve flash messages
  flash: (type, msg) ->
    msgs = @session.flash = @session.flash || {}
    if type && msg
      msgs[type] = String msg
    else if type
      arr = msgs[type]
      delete msgs[type]
      String arr || ""
    else
      @session.flash = {}
      msgs

module.exports = Tower.ControllerFlash
