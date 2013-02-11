Tower.Application.config( function () {

	// All the express stuff:
	configure(function () {
		//use();
		//use();
		//use();
		//...
	});

	// Define what autoloading paths you want:
	// 
	// XXX: By default, these are the basic paths that are loaded:
	// 	'app/controllers/**/*'
	//  'app/models/**/*'
	//  'app/views/**/*'
	//  'app/templates/**/*'
	//  'app/helpers/**/*'
	//	'config/**/*'
	//	'packages/**/*'
	//  These are not listed in any particular order.
	paths.autoload([
		'exampleFolder/**/*'
	]);



});