class Session
  @middleware: require("connect").session({ cookie: { maxAge: 60000 }})

module.exports = Session
