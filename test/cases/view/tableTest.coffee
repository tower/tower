require '../../config'

view = null
user = null

describe 'Tower.View.Table', ->
  beforeEach ->
    view = new Tower.View
    user = new App.User(id: 1, firstName: "Lance")
    
  test '#tableFor("users")', ->
    template = ->
      tableFor("users")
    
    view.render template: template, (error, result) ->
      throw error if error
      assert.equal result, '''
<table summary="Table for Users" role="grid" class="table">
</table>

'''
  test '#tableFor("users") with thead', ->
    template = ->
      tableFor "users", (t) ->
        t.head ->
    
    view.render template: template, (error, result) ->
      throw error if error
      assert.equal result, '''
<table summary="Table for Users" role="grid" class="table">
  <thead>
  </thead>
</table>

'''

  test '#tableFor("users") with thead and header rows', ->
    template = ->
      tableFor "users", (t) ->
        t.head ->
          t.row ->
            t.header "Header A"
            t.header "Header B", abbr: "HB"
    
    view.render template: template, (error, result) ->
      throw error if error
      assert.equal result, '''
<table summary="Table for Users" role="grid" class="table">
  <thead>
    <tr scope="row">
      <th abbr="Header A" role="columnheader" scope="col" aria-sort="none">
        <span>Header A</span>
      </th>
      <th abbr="HB" role="columnheader" scope="col" aria-sort="none">
        <span>Header B</span>
      </th>
    </tr>
  </thead>
</table>

'''

  test '#tableFor("users") with sorting', ->
    template = ->
      tableFor "users", (t) ->
        t.head ->
          t.row ->
            t.header "Header A", sort: true
            t.header "Header B"
    
    view.render template: template, (error, result) ->
      throw error if error
      assert.equal result, '''
<table summary="Table for Users" role="grid" class="table">
  <thead>
    <tr scope="row">
      <th abbr="Header A" role="columnheader" scope="col" class="sortable asc" aria-sort="asc" aria-selected="aria-selected">
        <a href="?sort=asc">
          <span>Header A</span>
        </a>
      </th>
      <th abbr="Header B" role="columnheader" scope="col" aria-sort="none">
        <span>Header B</span>
      </th>
    </tr>
  </thead>
</table>

'''

  test '#tableFor("users") with body', ->
    template = ->
      tableFor "users", (t) ->
        t.body ->
          t.row ->
            t.cell "Cell A"
            t.cell "Cell B"
    
    view.render template: template, (error, result) ->
      throw error if error
      assert.equal result, '''
<table summary="Table for Users" role="grid" class="table">
  <tbody>
    <tr scope="row" role="row">
      <td role="gridcell">Cell A</td>
      <td role="gridcell">Cell B</td>
    </tr>
  </tbody>
</table>

'''

  test '#tableFor("users") with footer', ->
    template = ->
      tableFor "users", (t) ->
        t.foot ->
          t.row ->
            t.cell "Cell A"
            t.cell "Cell B"
    
    view.render template: template, (error, result) ->
      throw error if error
      assert.equal result, '''
<table summary="Table for Users" role="grid" class="table">
  <tfoot>
    <tr scope="row">
      <td role="gridcell">Cell A</td>
      <td role="gridcell">Cell B</td>
    </tr>
  </tfoot>
</table>

'''

  test '#tableFor("users") with head, body, and foot', ->
    template = ->
      tableFor "users", (t) ->
        t.head ->
          t.row ->
            t.header "Header A"
            t.header "Header B"
        t.body ->
          t.row ->
            t.cell "Cell A"
            t.cell "Cell B"
        t.foot ->
          t.row ->
            t.cell "Cell A"
            t.cell "Cell B"
    
    view.render template: template, (error, result) ->
      throw error if error
      assert.equal result, '''
<table summary="Table for Users" role="grid" class="table">
  <thead>
    <tr scope="row">
      <th abbr="Header A" role="columnheader" scope="col" aria-sort="none">
        <span>Header A</span>
      </th>
      <th abbr="Header B" role="columnheader" scope="col" aria-sort="none">
        <span>Header B</span>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr scope="row" role="row">
      <td role="gridcell">Cell A</td>
      <td role="gridcell">Cell B</td>
    </tr>
  </tbody>
  <tfoot>
    <tr scope="row">
      <td role="gridcell">Cell A</td>
      <td role="gridcell">Cell B</td>
    </tr>
  </tfoot>
</table>

'''