Package.register(function(){
    var coffee = require('coffee-script');
    var fs     = require('fs');

    // Add information to the package.
    this.info({
        name: "coffee-script",
        description: "Adds coffee-script support.",
        version: "0.0.1",
        author: "Daniel Fagnan"
    });

    this.dependencies([]);

    this.registerExtension("coffee", function(source_path, serve_path, type){
        var contents = fs.readFileSync(source_path, 'utf-8');
        var options  = {bare: true, filename: source_path};
        try {
            contents = coffee.compile(contents, options);
        } catch(e) {
            return this.error(e.message);
        }

        contents = new Buffer(contents);
        this.addResource({
            extension: 'js',
            path: serve_path,
            data: contents,
            type: type
        });
    });

});