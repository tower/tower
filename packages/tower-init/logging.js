global.log = function() {

    var package = Tower.getPackageFromStack();
    if (!package) {
        console.log(package);
    }
    var info = "[".green + package.name.bold + ":" + Tower.getLineNumber().blue + "] : ".green;
    arguments[0] = info + arguments[0];
    console.log.apply({}, arguments);
};
