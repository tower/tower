head ->
  meta charset: "utf-8"
  
  title t("title")
  
  meta name: "description", content: t("description")
  meta name: "keywords", content: t("keywords")
  meta name: "robots", t("robots")
  meta name: "author", t("author")
  
  stylesheets "lib", "application"
  #if browserIs("firefox")
  #  stylesheets "font"

  #if contentFor "headStyleSheets"
  #  yield "headStyleSheets"
  
  script src: "https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"
  
  javascripts "vendor", "application"
  
  if Tower.env == "development"
    javascripts "development"
    
  #if contentFor "headJavaScripts"
  #  yield "headJavaScripts"