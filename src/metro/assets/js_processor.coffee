Processor = require('./processor')

class JsProcessor extends Processor
  extension: 'js'
  terminator: ";"
  
module.exports = JsProcessor
