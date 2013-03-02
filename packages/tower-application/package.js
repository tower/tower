Tower.Packager.create('tower-application')
    .namespace('Application')
    .server()
        .deps(['tower-router'])
        .add('server.js');