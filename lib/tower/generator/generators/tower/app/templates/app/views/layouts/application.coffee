doctype 5
html ->
  head ->
    meta charset: 'utf-8'
    title t('title')
    meta name: 'description', content: t('description')
    meta name: 'keywords', content: t('keywords')
    stylesheets "lib", "application"
    script src: 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js'
    javascripts "vendor", "application"
    
    if Tower.env == "development"
      javascripts "development"
  body ->
    header ->
      h1 t('title')
    section ->
      yield()
    footer ->