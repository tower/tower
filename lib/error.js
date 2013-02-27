Tower.Error = function(msg, code) {
    var self = this;
    //this.__proto__.message = 123;
    this.__defineSetter__("message", function(message) {
        self.__proto__.message = message;
    });

    this.__defineSetter__("code", function(c) {
        self.__proto__.code = c;
    });

    this.message = msg;
    this.code = code;
};

Tower.Error.prototype = new Error();
Tower.Error.prototype.constructor = Tower.Error;

