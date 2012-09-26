module.exports = {
  key: '<%= app.name %>-session-key',
  secret: '<%= app.session %>',
  cookie: {
    domain: '.localhost'
  }
};
