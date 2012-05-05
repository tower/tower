var __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend(child);
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Mailer = (function(_super) {
  var Mailer;

  function Mailer() {
    return Mailer.__super__.constructor.apply(this, arguments);
  }

  Mailer = __extends(Mailer, _super);

  return Mailer;

})(Tower.Class);

require('./mailer/configuration');

require('./mailer/rendering');

Tower.Mailer.include(Tower.Mailer.Configuration);

Tower.Mailer.include(Tower.Mailer.Rendering);

module.exports = Tower.Mailer;
