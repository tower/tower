cite class: 'copyright', ->
  span '&copy;'
  a href: "mailto:#{t('email')}", -> t('author')
  span "#{t('year')}."