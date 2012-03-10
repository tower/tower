module.exports =
  title:        "<%= app.title %>"
  description:  "<%= app.description %>"
  keywords:     "<%= app.keywords %>"
  author:       "<%= user.name %>"
  year:         "<%= app.year %>"
  copyright:    "&copy; <%= user.date %> <%= user.name %>. All rights reserved."
  robots:       "noodp,noydir,index,follow"
  github:       "<%= user.username %>"
  email:        "<%= user.email %>"
  
  titles:
    index: "%{name}"
    show: "%{name} overview"
    new: "Create a new %{name}"
    edit: "Editing %{name}"
  
  links:
    default: "%{name}"
    home: "Home"
    docs: "Docs"
  
  openGraph:
    siteName:       "<%= app.title %>"
    title:          "<%= app.title %>"
    description:    "<%= app.description %>"
    type:           "website"
    url:            ""
    image:          ""