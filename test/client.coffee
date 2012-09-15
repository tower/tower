# https://github.com/metaskills/mocha-phantomjs
# https://github.com/kmiyashiro/grunt-mocha

#phantom.viewportSize =
#  width: 800
#  height: 600

columns = parseInt(require('system').env.COLUMNS or 75) * .75 | 0
page = null

exit = (msg) ->
  console.log msg if msg
  phantom.exit 1

finish = ->
  phantom.exit page.evaluate -> mocha.phantomjs?.failures

dotLog = (columns) ->
  # dot reporter
  process.cursor.margin = 2
  process.cursor.CRMatcher = /\u001b\[\d\dm\․\u001b\[0m/
  process.stdout.columns = columns
  process.stdout.allowedFirstNewLine = false
  process.stdout.write = (string) ->
    if string is '\n  '
      unless process.stdout.allowedFirstNewLine
        process.stdout.allowedFirstNewLine = true
      else
        return
    else if string.match(process.cursor.CRMatcher)
      if process.cursor.count is process.stdout.columns
        process.cursor.count = 0
        forward = process.cursor.margin
        string = process.cursor.forwardN(forward) + string
      else
        forward = process.cursor.margin + process.cursor.count
        string = process.cursor.up + process.cursor.forwardN(forward) + string
      ++process.cursor.count
    console.log string

setupClient = ->
  if page.evaluate(-> window.mocha?)
    page.injectJs 'mocha-extensions.js'
    page.evaluate dotLog, columns
  else
    exit "Failed to find mocha on the page."

runMocha = ->
  page.evaluate runner
  mochaStarted = page.evaluate -> mocha?.phantomjs?.runner or false
  if mochaStarted
    mochaRunAt = new Date().getTime()
    waitForMocha()
  else
    exit "Failed to start mocha."

waitForMocha = ->
  ended = !!(page.evaluate -> mocha.phantomjs?.ended)
  if ended then finish() else setTimeout(waitForMocha, 1000)

runner = ->
  try
    mocha.setup ui: 'bdd', timeout: 2000, reporter: mocha.reporters.Dot # mocha.reporters.JSON
    mocha.phantomjs = failures: 0, ended: false, run: false
    mocha.phantomjs.runner = mocha.run()
    if mocha.phantomjs.runner
      mocha.phantomjs.runner.on 'end', ->
        #mocha.phantomjs.failures = exitures
        mocha.phantomjs.ended = true
  catch error
    console.log(error.toString())
    false

run = ->
  args = phantom.args

  if args.length < 1 or args.length > 2
    console.log "Usage: #{phantom.scriptName} <URL> <timeout>"
    phantom.exit 1

  url = args[0]

  page = require('webpage').create()

  page.onInitialized = => 
    page.evaluate -> window.mochaPhantomJS = true

  page.onConsoleMessage = (message) ->
    console.log(message)

  page.onLoadFinished = (status) =>
    if status isnt 'success' then onLoadFailed() else onLoadSuccess()

  onLoadSuccess = ->
    setupClient()
    runMocha()

  onLoadFailed = ->
    exit "Failed to load the page. Check the url: #{url}"

  page.open url

run()

# # A bit of a hack until we can figure this out on Travis
# tries = 0
# while tries < 3 && $?.exitstatus === 124
#   tries += 1
#   puts "Timed Out. Trying again..."
#   system(cmd)
# end
# 
# success &&= $?.success?
