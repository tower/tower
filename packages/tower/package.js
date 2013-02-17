Tower.Package.register(function(){

    this.info({
        name: 'tower',
        description: 'Main initialization package. Responsible for the startup phase.',
        version: '0.5.0',
        author: 'Tower'
    });

    this.registerExtension("js", function(source_path, serve_path, type){
        this.addResource({
            extension: 'js',
            path: serve_path,
            source: source_path,
            type: type
        });
    });

    this.addFile('server.js', 'server');
    this.addFile('client.js', 'client');

    this.init(['server.js']);
});