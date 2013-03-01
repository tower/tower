Tower.Packager.create('tower-application')
    .server()
        .deps(['tower-router'])
        .add('server.js');