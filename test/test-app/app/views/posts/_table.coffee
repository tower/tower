tableFor "posts", (t) ->
  t.head ->
    t.row ->
      t.cell "title", sort: true
      t.cell()
      t.cell()
      t.cell()
  t.body ->
    for post in @posts
      t.row ->
        t.cell -> post.get("title")
        t.cell -> linkTo 'Show', urlFor(post)
        t.cell -> linkTo 'Edit', urlFor(post, action: "edit")
        t.cell -> linkTo 'Destroy', urlFor(post), method: "delete"
        
  linkTo 'New Post', urlFor(App.Post, action: "new")
