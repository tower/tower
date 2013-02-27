function TestCommand(argv) {
    this._packages = [];
}

TestCommand.prototype.getPackages = function() {
    var packages = Tower.Packager.all();
    var packageNames = [];
    // Get all the loaded packages;
    for (var key in packages) {
      if (packages.hasOwnProperty(key)) {
        packageNames.push(packages[key].name);
      }
    }

    this._packages = packageNames;
};

TestCommand.create = function(argv) {
    return new TestCommand(argv);
};

module.exports = TestCommand;