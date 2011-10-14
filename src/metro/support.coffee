Metro =
  #Watcher: require('./support/watcher')
  Support:
    Class: require('./support/class')
  
  ###
  Metro.watch "./assets/javascripts", -> Metro.Asset.compile()
    
  Metro.watch "./app/models", (path) -> Metro.Spec.run(path)
  ###
  watch: (paths, callback) ->
    paths = Array(paths)
    

exports = module.exports = Metro
