
Tower.__defineGetter__('isHeroku', function() {
  return process.env.TOWER_CLOUD_PLATFORM === 'heroku';
});

Tower.__defineGetter__('isNodejitsu', function() {
  return process.env.TOWER_CLOUD_PLATFORM === 'nodejitsu';
});
