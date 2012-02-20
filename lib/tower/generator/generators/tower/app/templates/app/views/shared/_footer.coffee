cite class: "copyright", ->
  text "&copy;"
  linkTo("<%= user.name %>", "<%= user.email %>")
  text "<%= project.year %>."