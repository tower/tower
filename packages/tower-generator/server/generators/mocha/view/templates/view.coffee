require "../config"

get     = Tower.get
urlFor  = Tower.urlFor

describe "Experience", ->
  before (done) -> $(done)

  describe "#navigation", ->
    test "link to home", ->
      assert.equal $("#navigation .root").text().trim(), "My Site"