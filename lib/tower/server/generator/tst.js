var fs, path;

fs = require('fs');

path = require('path');

assert.file = function(path, arg) {
  var content;
  assert.ok(path.existsSync(path), "" + path + " exists");
  assert.ok(!fs.statSync(path).isDirectory(), "" + path + " is file");
  if (!arg) return;
  content = fs.readFileSync(path, "utf-8");
  switch (_.kind(arg)) {
    case "regex":
      return assert.match(content, arg);
    default:
      return arg.call(this, content);
  }
};
