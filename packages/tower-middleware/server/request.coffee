# express request extensions
request = require('express').request

# We will use this
# request.date
# request.cacheControl = {}

# Versioning REST URls
# http://stackoverflow.com/questions/2024600/rest-api-versioning-only-version-the-representation-not-the-resource-itself
request.__defineGetter__ 'version', ->

# These __defineGetter__ getters recompute every time they're called, which is not ideal.