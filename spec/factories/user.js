var Faker;

Faker = require('Faker');

Factory.define("user", function() {
  return {
    name: Faker.Name.findName(),
    email: Faker.Internet.email()
  };
});

Factory.build("user");
