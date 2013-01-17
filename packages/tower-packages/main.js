require('./bundler');

Bundler.run(function(){
	require('./package');
	require('./packages');
});

