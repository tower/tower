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

describeWith = (store) ->
  describe "Tower.Geo (Tower.Store.#{store.className()})", ->
    beforeEach (done) ->
      store.clean =>
        App.Address.store(store)
        done()
    
    #test 'orderByDistance', ->
    #  data = []
    #  data.push(value) for key, value of places
    #  console.log data
    #  console.log _.orderByDistance(coordinates.paris, places)
    
    describe 'units', ->
      test 'miles', ->
        #console.log _.distance(coordinates.paris, coordinates.moscow)
        
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
        data.push(placeCoordinates) for name, placeCoordinates of places
        
        iterator = (coordinates, next) ->
          App.Address.insert coordinates: coordinates, next
        
        async.forEachSeries data, iterator, done
        
      test 'near', ->
        App.Address.near(lat: placeCoordinates.lat, lng: placeCoordinates.lng).all (error, records) =>
          assert.equal records.length, 7
          assert.deepEqual records[0].get('coordinates'), placeCoordinates
          
      describe 'within', ->
        test 'within(5)', ->
          App.Address.near(lat: placeCoordinates.lat, lng: placeCoordinates.lng).within(5).all (error, records) => 
            assert.equal records.length, 1
            assert.deepEqual records[0].get('coordinates'), placeCoordinates
          
        test 'within(5, "miles")'
        test 'within(distance: 5, unit: "miles")'

describeWith(Tower.Store.Mongodb) unless Tower.client
describeWith(Tower.Store.Memory)
