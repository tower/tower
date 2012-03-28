# @example
#   admin = null
#   user  = null
#   
#   Tower.series [
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
