
Tower.View.EmberHelper = {
  hEach: function(string, block) {
    if (!_.isBlank(string)) {
      string = " " + string;
    }
    text("{{#each" + string + "}}");
    block();
    return text("{{/each}}");
  }
};

module.exports = Tower.View.HandlebarsHelper;
