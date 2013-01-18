(function(){
	var self = this;
	var Package  = new(require('./package')),
		Packages = new(require('./packages')),
		Bundler  = new(require('./bundler'));

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
			self.Package 	= new Package();
			self.Packages 	= new Packages();
			self.Bundler 	= new Bundler();
		}

		return Envelope; 

	})();
	
	module.exports = Envelope;

})();

