class App.User extends Tower.Model
  @field 'firstName'
  @field 'lastName'
  @field 'createdAt', type: 'Time', default: -> new Date()
  @field 'likes', type: 'Integer', default: 0
  @field 'tags', type: ['Array'], default: []
  @field 'admin', type: 'Boolean', default: false
  @field 'rating', type: 'Float', default: 2.5
  @field 'meta', type: 'Object'
  
  @scope 'byBaldwin', firstName: '=~': 'Baldwin'
  @scope 'thisWeek', @where createdAt: '>=': -> require('moment')().subtract('days', 7)
  
  # need to change this...
  @hasMany 'posts', type: 'Page', idCache: true # postIds
  @hasMany 'articles', type: 'Post', idCache: true
  @hasMany 'comments', source: 'commenter'

  @hasOne 'address'
  
  @hasMany 'memberships'
  @hasMany 'groups', through: 'memberships'
  
  @hasMany 'polymorphicMemberships', as: 'joinable', type: 'Membership'
  @hasMany 'cachedMemberships', type: 'Membership', idCache: true
  #@hasMany 'dependentMemberships', type: 'DependentMembership', dependent: true
  
  @validates 'firstName', presence: true
  
  @timestamps()

class App.Admin extends App.User
  @scope 'subclassNamedScope', likes: '>': 0