Tower.Packager.create('tower-bundler')
    .server()
        .add('server.js')
        .deps(['tower-watch', 'tower-ready']);