/**
 * Ready Class. This class keeps track of systems that rely
 * on other systems, and systems that trigger as "Ready".
 * The syntax is similar to JQuery's "ready()" method which accepts
 * a closure. 
 *
 * To rely on other systems (when they start after the relying system) you 
 * pass a closure. To signal a ready system, you pass a string (name) instead.
 *
 * USAGE: 
 *
 * Ready(['controllers', 'arrays', 'net', 'generator', 'application'], function(){
 *      // Do something here....
 * });
 *
 * Ready('controller', true);
 * 
 * @param {string/array}   name Name of the ready system.
 * @param {function/boolean} cb Callback
 */
function Ready(name, cb) {

    if (!name) {
        cb = name;
        name = null;
    }

    /**
     * Check if the `name` parameter is a string or an array:
     */
    if (name instanceof Array) {
        /**
         * Is Array:
         */
        for (var comp in name) {
            this.processState(comp);
        }
        /**
         * Loop through the array and pass it to the string method.
         */
    } else {
        /**
         * Is String:
         */
        this.processState(name);
    }

};


Ready.prototype.processState = function(name) {



};

module.exports = Ready;