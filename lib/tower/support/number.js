
Tower.Support.Number = {
  isInt: function(n) {
    return n === +n && n === (n | 0);
  },
  isFloat: function(n) {
    return n === +n && n !== (n | 0);
  }
};

module.exports = Tower.Support.Number;
