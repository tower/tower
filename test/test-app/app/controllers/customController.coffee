class TowerSpecApp.CustomController extends Tower.Controller
  @before "setCurrentUser"
  @resource type: "TowerSpecApp.User"
  
  @
  
  index: ->
    @indexCalled = true
    @render json: JSON.stringify(musica: "universalis")
    
  renderUser: ->
    
  renderCoffeeKupFromTemplate: ->
    @render 'index'
    
  renderCoffeeKupInline: ->
    @self = "I'm"
    
    @render ->
      h1 "#{@self} Inline!"
    
  setCurrentUser: (callback) ->
    @currentUser = name: "Lance"
    callback(null, true)

  helloWorld: ->

  helloWorldFile: ->
    @render file: File.expandPath("../../fixtures/hello", __FILE__), formats: ["html"]
  
  conditionalHello: ->
    if stale?(lastModified: Time.now.utc.beginningOfDay, etag: ["foo", 123])
      @render action: 'helloWorld'
  
  conditionalHelloWithRecord: ->
    record = Struct.new("updatedAt", "cacheKey").new(Time.now.utc.beginningOfDay, "foo/123")
    
    if stale?(record)
      @render action: 'helloWorld'
      
  conditionalHelloWithPublicHeader: ->
    if stale?(lastModified: Time.now.utc.beginningOfDay, etag: ["foo", 123], public: true)
      @render action: 'helloWorld'
      
  conditionalHelloWithPublicHeaderWithRecord: ->
    record = Struct.new("updatedAt", "cacheKey").new(Time.now.utc.beginningOfDay, "foo/123")

    if stale?(record, public: true)
      @render action: 'helloWorld'
      
  conditionalHelloWithPublicHeaderAndExpiresAt: ->
    expiresIn 1.minute
    if stale?(lastModified: Time.now.utc.beginningOfDay, etag: ["foo", 123], public: true)
      @render action: 'helloWorld'
      
  conditionalHelloWithExpiresIn: ->
    expiresIn 60.1.seconds
    @render action: 'helloWorld'
  
  conditionalHelloWithExpiresInWithPublic: ->
    expiresIn 1.minute, public: true
    @render action: 'helloWorld'
  
  conditionalHelloWithExpiresInWithPublicWithMoreKeys: ->
    expiresIn 1.minute, public: true, 'max-stale' => 5.hours
    @render action: 'helloWorld'
  
  conditionalHelloWithExpiresInWithPublicWithMoreKeysOldSyntax: ->
    expiresIn 1.minute, public: true, private: nil, 'max-stale' => 5.hours
    @render action: 'helloWorld'
  
  conditionalHelloWithExpiresNow: ->
    expiresNow
    @render action: 'helloWorld'
  
  conditionalHelloWithBangs: ->
    @render action: 'helloWorld'
    beforeFilter "handleLastModifiedAndEtags", "only"=>"conditionalHelloWithBangs"

  handleLastModifiedAndEtags: ->
    freshWhen(lastModified: Time.now.utc.beginningOfDay, etag: [ "foo", 123 ])
  
  # "ported":
  renderHelloWorld: ->
    @render template: "test/helloWorld"
  
  renderHelloWorldWithLastModifiedSet: ->
    response.lastModified = Date.new(2008, 10, 10).toTime
    @render template: "test/helloWorld"
  
  # "ported": compatibility
  renderHelloWorldWithForwardSlash: ->
    @render template: "/test/helloWorld"
  
  # "ported":
  renderTemplateInTopDirectory: ->
    @render template: 'shared'
  
  # "deprecated":
  renderTemplateInTopDirectoryWithSlash: ->
    @render template: '/shared'
  
  # "ported":
  renderHelloWorldFromVariable: ->
    @person = "david"
    @render text: "hello #{@person}"
  
  # "ported":
  renderActionHelloWorld: ->
    @render action: "helloWorld"
  
  renderActionUpcasedHelloWorld: ->
    @render action: "HelloWorld"
  
  renderActionHelloWorldAsString: ->
    @render "helloWorld"
  
  renderActionHelloWorldWithSymbol: ->
    @render action: "helloWorld"
  
  # "ported":
  renderTextHelloWorld: ->
    @render text: "hello world"
  
  # "ported":
  renderTextHelloWorldWithLayout: ->
    @variableForLayout = ", I'm here!"
    @render text: "hello world", layout: true
  
  helloWorldWithLayoutFalse: ->
    @render layout: false
  
  # "ported":
  renderFileWithInstanceVariables: ->
    @secret = 'in the sauce'
    path = File.join(File.dirname(__FILE__), '../fixtures/test/renderFileWithIvar')
    @render file: path
  
  # "ported":
  renderFileAsStringWithInstanceVariables: ->
    @secret = 'in the sauce'
    path = File.expandPath(File.join(File.dirname(__FILE__), '../fixtures/test/renderFileWithIvar'))
    @render path
  
  # "ported":
  renderFileNotUsingFullPath: ->
    @secret = 'in the sauce'
    @render file: 'test/renderFileWithIvar'
  
  renderFileNotUsingFullPathWithDotInPath: ->
    @secret = 'in the sauce'
    @render file: 'test/dot.directory/renderFileWithIvar'
  
  renderFileUsingPathname: ->
    @secret = 'in the sauce'
    @render file: Pathname.new(File.dirname(__FILE__)).join('..', 'fixtures', 'test', 'dot.directory', 'renderFileWithIvar')
  
  renderFileFromTemplate: ->
    @secret = 'in the sauce'
    @path = File.expandPath(File.join(File.dirname(__FILE__), '../fixtures/test/renderFileWithIvar'))
  
  renderFileWithLocals: ->
    path = File.join(File.dirname(__FILE__), '../fixtures/test/renderFileWithLocals')
    @render file: path, locals: {secret: 'in the sauce'}
  
  renderFileAsStringWithLocals: ->
    path = File.expandPath(File.join(File.dirname(__FILE__), '../fixtures/test/renderFileWithLocals'))
    @render path, locals: {secret: 'in the sauce'}
  
  accessingRequestInTemplate: ->
    @render inline:  "Hello: <%= request.host %>"
  
  accessingLoggerInTemplate: ->
    @render inline:  "<%= logger.class %>"
  
  accessingActionNameInTemplate: ->
    @render inline:  "<%= actionName %>"
  
  accessingControllerNameInTemplate: ->
    @render inline:  "<%= controllerName %>"
  
  # "ported":
  renderCustomCode: ->
    @render text: "hello world", status: 404
  
  # "ported":
  renderTextWithNil: ->
    @render text: nil
  
  # "ported":
  renderTextWithFalse: ->
    @render text: false
  
  renderTextWithResource: ->
    @render text: Customer.new("David")
  
  # "ported":
  renderNothingWithAppendix: ->
    @render text: "appended"
  
  # This test is testing 3 things:
  #   @render "file" in AV      "ported":
  #   @render "template" in AC  "ported":
  #   setting content type
  renderXmlHello: ->
    @name = "David"
    @render template: "test/hello"
  
  renderXmlHelloAsStringTemplate: ->
    @name = "David"
    @render "test/hello"
  
  renderLineOffset: ->
    @render inline: '<% raise %>', locals: {foo: 'bar'}
  
  heading: ->
    head "ok"
  
  greeting: ->
    # let's just rely on the template
  
  # "ported":
  blankResponse: ->
    @render text: ' '
  
  # "ported":
  layoutTest: ->
    @render action: "helloWorld"
  
  # "ported":
  builderLayoutTest: ->
    @name = nil
    @render action: "hello", layout: "layouts/builder"
  
  # "move": test this in Action View
  builderPartialTest: ->
    @render action: "helloWorldContainer"
  
  # "ported":
  partialsList: ->
    @testUnchanged = 'hello'
    @customers = [ Customer.new("david"), Customer.new("mary") ]
    @render action: "list"
  
  partialOnly: ->
    @render partial: true
  
  helloInA_string: ->
    @customers = [ Customer.new("david"), Customer.new("mary") ]
    @render text: "How's there? " + renderToString(template: "test/list")
  
  accessingParamsInTemplate: ->
    @render inline: "Hello: <%= params["name"] %>"
  
  accessingLocalAssignsInInlineTemplate: ->
    name = params["localName"]
    @render inline: "<%= 'Goodbye, ' + localName %>",
           locals: { localName: name }
  
  renderImplicitHtmlTemplateFromXhrRequest: ->
  
  renderImplicitJsTemplateWithoutLayout: ->
  
  formattedHtmlErb: ->
  
  formattedXmlErb: ->
  
  renderToStringTest: ->
    @foo = renderToString inline: "this is a test"
  
  defaultRender: ->
    @alternateDefaultRender ||= nil
    if @alternateDefaultRender
      @alternateDefaultRender.call
    else
      super
      
  renderActionHelloWorldAsSymbol: ->
    @render action: "helloWorld"
  
  layoutTestWithDifferentLayout: ->
    @render action: "helloWorld", layout: "standard"
  
  layoutTestWithDifferentLayoutAndStringAction: ->
    @render "helloWorld", layout: "standard"
  
  layoutTestWithDifferentLayoutAndSymbolAction: ->
    @render "helloWorld", layout: "standard"
  
  renderingWithoutLayout: ->
    @render action: "helloWorld", layout: false
  
  layoutOverridingLayout: ->
    @render action: "helloWorld", layout: "standard"
  
  renderingNothingOnLayout: ->
    @render nothing: true
  
  renderToStringWithAssigns: ->
    @before = "i'm before the render"
    renderToString text: "foo"
    @after = "i'm after the render"
    @render template: "test/helloWorld"
  
  renderToStringWithException: ->
    renderToString file: "exception that will not be caught - this will certainly not work"
  
  renderToStringWithCaughtException: ->
    @before = "i'm before the render"
    begin
      renderToString file: "exception that will be caught- hope my future instance vars still work!"
    rescue
        @after = "i'm after the render"
    @render template: "test/helloWorld"
  
  accessingParamsInTemplateWithLayout: ->
    @render layout: true, inline:  "Hello: <%= params["name"] %>"
  
  # "ported":
  renderWithExplicitTemplate: ->
    @render template: "test/helloWorld"
  
  renderWithExplicitUnescapedTemplate: ->
    @render template: "test/h*lloWorld"
  
  renderWithExplicitEscapedTemplate: ->
    @render template: "test/hello,world"
  
  renderWithExplicitStringTemplate: ->
    @render "test/helloWorld"
  
  # "ported":
  renderWithExplicitTemplateWithLocals: ->
    @render template: "test/renderFileWithLocals", locals: { secret: 'area51' }
  
  # "ported":
  doubleRender: ->
    @render text: "hello"
    @render text: "world"
  
  doubleRedirect: ->
    redirectTo action: "doubleRender"
    redirectTo action: "doubleRender"
  
  renderAndRedirect: ->
    @render text: "hello"
    redirectTo action: "doubleRender"
  
  renderToStringAndRender: ->
    @stuff = renderToString text: "here is some cached stuff"
    @render text: "Hi web users! #{@stuff}"
  
  renderToStringWithInlineAndRender: ->
    renderToString inline: "<%= 'dlrow olleh'.reverse %>"
    @render template: "test/helloWorld"
  
  renderingWithConflictingLocalVars: ->
    @name = "David"
    @render action: "potentialConflicts"
  
  helloWorldFromRxmlUsingAction: ->
    @render action: "helloWorldFromRxml", handlers: ["builder"]
  
  # "deprecated":
  helloWorldFromRxmlUsingTemplate: ->
    @render template: "test/helloWorldFromRxml", handlers: ["builder"]
  
  actionTalkToLayout: ->
    # Action template sets variable that's picked up by layout
  
  # "addressed":
  renderTextWithAssigns: ->
    @hello = "world"
    @render text: "foo"
  
  yieldContentFor: ->
    @render action: "contentFor", layout: "yield"
  
  renderContentTypeFromBody: ->
    response.contentType = Mime:"RSS"
    @render text: "hello world!"
  
  headWithLocationHeader: ->
    head location: "/foo"
  
  headWithLocationObject: ->
    head location: Customer.new("david", 1)
  
  headWithSymbolicStatus: ->
    head status: params["status"].intern
  
  headWithIntegerStatus: ->
    head status: params["status"].toI
  
  headWithStringStatus: ->
    head status: params["status"]
  
  headWithCustomHeader: ->
    head xCustomHeader: "something"
  
  headWithWwwAuthenticateHeader: ->
    head 'WWW-Authenticate' => 'something'
  
  headWithStatusCodeFirst: ->
    head "forbidden", xCustomHeader: "something"
  
  renderUsingLayoutAroundBlock: ->
    @render action: "usingLayoutAroundBlock"
  
  renderUsingLayoutAroundBlockInMainLayoutAndWithinContentForLayout: ->
    @render action: "usingLayoutAroundBlock", layout: "layouts/blockWithLayout"
  
  partialFormatsHtml: ->
    @render partial: 'partial', formats: ["html"]
  
  partial: ->
    @render partial: 'partial'
  
  renderToStringWithPartial: ->
    @partialOnly = renderToString partial: "partialOnly"
    @partialWithLocals = renderToString partial: "customer", locals: { customer: Customer.new("david") }
    @render template: "test/helloWorld"
  
  partialWithCounter: ->
    @render partial: "counter", locals: { counterCounter: 5 }
  
  partialWithLocals: ->
    @render partial: "customer", locals: { customer: Customer.new("david") }
  
  partialWithFormBuilder: ->
    @render partial: ActionView:"Helpers":"FormBuilder".new("post", nil, viewContext, {}, Proc.new {})
  
  partialWithFormBuilderSubclass: ->
    @render partial: LabellingFormBuilder.new("post", nil, viewContext, {}, Proc.new {})
  
  partialCollection: ->
    @render partial: "customer", collection: [ Customer.new("david"), Customer.new("mary") ]
  
  partialCollectionWithAs: ->
    @render partial: "customerWithVar", collection: [ Customer.new("david"), Customer.new("mary") ], as: "customer"
  
  partialCollectionWithCounter: ->
    @render partial: "customerCounter", collection: [ Customer.new("david"), Customer.new("mary") ]
  
  partialCollectionWithAsAndCounter: ->
    @render partial: "customerCounterWithAs", collection: [ Customer.new("david"), Customer.new("mary") ], as: "client"
  
  partialCollectionWithLocals: ->
    @render partial: "customerGreeting", collection: [ Customer.new("david"), Customer.new("mary") ], locals: { greeting: "Bonjour" }
  
  partialCollectionWithSpacer: ->
    @render partial: "customer", spacerTemplate: "partialOnly", collection: [ Customer.new("david"), Customer.new("mary") ]
  
  partialCollectionShorthandWithLocals: ->
    @render partial: [ Customer.new("david"), Customer.new("mary") ], locals: { greeting: "Bonjour" }
  
  partialCollectionShorthandWithDifferentTypesOfRecords: ->
    @render partial: [
        BadCustomer.new("mark"),
        GoodCustomer.new("craig"),
        BadCustomer.new("john"),
        GoodCustomer.new("zach"),
        GoodCustomer.new("brandon"),
        BadCustomer.new("dan") ],
      locals: { greeting: "Bonjour" }
  
  emptyPartialCollection: ->
    @render partial: "customer", collection: []
  
  partialCollectionShorthandWithDifferentTypesOfRecordsWithCounter: ->
    partialCollectionShorthandWithDifferentTypesOfRecords
  
  missingPartial: ->
    @render partial: 'thisFileIsntHere'
  
  partialWithHashObject: ->
    @render partial: "hashObject", object: {firstName: "Sam"}
  
  partialWithNestedObject: ->
    @render partial: "quiz/questions/question", object: Quiz:"Question".new("first")
  
  partialWithNestedObjectShorthand: ->
    @render Quiz:"Question".new("first")
  
  partialHashCollection: ->
    @render partial: "hashObject", collection: [ {firstName: "Pratik"}, {firstName: "Amy"} ]
  
  partialHashCollectionWithLocals: ->
    @render partial: "hashGreeting", collection: [ {firstName: "Pratik"}, {firstName: "Amy"} ], locals: { greeting: "Hola" }
  
  partialWithImplicitLocalAssignment: ->
    @customer = Customer.new("Marcel")
    @render partial: "customer"
  
  renderCallToPartialWithLayout: ->
    @render action: "callingPartialWithLayout"
  
  renderCallToPartialWithLayoutInMainLayoutAndWithinContentForLayout: ->
    @render action: "callingPartialWithLayout", layout: "layouts/partialWithLayout"
  
  rescueAction: ->(e)
    raise
  
  beforeFilter only: "renderWithFilters" do
    request.format = "xml"
  
  # Ensure that the before filter is executed *before* self.formats is set.
  renderWithFilters: ->
    @render action: "formattedXmlErb"
  