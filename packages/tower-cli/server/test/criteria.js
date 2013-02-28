function Criteria() {
  this._criterias = [];
  this.packages = [];
  this.files = [];

}


Criteria.prototype.method = function(method) {

};

Criteria.create = function() {
  return new Criteria(arguments);
};

Criteria.prototype.getPackages = function() {
  // If we haven't specified an include criteria then we start with
  // all of them.
  if (this.include.length === 0) {
    this.packages = packageNames;
  } else {
    this.packages = this.include;
  }

  this.exclude.forEach(function(arr) {
    // arr === ['search', 'value']
    // e.g === ['package', 'string']
    // e.g === ['package', /regex/]
    switch (arr[0]) {
      case "package":

        break;
      case "filename":
        // Get all the packages included, and get all the file names:
        console.log(Tower.Packager.get(this.packages));
        break;
      case "group":
        throw new Error("Not yet implemented.");
        break;
      case "test":
        throw new Error("Not yet implemented.");
        break;

    }
  });

}

module.exports = Criteria;