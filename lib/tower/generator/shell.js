
Tower.Generator.Shell = {
  sayStatus: function(status, color) {
    if (this.options.verbose) return _console.log(status);
  }
};

module.exports = Tower.Generator.Shell;
