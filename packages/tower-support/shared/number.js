
Tower._.mixin({
  isInt: function(n) {
    return n === +n && n === (n | 0);
  },
  toInt: function(object) {
    switch (_.kind(object)) {
      case 'date':
        return object.getTime();
      default:
        return parseInt(object);
    }
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
});
