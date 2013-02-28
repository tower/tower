var Criteria = require('./criteria');
var Lexer    = require('./lexer');


function TestCommand(argv) {
    this._packages = [];
    // Get all the loaded packages;
    this.getPackages();
    // Check if we grabbed the tower command
    if (argv[0] === "test" | "tests") {
        argv.splice(0, 1);
    }
    // We need to figure out which criteria
    // they specify: 'include' or 'exclude'.
    // If they specify both:
    //  include,.... exclude,....
    // The latter criteria will be marked as having
    // a higher priority and if there's a conflict
    //
    // include,package=['tower-cli']
    // exclude,package=['tower-cli']
    //
    // then we will disregard the first and use the
    // second.

    // Loop through the arguments. We need to
    // work with one at a time:
    var self = this;
    this.criteria = Criteria.create();
    /**var localCriteria = [];

    argv.forEach( function (command, gIndex) {
        // Now let's split by a delimeter: ","
        var split = command.split(',');
        if (split.length === 1) {
            console.log("Syntax Error: You provided an incomplete criteria.");
            process.exit();
        }

        localCriteria.push(['method', split[0], []]);

        if (split[1]) {
            localCriteria[gIndex][2].push(['type', split[1], []]);
        }

        // Loop through the split array;
        split.forEach( function (option, index) {
            if (!option) {
                console.log("Syntax Error: You provided an incomplete criteria.");
                process.exit();
            }
        });

    });

    console.log(localCriteria[1]);**/

    // Create a new Lexer:
    this.lexer = Lexer.create(argv);

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