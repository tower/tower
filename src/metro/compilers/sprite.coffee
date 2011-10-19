# http://www.imagemagick.org/script/montage.php
# https://github.com/rsms/node-imagemagick
# http://www.alistapart.com/articles/sprites
_ = require('underscore')

class Sprite# extends Metro.Assets.Asset
  engine: -> require('imagemagick')
  
  render: (options, callback) ->
    self = @
    @montage options, (data) -> callback self["to_#{options.format || 'css'}"](data, options)
  
  to_stylus: (data, options) ->
    result = "#{options.name || 'sprite'}(slug, x, y)\n"
    for item, i in data
      _if = if i == 0 then "if" else (if i == data.length - 1 then "else" else "else if")
      result += "  #{_if} slug == \"#{item.slug}\"\n"
      result += "    background: url(#{item.path}) #{item.x || 0}px #{item.y || 0}px no-repeat;\n"
    result
  
  to_css: (data, options) ->
    result = ""
    name   = options.name || "sprite"
    for item, i in data
      result += "\.#{item.slug}-#{name} {\n"
      result += "  background: url(#{item.path}) #{item.x || 0}px #{item.y || 0}px no-repeat;\n"
      result += "}\n"
    result
    
  montage: (options, callback) ->
    images  = options.images
    throw new Error("you haven't specified any images") unless images && images.length > 0
    columns = options.columns || 1
    rows    = images.length
    type    = options.type || "png"
    output  = options.output || "sprite.png"
    offset  = options.offset || {}
    offset.x ?= 0
    offset.y ?= 5
    self    = @
    
    @identifyAll images, offset, (data) ->
      if data.length > 0
        command = "montage -background transparent -tile #{columns}x#{rows} -geometry +#{offset.x}+#{offset.y} -frame 4x4 #{images.join(" ")} #{output}"
        Metro.Support.System.command command, (error, stdout, stderr) ->
          callback.call(self, data)
    
    images
  
  identifyAll: (images, offset, callback) ->
    data              = []
    cumulative_offset = x: 0, y:0
    
    for image in images
      @identify image, images, data, (data) ->
        for item in data
          item.y = cumulative_offset.y + offset.y
          offset.y += item.height
        callback(data)
        
    null
    
  identify: (image, images, data, callback) ->
    self    = @
    
    @engine().identify image, (error, features) ->
      features.path   = image
      features.slug   = Metro.Support.File.slug(image)
      features.format = features.format.toLowerCase()
      
      data[images.indexOf(image)] = features
      
      callback.call(self, data) if data.length == images.length
  
module.exports = Sprite
