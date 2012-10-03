# @todo this should normalize the environment variables for different paas providers.

Tower.__defineGetter__ 'isHeroku', ->
  process.env.TOWER_CLOUD_PLATFORM == 'heroku'

Tower.__defineGetter__ 'isNodejitsu', ->
  process.env.TOWER_CLOUD_PLATFORM == 'nodejitsu'