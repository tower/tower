cite class: "copyright", ->
  span "&copy;"
  linkTo "<%= user.name %>", "<%= user.email %>"
  span "<%= project.year %>."