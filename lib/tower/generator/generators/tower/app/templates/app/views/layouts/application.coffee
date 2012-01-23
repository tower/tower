doctype 5
html ->
  head ->
    partial "shared/meta"
  
  body role: "application", ->
    #if browserIs "ie"
    #  javascriptTag "http://html5shiv.googlecode.com/svn/trunk/html5.js"
      
    if contentFor "templates"
      yields "templates"
      
    nav id: "navigation", role: "navigation", ->
      div class: "frame", ->
        partial "shared/navigation"
        
    header id: "header", role: "banner", ->
      div class: "frame", ->
        #if hasFlash()
        #  renderFlash()
        partial "shared/header"
        
    section id: "body", role: "main", ->
      div class: "frame", ->
        yields "body"
        aside id: "sidebar", role: "complementary", ->
          if contentFor "sidebar"
            yields "sidebar"
            
    footer id: "footer", role: "contentinfo", ->
      div class: "frame", ->
        partial "shared/footer"
        
  if contentFor "popups"
    aside id: "popups", ->
      yields "popups"
      
  if contentFor "bottom"
    yields "bottom"
