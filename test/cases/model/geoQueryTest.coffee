require '../../config'

address = null
moment  = require 'moment'
geo     = require 'geolib'

places =
  "Brandenburg Gate, Berlin":    {latitude: 52.516272, longitude: 13.377722}
  "Dortmund U-Tower":            {latitude: 51.515, longitude: 7.453619}
  "London Eye":                  {latitude: 51.503333, longitude: -0.119722}
  "Kremlin, Moscow":             {latitude: 55.751667, longitude: 37.617778}
  "Eiffel Tower, Paris":         {latitude: 48.8583, longitude: 2.2945}
  "Riksdag building, Stockholm": {latitude: 59.3275, longitude: 18.0675}
  "Royal Palace, Oslo":          {latitude: 59.916911, longitude: 10.727567}
  
coordinates =
  paris:  places["Eiffel Tower, Paris"]
  moscow: places["Kremlin, Moscow"]
  london: places["London Eye"]

describeWith = (store) ->
  describe "Tower.Geo (Tower.Store.#{store.name})", ->
    beforeEach (done) ->
      store.clean =>
        App.Address.store(store)
        done()
    
    #test 'orderByDistance', ->
    #  data = []
    #  data.push(value) for key, value of places
    #  console.log data
    #  console.log geo.orderByDistance(coordinates.paris, places)
    
    describe 'units', ->
      test 'miles', ->
        console.log geo.getDistance(coordinates.paris, coordinates.moscow)
        
    describe 'Address.coordinates', ->
      beforeEach (done) ->
        address = new App.Address
        done()
        
      test 'field.type', ->
        field = App.Address.fields().coordinates
        
        assert.equal field.type, "Geo"
        
      test 'serialize from object', ->
        address.set 'coordinates', coordinates.paris
        
        assert.deepEqual address.get('coordinates'), {lat: 48.8583, lng: 2.2945}
        
      test 'serialize from array', ->
        address.set 'coordinates', [48.8583, 2.2945]
        
        assert.deepEqual address.get('coordinates'), {lat: 48.8583, lng: 2.2945}
        
      test 'serialize from string', ->
        address.set 'coordinates', "48.8583,2.2945"
        
        assert.deepEqual address.get('coordinates'), {lat: 48.8583, lng: 2.2945}
        
    describe 'persistence', ->    
      beforeEach (done) ->
        data = []
        data.push(coordinates) for name, coordinates of places
        
        iterator = (coordinates, next) ->
          App.Address.create coordinates: coordinates, next
        
        async.forEachSeries data, iterator, done
        
      test 'near', (done) ->
        App.Address.near(coordinates.paris).all (error, records) =>
          #console.log _.map records, (i) -> i.get('coordinates')
          done()
          
      describe 'within', ->
        test 'within(5)'
        test 'within(5, "miles")'
        test 'within(distance: 5, unit: "miles")'

describeWith(Tower.Store.MongoDB)
