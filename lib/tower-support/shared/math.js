
_.sum = function(array) {
  if (!_.isArray(array) || array.length === 0) {
    return 0;
  }
  return _.reduce(array, function(sum, n) {
    return sum += n;
  });
};

_.isNonZero;
