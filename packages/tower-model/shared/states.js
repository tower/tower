var _;

_ = Tower._;

Tower.ModelStates = {
  isLoaded: false,
  isDirty: false,
  isSaving: false,
  isDeleted: false,
  isError: false,
  isNew: true,
  isValid: true,
  isSyncing: false,
  isMarkedForDestruction: false
};

module.exports = Tower.ModelStates;
