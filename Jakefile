var fs = require('fs'),
    path = require('path');

task('default', function(){
    jake.logger.log('Please specify a task.');
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

namespace('install', function(){

    var msg = task('message', function(){
        var Install = require('./' + path.join('bin', 'install'));
        new Install().run('message');
    }, {});

    task('dependencies', function(){
        var Install = require('./' + path.join('bin', 'install'));
        var deps = new Install().run('dependencies').join(' ');
        jake.logger.log('Installing dependencies... (This may take some time)');
        jake.exec('npm install ' + deps, function(err, stdout, stderr){
            if (err || stderr) {
                jake.logger.log(err || stderr);
            } else {
                jake.logger.log('Successfully installed dependencies.');
                msg.run();
            }
        }, {});
    });

    task('post', ['install:dependencies']);
});

namespace('test', function(){

    task('server', function(){

    });

    task('client', function(){

    });

    task('memory', function(){

    });

    task('mongodb', function(){

    });

});

task('test', function(){
    console.log("Test");
});

task('push', function(){
    
});