formFor @post, (f) ->
  f.fieldset (fields) ->
    fields.field "title", as: "string"
  
  f.fieldset (fields) ->
    fields.submit "Submit"
