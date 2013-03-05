/**
 * Command Class.
 * Initializes a new command and includes the
 * appropriate module specific to the command.
 *
 * @class Command
 * @param {Array} args
 */

function Command() {
    arguments = arguments[0];

    // Now process the command.
    var command = arguments[2] || 'server';
    // Try to include the appropriate command's file:
    try {
        require('./commands/' + command + '.js')(command, arguments.splice(3));
    } catch (e) {
        if (e.code != 'MODULE_NOT_FOUND') {
            throw e;
        } else {
            console.log("Command [" + command + "] was not found.");
        }
        process.exit();
    } finally {

    }
}


// Export the Command class:
// @class Command
module.exports = Command;