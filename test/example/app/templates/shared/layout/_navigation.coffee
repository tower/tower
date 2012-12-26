a '{{action showRoot href=true}}', class: 'brand', -> t('title')

div class: 'nav-collapse', ->
  ul class: 'nav', ->
    li '{{bindAttr class="App.CarsController.isActive:active"}}', ->
      a '{{action indexCars href=true}}', t('links.cars')
  ul class: 'nav pull-right', ->
    li class: 'dropdown', ->
      linkTo t('links.docs'), '#', class: 'dropdown-toggle', 'data-toggle': 'dropdown', ->
        b class: 'caret'
      ul class: 'dropdown-menu', ->
        li ->
          linkTo 'Tower.js', 'https://github.com/viatropos/tower/wiki'
