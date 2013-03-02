var glob = require('glob'), path = require('path'), fs = require('fs');

// Take the copied directories and find all the javascript files.
glob('.tower/.tmp/**/*.js', {
    cwd: process.argv[2]
}, function (err, files) {
    // files is an array of filenames.
    // If the `nonull` option is set, and nothing
    // was found, then files is ["**/*.js"]
    // er is an error object or null.
    if (err) throw new Error(err);

    var outputFile = path.join(process.argv[2], '.tower', 'app.js');
    console.log(process.argv[3]);
    var template = path.join(process.argv[3], 'packages', 'tower-bundler', 'generators', 'template.js');
    // Clear it;
    // Read the template file:
    fs.readFile(template, 'utf8', function (err, templ) {
        if (err) throw new Error(err);

        fs.writeFile(outputFile, templ, 'utf8', function (err) {
            if (err) throw new Error(err);

            files.forEach(function (file) {
                console.log(file);
            });

        });
    });

})