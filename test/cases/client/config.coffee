exec  = require("child_process").exec
forever = require("forever")
Hook  = require("hook.io").Hook
hook  = new Hook(name: "tower-test", debug: true, silent: false)
url   = "http://localhost:3000"

browsers =
  names:    ["chrome", "safari", "firefox", "opera"]
  # chrome: ["/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome", "--user-data-dir=/tmp", url]
  chrome:   """open -a "Google Chrome" #{url}"""
  safari:   """open -a "Safari" #{url}"""
  firefox:  """open -a "Firefox" #{url}"""
  opera:    """open -a "Opera" #{url}"""
  
next = (callback) ->
  browser = browsers[browser.names.shift()]
  if browser
    exec browser
  else
    hook.kill()

hook.on "design.io-server::tower-test::ready", =>
  next()
  #exec "open #{url}"

hook.on "design.io-server::tower-test::client::log", (data, callback, event) =>
  # data == spec output from browser
  if data.type == "test"
    console.log data
    if data.phase == "complete"
      next()
  
hook.start()

