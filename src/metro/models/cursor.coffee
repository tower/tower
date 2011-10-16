# All finder methods return a Cursor, which optimizes traversal and query construction.
class Cursor
  clauses: []
  
  where: ->
    @clauses.push @clause("where", arguments...)
    @
    
  order: ->
    @
    
  limit: ->
    @
    
  select: ->
    @
    
  joins: ->
    @
      
  includes: ->
    @
    
  clause: (name) ->
    new Clause(name, arguments...)
    
exports = module.exports = Cursor
