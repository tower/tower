# make sure params as strings get properly serialized (integration test)
describe 'Tower.Controller persistence', ->
  test 'date string is serialized to database'
    # params = user: birthdate: _(26).years().ago().toDate()