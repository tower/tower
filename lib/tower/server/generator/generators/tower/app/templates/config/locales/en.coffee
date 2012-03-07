module.exports =
  title:        "<%= project.title %>"
  description:  "<%= project.description %>"
  keywords:     "<%= project.keywords %>"
  author:       "<%= user.name %>"
  copyright:    "&copy; <%= user.date %> <%= user.name %>. All rights reserved."
  robots:       "noodp,noydir,index,follow"
  github:       "<%= user.username %>"
  email:        "<%= user.email %>"
  
  openGraph:
    siteName:       "<%= project.title %>"
    title:          "<%= project.title %>"
    description:    "<%= project.description %>"
    type:           "website"
    url:            ""
    image:          ""