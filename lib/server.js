;(function (root) {
    var Command = require('./command');

    // Create a new command instance:
    Command.create(process.argv);

})(global);