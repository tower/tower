var passport;

passport = null;

Tower.Authentication = {
  initialize: function(block) {
    var app;
    passport = require('passport');
    app = Tower.Application.instance();
    app.use(passport.initialize());
    app.use(passport.session());
    if (block) {
      block.call(this, app);
    }
    passport.serializeUser(function(user, done) {
      console.log('serializeUser');
      return done(null, user.get('id').toString());
    });
    return passport.deserializeUser(function(id, done) {
      console.log('deserializeUser');
      return App.User.find(id, function(error, user) {
        return done(error, user);
      });
    });
  },
  provider: function(name, options) {
    var app, params;
    if (options == null) {
      options = {};
    }
    this["" + name + "Strategy"](options);
    app = Tower.Application.instance();
    params = {};
    if (name === 'google') {
      params.scope = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];
    }
    app.get("/auth/" + name, passport.authenticate(name, params));
    return app.get("/auth/" + name + "/callback", function(request, response, next) {
      return passport.authenticate(name, function(error, profile, credentials) {
        var id, provider, rawInfo;
        provider = profile.provider;
        id = profile.id;
        rawInfo = profile._json;
        delete profile.provider;
        delete profile.id;
        delete profile._json;
        delete profile._raw;
        request.authHash = {
          provider: provider,
          id: id,
          info: profile,
          credentials: credentials,
          extra: {
            rawInfo: rawInfo
          }
        };
        return next();
      })(request, response, next);
    });
  },
  oauth2Strategy: function(name, options) {
    var Strategy, credentials;
    try {
      if (name === 'google') {
        Strategy = require("passport-" + name + "-oauth").OAuth2Strategy;
      } else {
        Strategy = require("passport-" + name).Strategy;
      }
      credentials = Tower.config.credentials[name];
      if (credentials) {
        options.key || (options.key = credentials.key);
        options.secret || (options.secret = credentials.secret);
      }
      return passport.use(new Strategy({
        clientID: options.key,
        clientSecret: options.secret,
        callbackURL: "http://" + options.url + "/auth/" + name + "/callback"
      }, function(accessToken, refreshToken, profile, callback) {
        var info;
        info = {
          accessToken: accessToken,
          refreshToken: refreshToken
        };
        return callback(null, profile, info);
      }));
    } catch (error) {
      error.message += " (" + name + ")";
      throw error;
    }
  },
  oauthStrategy: function(name, options) {
    var Strategy, credentials;
    try {
      Strategy = require("passport-" + name).Strategy;
      credentials = Tower.config.credentials[name];
      if (credentials) {
        options.key || (options.key = credentials.key);
        options.secret || (options.secret = credentials.secret);
      }
      return passport.use(new Strategy({
        consumerKey: options.key,
        consumerSecret: options.secret,
        callbackURL: "http://" + options.url + "/auth/" + name + "/callback"
      }, function(token, tokenSecret, profile, callback) {
        var info;
        info = {
          key: token,
          secret: tokenSecret
        };
        return callback(null, profile, info);
      }));
    } catch (error) {
      error.message += " (" + name + ")";
      throw error;
    }
  },
  githubStrategy: function(options) {
    return this.oauth2Strategy('github', options);
  },
  facebookStrategy: function(options) {
    return this.oauth2Strategy('facebook', options);
  },
  twitterStrategy: function(options) {
    return this.oauthStrategy('twitter', options);
  },
  googleStrategy: function(options) {
    return this.oauth2Strategy('google', options);
  },
  linkedinStrategy: function(options) {
    return this.oauthStrategy('linkedin', options);
  }
};
