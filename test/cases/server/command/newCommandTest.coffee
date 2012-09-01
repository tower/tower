command = ->
  defaultArgs = ['node', 'tower', 'new', 'blog']
  (new Tower.CommandNew(defaultArgs.concat(_.args(arguments)))).program

describe 'Tower.CommandNew', ->
  describe 'tower new blog', ->
    test 'default', ->
      assert.equal command().namespace, 'App'
      
    test '-n, --namespace', ->
      assert.equal command('-n', 'Blog').namespace, 'Blog'
      assert.equal command('--namespace', 'Blog').namespace, 'Blog'
    
    test '--template', ->
      template = 'http://raw.github.com/viatropos/tower-generators/tree/master/lib/default.js'
      
      assert.equal command('--template', template).template, template
    
    test '--skip-procfile', ->
      assert.isFalse command().skipProcfile
      assert.isTrue command('--skip-procfile').skipProcfile
      
    test '--skip-git', ->
      assert.isFalse command().skipGit
      assert.isTrue command('--skip-git').skipGit
      
    test '--skip-assets', ->
      assert.isFalse command().skipAssets
      assert.isTrue command('--skip-assets').skipAssets
      
    test '-T, --title', ->
      assert.equal command().title, undefined
      assert.equal command('-T', 'My Blog').title, 'My Blog'
      
    test '-D, --description', ->
      assert.equal command().description, ''
      assert.equal command('-D', 'A description').description, 'A description'
      
    test '-K, --keywords', ->
      assert.equal command().keywords, ''
      assert.equal command('-K', 'ruby, javascript').keywords, 'ruby, javascript'
      
    test '-p, --persistence', ->
      assert.deepEqual command().persistence, ['mongodb']
      assert.deepEqual command('--persistence', 'mongodb redis').persistence, ['mongodb', 'redis']
      assert.deepEqual command('--persistence', 'mongodb, redis').persistence, ['mongodb', 'redis']
      
    test '-e, --engine', ->
      assert.equal command().engine, 'coffee'
      assert.equal command().templateEngine, 'coffee'
      assert.equal command('--engine', 'ejs').engine, 'ejs'

    test '-s, --stylesheet-engine', ->
      assert.deepEqual command().stylesheetEngine, 'styl'
      assert.deepEqual command('--stylesheet-engine', 'css').stylesheetEngine, 'css'
      
    test '--include-stylesheets', ->
      assert.deepEqual command().includeStylesheets, ['twitter-bootstrap']
      assert.deepEqual command('--include-stylesheets', 'twitter-bootstrap compass').includeStylesheets, ['twitter-bootstrap', 'compass']
      
    test '-t, --test', ->
      assert.equal command().test, 'mocha'
      assert.equal command('--test', 'jasmine').test, 'jasmine'
      
    test '-d, --deployment', ->
      assert.deepEqual command().deployment, ['heroku']
      assert.deepEqual command('--deployment', 'nodejitsu heroku').deployment, ['nodejitsu', 'heroku']
      
    test '-w, --worker', ->
      assert.deepEqual command().worker, 'kue'
      assert.deepEqual command('--worker', 'coffee-resque').worker, 'coffee-resque'

    test '-j, --use-javascript', ->
      assert.isFalse command().useJavascript
      assert.equal command().scriptType, 'coffee'
      assert.isTrue command('--use-javascript').useJavascript
      assert.equal command('--use-javascript').scriptType, 'js'