var globsync = require('glob-whatev');
var output = "";

globsync.glob(process.argv[2]).forEach(function(filepath){
	output += " " + filepath;
});

console.log(output);