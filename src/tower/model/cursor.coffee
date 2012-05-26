# An array or collection of models.
# 
# This behaves mostly like a native JavaScript Array, but it is not.
# This means you can still iterate over the items using a standard 
# for loop, i.e. `var record = records[i]`, but you cannot set an item
# using the square brackets `[]` method, i.e. `records[i] = App.User.build()`.
# That is the only limitation.  Everything else will feel exactly like an native Array.
# 
# To manipulate objects at different indices, use these methods:
# - #addObjectAt
# - #removeObjectAt
# - #addObject
# - #removeObject
# 
# @example Iterating using a for loop
#   App.User.all (error, users) =>
#     for user in users
#       console.log user
# 
# @example Iterating using the preferred {http://docs.emberjs.com/#doc=Ember.Enumerable #forEach}
#   App.User.all (error, users) =>
#     users.forEach (user, index) =>
#       console.log user
# 
# Because most/all of the database implementations in Node.js
# require asynchronous callbacks, you must use the asynchronous callback approach
# to obtain a reference to the cursor containing records.  However, every cursor method
# that uses the async callback will return the `Tower.Model.Cursor` instance.  On the server
# it will not contain any records (because of the async-ness), but in the browser,
# it _will_ contain the records.  So in the browser you don't need to use async callbacks!
#
# @example In the browser (i.e. using {Tower.Store.Memory}), no callback is needed
#   users = App.User.all()
# 
# @note An instance of {Tower.Model.Cursor} looks and feels almost like a 
# native JavaScript Array, but it is not.  See http://stackoverflow.com/a/10763103/169992. 
# When you log `users` in the Chrome web console, for example, it will look like it's an Array.
# jQuery does this same thing.  It just makes it more intuitive.
# 
# By default, no cursor will updated when a record matching it is modified (created/updated/deleted).
# You don't want this to be the default because every time you build a scope to do a query
# You append another cursor to the set the model store must iterate through every time a matching record
# is modified.  So, to make a cursor subscribable, you need to publish it.
# 
# @example Publishing a cursor so it updates when matching records are modified.
#   App.User.all().publish()
# 
# @example You can also publish a cursor from a scope.
#   class App.User extends Tower.Model
#     @scope 'recent', @where(createdAt: '>=': -> _(2).days().ago()).publish()
# 
# ## Using Cursors in Views
# 
# @example Set your cursors to variables in your client side controllers.
#   class App.UsersController extends Tower.Controller
#     recent: App.User.recent()
#     all:    App.User.all().publish()
#   
#   <ul id='users-list'>
#   {{#each App.usersController.recent}}
#     <li class='user'>{{email}}</li>
#   {{/each}}
#   </ul>
#   
#   App.User.create(email: 'example@localhost.com') # list updates automatically
# 
# ## The State of Cursors
# 
# Unline {Tower.Model.Scope}, which creates a clone every time you call a chaining method,
# the {Tower.Model.Cursor} does not get cloned, and it retains the state of any modifications.
# This allows for tracking pagination among other things, but it also means they're 
# not as flexible as scopes.  In the end you don't really need to think about the fact that
# you're using a cursor, but it's good to know anyway.
class Tower.Model.Cursor extends Tower.Collection
  init: ->
    @_super arguments...

require './cursor/finders'
require './cursor/operations'
require './cursor/persistence'
require './cursor/serialization'

Tower.Model.Cursor.include Tower.Model.Cursor.Finders
Tower.Model.Cursor.include Tower.Model.Cursor.Operations
Tower.Model.Cursor.include Tower.Model.Cursor.Persistence
Tower.Model.Cursor.include Tower.Model.Cursor.Serialization

module.exports = Tower.Model.Cursor
