;( function(root) {

    function Command(args) {
        this.arguments = args;

        // Now process the command.
        this.command = this.arguments[2] || 'server';
        // Try to include the appropriate command's file:
        try {
            require('./commands/' + this.command + '.js')(this.command, this.arguments.splice(3));
        } catch (e) {
            if (e.code != 'MODULE_NOT_FOUND') {
                throw e;
            } else {
                console.log("Command was not found.");
            }
            process.exit();
        } finally {

        }

    }

    Command.create = function(args) {
        return new Command(args);
    };

    module.exports = Command;

})(global);