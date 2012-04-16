attr = Tower.Model.Attribute

describeWith = (store) ->
  describe "Testing Issue #92. (Tower.Store.#{store.name})", ->
    issue = null

    beforeEach ->
      issue = new App.Issue92()

    test 'test for changing boolean values', (done) ->
      assert.equal issue.get("enabled"), true

      issue.set "enabled", false
      assert.equal issue.get("enabled"), false

      issue.save =>
        App.Issue92.find issue.get("id"), (error, issue) =>
          assert.equal issue.get("enabled"), false

          issue.set "enabled", true
          assert.equal issue.get("enabled"), true

          issue.save =>
            App.Issue92.find issue.get("id"), (error, issue) =>
              assert.equal issue.get("enabled"), true

              done()

describeWith(Tower.Store.Memory)

if Tower.client
  describeWith(Tower.Store.Ajax)
else
  describeWith(Tower.Store.MongoDB)
