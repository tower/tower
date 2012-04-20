var fs, path;

fs = require('fs');

path = require('path');

assert.file = function(path, arg) {
  var content, stat;
  try {
    stat = fs.statSync(path);
    assert.ok(stat, "" + path + " exists");
    assert.ok(!stat.isDirectory(), "" + path + " is file");
  } catch (error) {
    assert.ok(false, "" + path + " exists");
    if (typeof arg === "function") arg();
    return;
  }
  if (!arg) return;
  content = fs.readFileSync(path, "utf-8");
  switch (_.kind(arg)) {
    case "regex":
      return assert.match(content, arg);
    default:
      return arg.call(this, content);
  }
};
