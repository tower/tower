###

require '../../config'

describe 'Tower.Model.Finders', ->
  test 'exists', ->
    Topic.exists 1, (error, result) -> expect(result).toEqual true
    Topic.exists "1", (error, result) -> expect(result).toEqual true
    Topic.exists authorName: "David", (error, result) -> expect(result).toEqual true
    Topic.exists authorName: "Mary", approved: true, (error, result) -> expect(result).toEqual true
    Topic.exists 45, (error, result) -> expect(result).toEqual false
    Topic.exists (error, result) -> expect(result).toEqual true
    Topic.exists null, (error, result) -> expect(result).toEqual false
###