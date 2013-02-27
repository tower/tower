var util = util = require('util');
// Note the last color used for logging. When we change colors
// we'll skip a line for clarity. Typically, you'd change colors
// to notify different things.
// XXX: Move this logging functionality inside a class
//      because were repeating ourselves within this file
//      and the sub-process.
last_color = [];
// A global log function with simple color support (you
// must still pass the ascii color codes in as an array or string)
module.exports = function(str, color) {
    // Again, always defining variables at the top so it's
    // extremely easy to find.
    var s;
    // If we haven't specified a color, use cyan.
    if(!color) color = '[36m';
    // String to use to combine the array of colors.
    s = "";
    if(color instanceof Array) {
        // Append the `s` string with the color escape code
        // as well as the color code itself.
        color.forEach(function(ascii) {
            s += "\033" + ascii;
        });
    } else {
        // It's just a string that was passed, not an array.
        s = "\033" + color;
    }
    // If our last color is NOT the same as our built-up string `s`
    // then skip a line (newline).
    if(last_color !== s) {
        util.print('\n');
        last_color = s;
    }
    // Final output. We use util.print because it's raw and doesn't
    // add newlines, which console.log does.
    util.print('\n       ::' + s + str + '\033[0m');
};