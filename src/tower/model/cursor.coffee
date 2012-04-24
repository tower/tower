# This class has plenty of room for optimization,
# but it's now into a form I'm starting to like.
# May rename this to Tower.Model.Cursor

class Tower.Model.Cursor extends Tower.Collection
  defaultLimit: 20
  
  init: (options = {}) ->
    @initialize options
    
  pushMatching: (records) ->
    matching = Tower.Store.Operators.select(records, @conditions())
    
    @pushObjects(matching)
      
    matching
    
  pullMatching: (records) ->
    matching = Tower.Store.Operators.select(records, @conditions())
    
    @pullObjects(matching)
    
    matching
    
require './cursor/finders'
require './cursor/operations'
require './cursor/persistence'
require './cursor/serialization'

Tower.Model.Cursor.include Tower.Model.Cursor.Finders
Tower.Model.Cursor.include Tower.Model.Cursor.Operations
Tower.Model.Cursor.include Tower.Model.Cursor.Persistence
Tower.Model.Cursor.include Tower.Model.Cursor.Serialization

module.exports = Tower.Model.Cursor
