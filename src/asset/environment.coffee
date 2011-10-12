class Environment
  compress: (files) ->
    result = ''
    file.walkSync path, (dirPath, dirs, files) ->
      for file in files
        data = fs.readFileSync [dirPath, file].join("/"), 'utf8'
        result = result + data + '\n'
    result
  
  compressFiles: (files) ->
    result = ''
    for file in files
      data = fs.readFileSync file, 'utf8'
      result = result + data + '\n'
    result
exports = module.exports = Environment
