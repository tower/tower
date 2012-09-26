module.exports = {
  mongodb: {
    development: {
      name: '<%= app.paramName %>-development',
      port: 27017,
      host: '127.0.0.1'
    },
    test: {
      name: '<%= app.paramName %>-test',
      port: 27017,
      host: '127.0.0.1'
    },
    staging: {
      name: '<%= app.paramName %>-staging',
      port: 27017,
      host: '127.0.0.1'
    },
    production: {
      name: '<%= app.paramName %>-production',
      port: 27017,
      host: '127.0.0.1'
    }
    // for heroku, comment out name/port/host above and just use `url`:
    //
    //   url: process.env.MONGOHQ_URL
    // 
    // then make sure you have the mongohq heroku addon:
    //   
    //   heroku addons:add mongohq:free
  },
  redis: {
    development: {
      name: '<%= app.paramName %>-development',
      port: 6397,
      host: '127.0.0.1'
    },
    test: {
      name: '<%= app.paramName %>-test',
      port: 6397,
      host: '127.0.0.1'
    },
    staging: {
      name: '<%= app.paramName %>-staging',
      port: 6397,
      host: '127.0.0.1'
    },
    production: {
      name: '<%= app.paramName %>-production',
      port: 6397,
      host: '127.0.0.1'
    }
  }
};
