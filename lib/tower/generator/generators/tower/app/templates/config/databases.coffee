module.exports =
  mongodb:
    development:
      name: "<%= project.cssName %>-development"
      port: 27017
      host: "127.0.0.1"
    test:
      name: "<%= project.cssName %>-test"
      port: 27017
      host: "127.0.0.1"
    staging:
      name: "<%= project.cssName %>-staging"
      port: 27017
      host: "127.0.0.1"
    production:
      name: "<%= project.cssName %>-production"
      port: 27017
      host: "127.0.0.1"
    
  redis:
    development:
      name: "<%= project.cssName %>-development"
      port: 6397
      host: "127.0.0.1"
    test:
      name: "<%= project.cssName %>-test"
      port: 6397
      host: "127.0.0.1"
    staging:
      name: "<%= project.cssName %>-staging"
      port: 6397
      host: "127.0.0.1"
    production:
      name: "<%= project.cssName %>-production"
      port: 6397
      host: "127.0.0.1"
