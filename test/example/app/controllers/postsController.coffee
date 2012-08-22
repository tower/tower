class App.PostsController extends Tower.Controller
  @layout 'application'
  @param 'likeCount'
  @param 'rating', type: 'Number'
  @param 'title'
  @param 'sort', type: 'Order'
  @param 'published', type: 'Boolean'
  @param 'page', type: 'Number', allowRange: false, allowNegative: false
  @param 'limit', type: 'Number', allowRange: false, allowNegative: false

  @scope App.Post