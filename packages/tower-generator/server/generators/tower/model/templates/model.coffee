class <%= app.namespace %>.<%= model.className %> extends Tower.Model<% if (model.attributes.length) { %><% for (var i = 0; i < model.attributes.length; i++) { %>
  @field '<%= model.attributes[i].name %>', type: '<%= model.attributes[i].type %>'<% if (_.isPresent(model.attributes[i].options)) { %>, <%= printCoffeeOptions(model.attributes[i].options) %><% } %><% } %>
<% } -%><% if (model.relations.belongsTo.length) { -%>
<% for (var i = 0; i < model.relations.belongsTo.length; i++) { %>
  @belongsTo '<%= model.relations.belongsTo[i].name %>'<% if (model.relations.belongsTo[i].options) { %>, <%- printCoffeeOptions(model.relations.belongsTo[i].options) %><% } %><% } %>
<% } -%><% if (model.relations.hasOne.length) { -%>
<% for (var i = 0; i < model.relations.hasOne.length; i++) { var relation = model.relations.hasOne[i]; %>
  @hasOne '<%= relation.name %>'<% if (relation.options) { %>, <%- printCoffeeOptions(relation.options) %><% } %><% } %>
<% } -%><% if (model.relations.hasMany.length) { -%>
<% for (var i = 0; i < model.relations.hasMany.length; i++) { var relation = model.relations.hasMany[i]; %>
  @hasMany '<%= relation.name %>'<% if (relation.options) { %>, <%- printCoffeeOptions(relation.options) %><% } %><% } %>
<% } -%>

  @timestamps()
