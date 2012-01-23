module.exports =
  mongodb:
    development:
      name: "<%= project.paramName %>-development"
      port: 27017
      host: "127.0.0.1"
    test:
      name: "<%= project.paramName %>-test"
      port: 27017
      host: "127.0.0.1"
    staging:
      name: "<%= project.paramName %>-staging"
      port: 27017
      host: "127.0.0.1"
    production:
      name: "<%= project.paramName %>-production"
      port: 27017
      host: "127.0.0.1"
    
  redis:
    development:
      name: "<%= project.paramName %>-development"
      port: 6397
      host: "127.0.0.1"
    test:
      name: "<%= project.paramName %>-test"
      port: 6397
      host: "127.0.0.1"
    staging:
      name: "<%= project.paramName %>-staging"
      port: 6397
      host: "127.0.0.1"
    production:
      name: "<%= project.paramName %>-production"
      port: 6397
      host: "127.0.0.1"
