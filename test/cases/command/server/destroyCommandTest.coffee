Tower.Command.load('generate')
Tower.Command.load('destroy')

describe "Tower.CommandDestroy", ->

  describe "tower delete generated model", ->
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