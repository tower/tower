
Tower.Model.NestedAttributes = {
  ClassMethods: {
    acceptsNestedAttributesFor: function() {}
  },
  assignNestedAttributesForOneToOneAssociation: function(associationName, attributes, assignmentOpts) {
    if (assignmentOpts == null) assignmentOpts = {};
  },
  assignNestedAttributesForCollectionAssociation: function(associationName, attributesCollection, assignmentOpts) {
    if (assignmentOpts == null) assignmentOpts = {};
  }
};

module.exports = Tower.Model.NestedAttributes;
