if hasContentFor 'templates'
  yields 'templates'

nav id: 'navigation', class: 'navbar', role: 'navigation', ->
  div class: 'navbar-inner', ->
    div class: 'container', ->
      partial 'shared/navigation'

header id: 'header', class: 'header', role: 'banner', ->
  div class: 'container', ->
    partial 'shared/header'

section id: 'content', role: 'main', ->
  div class: 'container', ->
    yields 'body'
    aside id: 'sidebar', role: 'complementary', ->
      if hasContentFor 'sidebar'
        yields 'sidebar'

footer id: 'footer', class: 'footer', role: 'contentinfo', ->
  div class: 'container', ->
    partial 'shared/footer'
