# You want to compile the cursor so it knows
# what fields it's watching up front, and doesn't have to compute that
# every time. You also don't want to compute the conditions every time.
# But, some conditions have dynamic values (closures), so need to consider those.
Tower.Model.Cursor.Observable = Ember.Mixin.create
  # Paths to the fields it's observing
  fieldNames: Ember.computed(->
    _.keys(@conditions())
  ).cacheable()

