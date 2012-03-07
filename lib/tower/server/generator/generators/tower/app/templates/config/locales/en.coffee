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
  
  openGraph:
    siteName:       "<%= app.title %>"
    title:          "<%= app.title %>"
    description:    "<%= app.description %>"
    type:           "website"
    url:            ""
    image:          ""