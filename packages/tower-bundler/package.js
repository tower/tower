Tower.Packager.create('tower-bundler')
    .namespace('Bundler')
    .server()
        .add('server.js')
        .deps(['tower-watch', 'tower-ready']);