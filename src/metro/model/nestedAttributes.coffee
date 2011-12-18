Metro.Model.NestedAttributes = 
  ClassMethods:
    acceptsNestedAttributesFor: ->
  
  # Assigns the given attributes to the association.
  #
  # If updateOnly is false and the given attributes include an <tt>:id</tt>
  # that matches the existing record's id, then the existing record will be
  # modified. If updateOnly is true, a new record is only created when no
  # object exists. Otherwise a new record will be built.
  #
  # If the given attributes include a matching <tt>:id</tt> attribute, or
  # updateOnly is true, and a <tt>:_destroy</tt> key set to a truthy value,
  # then the existing record will be marked for destruction.
  assignNestedAttributesForOneToOneAssociation: (associationName, attributes, assignmentOpts = {}) ->
    
  # Assigns the given attributes to the collection association.
  #
  # Hashes with an <tt>:id</tt> value matching an existing associated record
  # will update that record. Hashes without an <tt>:id</tt> value will build
  # a new record for the association. Hashes with a matching <tt>:id</tt>
  # value and a <tt>:_destroy</tt> key set to a truthy value will mark the
  # matched record for destruction.
  #
  # For example:
  #
  #   assignNestedAttributesForCollectionAssociation(:people, {
  #     '1' => { :id => '1', :name => 'Peter' },
  #     '2' => { :name => 'John' },
  #     '3' => { :id => '2', :_destroy => true }
  #   })
  #
  # Will update the name of the Person with ID 1, build a new associated
  # person with the name `John', and mark the associated Person with ID 2
  # for destruction.
  #
  # Also accepts an Array of attribute hashes:
  #
  #   assignNestedAttributesForCollectionAssociation(:people, [
  #     { :id => '1', :name => 'Peter' },
  #     { :name => 'John' },
  #     { :id => '2', :_destroy => true }
  #   ])
  assignNestedAttributesForCollectionAssociation: (associationName, attributesCollection, assignmentOpts = {}) ->
    
      
module.exports = Metro.Model.NestedAttributes
