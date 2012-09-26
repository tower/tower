
Tower.SupportNumber = {
  isInt: function(n) {
    return n === +n && n === (n | 0);
  },
  isFloat: function(n) {
    return n === +n && n !== (n | 0);
  },
  randomSortOrder: function() {
    return Math.round(Math.random()) - 0.5;
  },
  randomIntBetween: function(min, max) {
    return min + Math.floor(Math.random() * ((max - min) + 1));
  }
};

module.exports = Tower.SupportNumber;
