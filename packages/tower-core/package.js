Package.register(function(){

    this.info({
        name: 'tower-core',
        description: 'Main initialization package. Responsible for the startup phase.',
        version: '0.5.0',
        author: 'Tower'
    });

    this.addFile('server.js', 'server');
    this.addFile('client.js', 'client');

    this.init(['server.js']);
});