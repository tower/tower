
Tower.ControllerFlash = {
  flash: function(type, message) {
    var arr, messages;
    messages = $.jStorage.get('flash', {});
    if (type && message) {
      messages[type] = String(message);
      return $.jStorage.set('flash', messages);
    } else if (type) {
      arr = messages[type];
      delete messages[type];
      $.jStorage.set('flash', messages);
      return String(arr || '');
    } else {
      $.jStorage.set('flash', {});
      return messages;
    }
  }
};
