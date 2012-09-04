address = null

places =
  "Brandenburg Gate, Berlin":    {lat: 52.516272, lng: 13.377722}
  "Dortmund U-Tower":            {lat: 51.515, lng: 7.453619}
  "London Eye":                  {lat: 51.503333, lng: -0.119722}
  "Kremlin, Moscow":             {lat: 55.751667, lng: 37.617778}
  "Eiffel Tower, Paris":         {lat: 48.8583, lng: 2.2945}
  "Riksdag building, Stockholm": {lat: 59.3275, lng: 18.0675}
  "Royal Palace, Oslo":          {lat: 59.916911, lng: 10.727567}
  
coordinates =
  paris:  places["Eiffel Tower, Paris"]
  moscow: places["Kremlin, Moscow"]
  london: places["London Eye"]
  
placeCoordinates = coordinates.paris

# @todo fix mongodb (one small conversion issue)
if Tower.store.className() == 'Memory'
  describe "Tower.Geo", ->
    #test 'orderByDistance', ->
    #  data = []
    #  data.push(value) for key, value of places
    #  console.log data
    #  console.log _.orderByDistance(coordinates.paris, places)
    
    describe 'units', ->
      test 'miles', ->
        #console.log _.distance(coordinates.paris, coordinates.moscow)
        
    describe 'Address.coordinates', ->
      beforeEach ->
        address = App.Address.build()
        
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
        data.push(_placeCoordinates) for name, _placeCoordinates of places
        
        iterator = (coordinates, next) ->
          App.Address.insert coordinates: coordinates, next
        
        async.forEachSeries data, iterator, done
        
      test 'near', (done) ->
        App.Address.near(lat: placeCoordinates.lat, lng: placeCoordinates.lng).all (error, records) =>
          assert.equal records.length, 7

          # @todo this needs to be serialized from array to Geo hash from mongodb
          # assert.deepEqual records[0].get('coordinates'), placeCoordinates
          
          done()
          
      describe 'within', ->
        test 'within(5)', (done) ->
          App.Address.near(lat: placeCoordinates.lat, lng: placeCoordinates.lng).within(5).all (error, records) => 
            assert.equal records.length, 1
            assert.deepEqual records[0].get('coordinates'), placeCoordinates

            done()
          
        test 'within(5, "miles")'
        test 'within(distance: 5, unit: "miles")'
