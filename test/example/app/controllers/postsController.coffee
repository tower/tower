class App.PostsController extends Tower.Controller
  @layout 'application'
  @param 'likeCount'
  @param 'rating', type: 'Number'
  @param 'title'
  @param 'sort', type: 'Order'