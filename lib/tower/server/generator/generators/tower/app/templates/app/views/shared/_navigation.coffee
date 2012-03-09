linkTo t("title"), "/", class: "brand"

div class: "nav-collapse", ->
  ul class: "nav", ->
  ul class: "nav pull-right", ->
    li class: "dropdown", ->
      linkTo t("nav.docs"), "#", class: "dropdown-toggle", "data-toggle": "dropdown", ->
        b class: "caret"
      ul class: "dropdown-menu", ->
        li ->
          linkTo "Tower.js", "http://towerjs.org"