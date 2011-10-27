# https://github.com/marak/Faker.js/
Faker = require('Faker')

Factory.define "user", ->
  name:   Faker.Name.findName()
  email:  Faker.Internet.email()

Factory.build "user"