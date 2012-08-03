attr = Tower.Model.Attribute

describeWith = (store) ->
  describe "Testing Issue #92. (Tower.Store.#{store.className()})", ->
    issue = null

    beforeEach ->
      App.Issue92.store(store)
      issue = App.Issue92.build()

    test 'test for changing boolean values', (done) ->
      assert.equal issue.get("enabled"), true, 'should be true 1'

      issue.set "enabled", false
      assert.equal issue.get("enabled"), false, 'should be false 2'

      issue.save =>
        App.Issue92.find issue.get("id"), (error, issue) =>
          assert.equal issue.get("enabled"), false, 'should be false 3'

          issue.set "enabled", true
          assert.equal issue.get("enabled"), true, 'should be true 4'

          # console.log issue.get('data')

          issue.save =>
            App.Issue92.find issue.get("id"), (error, issue) =>
              assert.equal issue.get("enabled"), true, 'should be true 5'

              done()

describeWith(Tower.Store.Memory)

if Tower.client
  describeWith(Tower.Store.Ajax)
else
  describeWith(Tower.Store.Mongodb)