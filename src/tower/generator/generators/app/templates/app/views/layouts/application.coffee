doctype 5
html ->
  head ->
    meta charset: 'utf-8'
    title t('title')
    meta name: 'description', content: t('description')
    meta name: 'keywords', content: t('keywords')
    stylesheets "vendor", "application"
    javascripts "vendor", "lib", "application"
  body ->
    header ->
      h1 t('title')
      nav ->
        ul ->
          (li -> a href: '/', -> 'Home') unless @path is '/'
          switch @user.role
            when 'owner', 'admin'
              li -> a href: '/admin', -> 'Secret Stuff'
            when 'vip'
              li -> a href: '/vip', -> 'Exclusive Stuff'
            else
              li -> a href: '/commoners', -> 'Just Stuff'
    section ->
      yield()
    footer ->