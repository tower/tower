(function(){
    var self = this,
        _        = require('underscore');

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    _.regexpEscape = function(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    var Envelope = (function(){
        
        function Envelope (config) {
            this.config = config;

            /**
             * Start the packages class:
             */
            require('./bundler');
            require('./package');
            require('./packages');
            
            self.Bundler = new Bundler();
            self.Packages = new Packages();

            Packages.ready('__packages_loaded__', function(){
                
                
                
            });

        }

        return Envelope; 

    })();
    
    module.exports = Envelope;

})();

