# @todo
# http://docs.neo4j.org/chunked/stable/security-server.html
# http://sujitpal.blogspot.com/2009/05/using-neo4j-to-load-and-query-owl.html
Tower.Store.Neo4j.Serialization =
  # @example conditions (http://docs.neo4j.org/chunked/stable/query-where.html)
  #   START n=node(3, 1)
  #   WHERE (n.age < 30 and n.name = "Tobias") or not(n.name = "Tobias")
  #   RETURN n
  # 
  #   START n=node(3, 1)
  #   WHERE n.name =~ /(?i)ANDR.*/
  #   RETURN n
  # 
  # @example select fields (http://docs.neo4j.org/chunked/stable/query-return.html)
  #   START a=node(1)
  #   RETURN a.age AS SomethingTotallyDifferent
  # 
  # @example order (http://docs.neo4j.org/chunked/stable/query-order.html)
  #   START n=node(3,1,2)
  #   RETURN n
  #   ORDER BY n.name
  # 
  # @example skip, limit, pagination (http://docs.neo4j.org/chunked/stable/query-skip.html)
  #   START n=node(3, 4, 5, 1, 2)
  #   RETURN n
  #   ORDER BY n.name
  #   SKIP 1
  #   LIMIT 2
  serializeToCypher: (criteria) ->
    conditions = criteria.conditions()

module.exports = Tower.Store.Neo4j.Serialization
