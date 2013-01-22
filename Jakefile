var fs = require('fs'),
    path = require('path');

namespace('test', function(){
    task('run', function(){
        jake.logger.log('Running Tests...');
    });
});


task('test', ['test:run']);
task('default', function(){
    jake.logger.log('Default');
});

task('watch-more', function(){
    if (process.platform == 'win32') {
        jake.logger.log('This command is unsupported on Windows. Exiting...');
        return;
    }
    jake.exec(['ulimit', '-n', '65536'], function () {
      jake.logger.log('Increased limit to 65536.');
    });
});

task('install-dependencies', function(){
    var Install = require('./' + path.join('bin', 'install'));
    var deps = new Install().run('dependencies').join(' ');
    jake.exec('npm install ' + deps, function(){
        jake.logger.log('Successfully installed dependencies.');
    }, {stdout: true,stderr:true });
});