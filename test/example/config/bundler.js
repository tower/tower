/**
 * Configure Tower.Bundler. Any missing configuration values
 * will be set by the defaults.
 *
 * Any value may be a string, function or litteral value.
 * Tower will detect the type and use it accordingly.
 */
Tower.Bundler.config( function () {
	// Choose what compilation type you want for all the JavaScript:
	//
	// The choices are the following: 
	// 'loose'  -> CommonJS Style (Medium Compilation)
	// 'hybrid' -> AMD/CommonJS hybrid (Minimal Compilation)
	// 'string' -> CommonJS string-based loader (Maximum Compilation)
	//
	// 'string' compilation is more for production use, as it's quite useless
	// in development where speed isn't as important. 
	this.javascript.compiler.type('loose');

	// Choose what CSS compilation/asset you want to use:
	//
	// The choices are the following:
	// 'singular' -> CSS files are served independantly. This makes things
	// 				 slightly faster, but makes pre-processors difficult to 
	//				 use, especially the @import statements.
	//
	// 'bundled'  -> CSS files are served together into a package. This
	// 				 makes it easy to use pre-processors and their @importing
	// 				 ability. Creating a single CSS file to be served.
	this.css.compiler.type('bundled');

	// Define what paths we should for your assets. By default, we look
	// at every package, 'vendor', and 'public' directory. 
	// XXX: the vendor directory isn't watched by Tower.watch, and thus
	// requires a server restart if anything changes within it. 
	// The public directory and all packages are watched all the time. 
	// XXX: Directories start at your app's base path.
	this.assets.directories([
		'vendor',
		'public'
	]);

	// Define what output your assets will be in (type wise).
	// 
	// Here are the following choices:
	// 'normal' -> File based solution. 
	// 'inline' -> All your JavaScript, CSS, images, and fonts will be inlined
	// 			   in your html pages. This ensures that processing is as fast
	// 			   as possible. This is especially useful in development, but 
	// 			   it's just as useful in production. 
	//			   The only downside is the lack of caching ability on the
	//			   independent resources. 
	// XXX: public is the ONLY place where resources are served from. Anything
	// 		within the packages or vendor folders are copied to the public
	//      directory. This makes it easier to use a third-party static file server
	// 		like NGINX.
	this.output.type('inline');



});