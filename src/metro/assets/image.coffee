# https://github.com/rsms/node-imagemagick
class Image extends Metro.Assets.Asset
  engine: -> require('imagemagick')
  
  render: (options) ->
    engine().readMetadata options.path, (err, metadata) ->
    throw err if err?
    
    console.log('Shot at '+metadata.exif.dateTimeOriginal)
  
module.exports = Image
