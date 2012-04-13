module.exports =
  mongodb:
    development:
      name: "client-development"
      port: 27017
      host: "127.0.0.1"
    test:
      name: "client-test"
      port: 27017
      host: "127.0.0.1"
    staging:
      name: "client-staging"
      port: 27017
      host: "127.0.0.1"
    production:
      name: "client-production"
      port: 27017
      host: "127.0.0.1"
    
  redis:
    development:
      name: "client-development"
      port: 6397
      host: "127.0.0.1"
    test:
      name: "client-test"
      port: 6397
      host: "127.0.0.1"
    staging:
      name: "client-staging"
      port: 6397
      host: "127.0.0.1"
    production:
      name: "client-production"
      port: 6397
      host: "127.0.0.1"
