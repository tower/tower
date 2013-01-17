(function(){

	var Package  = require('./package'),
		Packages = require('./packages'),
		Bundler  = require('./bundler');

	var Envelope = (function(){
		
		function Envelope (config) {
			this.config = config;
		}

		return Envelope; 

	})();
	
	module.exports = Envelope;

})();

