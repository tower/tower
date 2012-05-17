# @example
#   async = require('async')
#   admin = null
#   user  = null
#   
#   async.series [
#     (callback) => App.User.destroy(callback)
#     (callback) => App.Post.destroy(callback)
#     (callback) => App.User.create
#       firstName:  "Admin"
#       lastName:   "User"
#       email:      "admin@localhost.com"
#       (error, record) =>
#         admin = record
#         callback()
#     (callback) => App.User.create
#       firstName:  "Registered"
#       lastName:   "User"
#       email:      "registered@localhost.com"
#       (error, record) =>
#         user = record
#         callback()
#   ]

_.series [
  
], (error) =>
  if error
    console.log "Something went wrong creating seed data... Try changing something and running again."
  else
    console.log "Successfully created seed data!"
    
  process.exit() # close task