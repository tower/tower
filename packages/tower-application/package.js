Package.register(function(){
    var fs     = require('fs');
    // Add information to the package.
    this.info({
        name: "tower-application",
        description: "",
        version: "0.5.0",
        author: "Tower"
    });

    this.dependencies([]);

    this.addFiles(
        'server', 
        [
            'application.js',
            'assets.js',
            'errors.js',
            'platform.js'
        ], 
        'server'
    );

    this.addFiles(
        'client', 
        [
            'application.js'
        ], 
        'client'
    );

    this.addFiles(
        'shared', 
        [
            'engine.js',
            'hook.js',
            'locale/da.js',
            'locale/en.js',
            'locale/ptBr.js'
        ], 
        '*'
    )

    this.addFile('client.js', 'client');
    this.addFile('server.js', 'server');
    this.addFile('shared.js', '*');

    this.init(['server.js', 'client.js']);
});