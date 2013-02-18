(function() {

    function ready(comp, cb) {
        if(Tower._readyStorage == null) {
            Tower._readyStorage = {
                _readyStates: {},
                _waitingStates: []
            };
        }
        var self = Tower._readyStorage;
        // Setting:
        if(cb == null) {
            var component = comp;
            // Check if it's an array
            if(component instanceof Array) {
                for(var c in component) {
                    Process(component[c]);
                }
            } else {
                Process(component);
            }

            function Process(comp) {
                self._readyStates[comp] = true;
                /**
                 * Loop through the waiting list and check for any
                 * waiting for this particular state/component:
                 */
                for(var comp in self._waitingStates) {
                    var c = self._waitingStates[comp];
                    if(c.components) {
                        var _ready = true;
                        for(var i in c.components) {
                            if(!_ready) break;
                            // Look into the ready stated components:
                            if(self._readyStates[c.components[i]]) {
                                _ready = true;
                            } else {
                                _ready = false;

                            }
                        }
                    }

                    if(c.component) {
                        if(c.component === component) {
                            _ready = true;
                        } else {
                            continue;
                        }
                    }

                    if(_ready) {
                        c.cb.apply({});
                        delete self._waitingStates[comp];
                    }
                }

            }

        }

        /**
         * Check if `comp` is there, and if the callback
         * is indeed a function.
         */
        if(comp && typeof cb == "function") {
            // Set this to false automatically:
            var ready = false;
            // Check if the `comp` is an Array or not:
            if(comp instanceof Array) {
                // If it's an array
                // loop through it and call the normal method Process:
                //for(var c in comp) {
                // Process the singular component:
                //    Process(comp[c]);
                //}
                /**
                 * If an array is passed, that means all of the indices are required to be
                 * ready before the callback is called.
                 */
                var c, _c;
                for(c in comp) {
                    _c = comp[c];
                    if(self._readyStates[_c]) {
                        // It's ready!
                        delete comp[c];
                    }
                }

                if(comp.length >= 1) {
                    self._waitingStates.push({
                        components: comp,
                        cb: cb
                    })
                } else {
                    ready = true;
                }
            } else {
                /**
                 * Check the "readyStates" object for the particular component.
                 */
                if(self._readyStates[comp]) {
                    /**
                     * The currently requested state is ready:
                     */
                    ready = true;
                } else {
                    /**
                     * The currently requested state isn't ready yet.
                     * Let's add it to the waiting list and set "ready" to false:
                     */
                    self._waitingStates.push({
                        component: comp,
                        // (String)
                        cb: cb // Callback (Function)
                    });
                    // Were not ready yet.
                    ready = false;
                }
            }
            // Check if we were ready:
            if(ready) {
                // Run the callback:
                cb.apply({});
            }
        } // End of if;
    }

    Tower.ready = ready;

})();