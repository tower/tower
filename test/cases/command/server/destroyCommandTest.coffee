Tower.Command.load('generate')
Tower.Command.load('destroy')

describe "Tower.CommandDestroy", ->

  describe "generated model", ->
    before ->
      genArgs = ["node", "tower", "generate", "model", "bird"]
      genBirdCommand = new Tower.CommandGenerate(genArgs)
      genBirdCommand.run()
      genArgs[4] = "monkey"
      genMonkeyCommand = new Tower.CommandGenerate(genArgs)
      genMonkeyCommand.run()

      destroyCommand = new Tower.CommandDestroy(["node", "tower", "destroy", "model", "bird"])
      destroyCommand.run()

    after ->
      destroyMonkeyCommand = new Tower.CommandDestroy(["node", "tower", "destroy", "model", "monkey"])
      destroyMonkeyCommand.run()

    test "should delete app/models/shared/(modelName).coffee", ->
      assert.isFalse Tower.existsSync("#{Tower.root}/app/models/shared/bird.coffee")

    test "should delete test/factories/(modelName)Factory.coffee", ->
      assert.isFalse Tower.existsSync("#{Tower.root}/test/factories/birdFactory.coffee")

    test "should delete test/cases/models/shared/(modelName)Test.coffee", ->
      assert.isFalse Tower.existsSync("#{Tower.root}/test/cases/models/shared/birdTest.coffee")

    test "should remove correct bootstrap dataset in app/controllers/server/applicationController.coffee", ->

      content = Tower.readFileSync("#{Tower.root}/app/controllers/server/applicationController.coffee").toString()

      # bootstrap into server side
      namespace = Tower.namespace()
      className = 'Bird'
      namePlural = 'birds'

      birdRe = ///\s*\(next\)\s*=>\s*#{namespace}\.#{className}\.all\s*\(error,\s*#{namePlural}\)\s*=>\s*data\.#{namePlural}\s*=\s*#{namePlural}\s*next\(\)///g

      className = 'Monkey'
      namePlural = 'monkeys'
      monkeyRe = ///\s*\(next\)\s*=>\s*#{namespace}\.#{className}\.all\s*\(error,\s*#{namePlural}\)\s*=>\s*data\.#{namePlural}\s*=\s*#{namePlural}\s*next\(\)///g

      assert.notMatch content, birdRe, "bootstrap string not removed"
      assert.match content, monkeyRe, "other bootstrap was removed"

    test "should remove correct assets in app/config/server/assets.coffee", ->
      modelName = "bird"
      assetRefs = [
        ///\s*#?\s*\'app/models/shared/#{modelName}\'///g
        ///\s*#?\s*\'/test/cases/models/shared/#{modelName}Test\'///g
      ]

      content = Tower.readFileSync("#{Tower.root}/app/config/server/assets.coffee").toString()

      assert.notMatch content, assetRefs[0], "shared model was not removed"
      assert.notMatch content, assetRefs[1], "shared test model was not removed"

    test "should remove correct bootstrap in app/config/client/bootstrap.coffee", ->
      modelName = 'bird'
      className = 'Bird'
      namePlural = 'birds'

      bootstrapRe = ///\s*#?\s*App\.#{className}\.load\(data\.#{namePlural}\)\sif\sdata\.#{namePlural}///g

      content = Tower.readFileSync("#{Tower.root}/app/config/client/bootstrap.coffee").toString()

      assert.notMatch content, bootstrapRe, "bootstrap was not removed"

    test "should remove seeds in data/seeds.coffee", ->
      modelName = 'bird'
      className = 'Bird'
      namePlural = 'birds'

      seedRe = ///\s*#?\s*\(callback\)\s*=>\s*_\(\d*\)\.timesAsync\s*callback,\s*\(next\)\s*=>\s*Tower\.Factory\.create\s*\'#{modelName}\',\s*\(error,\s*record\)\s*=>\s*console\.log\s*_\.stringify\(record\)\s*next\(\)///g

      content = Tower.readFileSync("#{Tower.root}/data/seeds.coffee").toString()

      assert.notMatch content, seedRe, "seed was not removed"

  describe "generated controller", ->
    modelName = 'tank'
    className = 'Tank'
    namePlural = 'tanks'
    before ->
      genArgs = ["node", "tower", "generate", "model", "tank"]
      genCommand = new Tower.CommandGenerate(genArgs)
      genCommand.run()
      genArgs[3] = "controller"
      genCtrlCommand = new Tower.CommandGenerate(genArgs)
      genCtrlCommand.run()

      destroyCommand = new Tower.CommandDestroy(["node", "tower", "destroy", "controller", "tank"])
      destroyCommand.run()

    test "should delete app/controllers/server/(controllerName).coffee", ->
      assert.isFalse Tower.existsSync("#{Tower.root}/app/controllers/server/tanksController.coffee")

    test "should delete app/controllers/client/(controllerName).coffee", ->
      assert.isFalse Tower.existsSync("#{Tower.root}/app/controllers/client/tanksController.coffee")

    test "should delete test/cases/controllers/server/(controllerName)Test.coffee", ->
      assert.isFalse Tower.existsSync("#{Tower.root}/test/cases/controllers/server/tanksControllerTest.coffee")

    test "should remove correct route in app/config/shared/routes.coffee", ->
      routeRe = ///\s*#?\s*@resources\s*\'tanks\'///g

      content = Tower.readFileSync("#{Tower.root}/app/config/shared/routes.coffee").toString()

      assert.notMatch content, routeRe, "route was not removed"

    test "should remove correct nav link in app/templates/shared/layout/_navigation.coffee", ->
      navRe = ///\s*#?\s*li\s*\'\{\{bindAttr\s*class=\"App\.TankController[\s\S]*?tanks\'\)///g

      content = Tower.readFileSync("#{Tower.root}/app/templates/shared/layout/_navigation.coffee").toString()
      assert.notMatch content, navRe, "navigation link was not removed"

    test "should remove correct translation in app/config/shared/locales/en.coffee", ->
      translationRe = ///\s*#?\s*tanks:\s*\"Tanks\"///g

      content = Tower.readFileSync("#{Tower.root}/app/config/shared/locales/en.coffee").toString()
      assert.notMatch content, translationRe, "english translation was not removed"

    test "should remove correct assets in app/config/server/assets.coffee", ->
      assetRe = ///\s*#?\s*\'/app/controllers/client/tanksController\'///g

      content = Tower.readFileSync("#{Tower.root}/app/config/server/assets.coffee").toString()

      assert.notMatch content, assetRe, "assets was not removed"

  describe "generated view", ->
    before ->
      genArgs = ["node", "tower", "generate", "view", "boat"]
      genCommand = new Tower.CommandGenerate(genArgs)
      genCommand.run()

      destroyCommand = new Tower.CommandDestroy(["node", "tower", "destroy", "view", "boat"])
      destroyCommand.run()

    test "should delete directory app/views/client/(pluralViewName)", ->
      assert.isFalse Tower.existsSync("#{Tower.root}/app/views/client/boats")

    test "should remove correct assets in app/config/server/assets.coffee", ->
      assetRe = ///\s*#?\s*\'/app/views/client/boats.*///g

      content = Tower.readFileSync("#{Tower.root}/app/config/server/assets.coffee").toString()

      assert.notMatch content, assetRe, "assets was not removed"

  describe "generated template", ->
    before ->
      genArgs = ["node", "tower", "generate", "template", "cow"]
      genCommand = new Tower.CommandGenerate(genArgs)
      genCommand.run()

      destroyCommand = new Tower.CommandDestroy(["node", "tower", "destroy", "template", "cow"])
      destroyCommand.run()

    test "should delete directory app/templates/shared/(templateName)", ->
      assert.isFalse Tower.existsSync("#{Tower.root}/app/templates/shared/cows")

  describe "generated helper", ->
    before ->
      genArgs = ["node", "tower", "generate", "helper", "bar"]
      genCommand = new Tower.CommandGenerate(genArgs)
      genCommand.run()

      destroyCommand = new Tower.CommandDestroy(["node", "tower", "destroy", "helper", "bar"])
      destroyCommand.run()

    test "should delete app/helpers/(helperName).coffee", ->
      assert.isFalse Tower.existsSync("#{Tower.root}/app/helpers/barHelper.coffee")