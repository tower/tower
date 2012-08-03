attr = Tower.Model.Attribute

describe "Testing Issue #92.", ->
  issue = null

  beforeEach ->
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
