class <%= controller.namespace %>.<%= controller.className %> extends Tower.Controller
  @on 'click .<%= model.name %> a[data-method="delete"]', 'destroy', id: true

  collection: <%= app.namespace %>.<%= model.className %>.all().publish()
