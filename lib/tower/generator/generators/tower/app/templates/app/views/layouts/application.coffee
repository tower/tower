doctype 5
html ->
  partial "shared/head"
  
  body role: "application"
    if browserIs("ie")
      javascriptTag "//html5shiv.googlecode.com/svn/trunk/html5.js"
      
    if contentFor "templates"
      yield "templates"
      
    nav id: "navigation", role: "navigation"
      div class: "frame"
        partial "shared/navigation"
        
    header id: "header", role: "banner"
      div class: "frame"
        if hasFlash()
          renderFlash
        partial "shared/header"
        
    section id: "body", role: "main"
      div class: "frame"
        yield()
        aside id: "sidebar", role: "complementary"
          if contentFor "sidebar"
            yield "sidebar"
            
    footer id: "footer", role: "contentinfo"
      div class: "frame"
        partial "shared/footer"
        
  if contentFor "popups"
    aside id: "popups"
      yield "popups"
      
  if contentFor "bodyJavascripts"
    yield "bodyJavascripts"
