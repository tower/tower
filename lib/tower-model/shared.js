
require('./shared/model');

require('./shared/scope');

require('./shared/massAssignment');

require('./shared/authentication');

require('./shared/cursor');

require('./shared/dirty');

require('./shared/indexing');

require('./shared/inheritance');

require('./shared/metadata');

require('./shared/relation');

require('./shared/relations');

require('./shared/attachment');

require('./shared/attribute');

require('./shared/attributes');

require('./shared/nestedAttributes');

require('./shared/autosaveAssociation');

require('./shared/persistence');

require('./shared/scopes');

require('./shared/serialization');

require('./shared/states');

require('./shared/validator');

require('./shared/validations');

require('./shared/timestamp');

require('./shared/transactions');

require('./shared/operations');

require('./shared/hierarchical');

require('./shared/ability');

require('./shared/locale/en');

Tower.Model.include(Tower.SupportCallbacks);

Tower.Model.include(Tower.ModelMetadata);

Tower.Model.include(Tower.ModelDirty);

Tower.Model.include(Tower.ModelIndexing);

Tower.Model.include(Tower.ModelAuthentication);

Tower.Model.include(Tower.ModelMassAssignment);

Tower.Model.include(Tower.ModelScopes);

Tower.Model.include(Tower.ModelPersistence);

Tower.Model.include(Tower.ModelInheritance);

Tower.Model.include(Tower.ModelSerialization);

Tower.Model.include(Tower.ModelStates);

Tower.Model.include(Tower.ModelRelations);

Tower.Model.include(Tower.ModelValidations);

Tower.Model.include(Tower.ModelAttachment);

Tower.Model.include(Tower.ModelAttributes);

Tower.Model.include(Tower.ModelNestedAttributes);

Tower.Model.include(Tower.ModelAutosaveAssociation);

Tower.Model.include(Tower.ModelTimestamp);

Tower.Model.include(Tower.ModelHierarchical);

Tower.Model.include(Tower.ModelOperations);

Tower.Model.include(Tower.ModelTransactions);

Tower.Model.field('id', {
  type: 'Id'
});

Tower.Model["protected"]('id');
