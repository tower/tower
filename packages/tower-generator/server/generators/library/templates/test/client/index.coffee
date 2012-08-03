html 5, ->
  head ->
    title @title
    script src: 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'
    script src: '/javascripts/<%= app.name %>.js'
    script src: '/javascripts/mocha.js'
    script src: '/javascripts/sinon.js'
    script src: '/javascripts/chai.js'
    script src: '/javascripts/tests.js'
    link rel: 'stylesheet', href: '/stylesheets/mocha.css'
  body id: 'mocha'
