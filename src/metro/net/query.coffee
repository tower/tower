class Metro.Net.Query
  @perPage          = 20
  @sortDirection    = "ASC"
  @sortKey          = "sort"                 # or "order", etc.
  @limitKey         = "limit"                # or "perPage", etc.
  @pageKey          = "page"
  @separator         = "_"                    # or "-"
  
  # this is not used, just thinking...
  # nested relationships as user[location][city]=san+diego
  @operators         =  
    gte             : ":value..t",          
    gt              : ":value...t",         
    lte             : "t..:value",          
    lte             : "t...:value",         
    rangeInclusive : ":i..:f",             # count=0..4
    rangeExclusive : ":i...:f",            # date=2011-08-10...2011-10-03
    in              : [",", "+OR+"],        # tags=ruby,javascript and tags=ruby+OR+javascript
    nin             : "-",                  # tags=-ruby,-javascript and tags=ruby+OR+javascript
    all             : "[:value]",           # tags=[ruby,javascript] and tags=ruby+AND+javascript
    nil             : "[-]",                # tags=[-]
    notNil         : "[+]",                # tags=ruby,[+]
    asc             : ["+", ""],
    desc            : "-",
    geo             : ":lat,:lng,:radius"   # geo=20,-50,7

module.exports = Metro.Net.Query
