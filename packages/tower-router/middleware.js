function RouterMiddleware(req, res, next) {
    RouterMiddleware.render(req, res, next);
}

_.extend(RouterMiddleware, {

    /**
     * Find the appropriate route and it's body of methods.
     * @param  {Request Object}   req
     * @param  {Response Object}   res
     * @param  {Function} next
     * @return {null}
     */
    find: function(req, res, callback) {
        // Tie into the route's find method.
        // XXX: Waiting for the router's implementation.
        callback.apply({});
    },


    render: function(req, res, next) {

        RouterMiddleware.find(req, res, function(route) {

            if (route) {

                if (res.statusCode !== null) {
                    console.log(1);
                  res.route = route;
                  res.writeHead(route.status, route.headers);
                  res.write(route.body);
                  res.end();
                  return route.clear();
                }
            }

        });

    }

});




module.exports = RouterMiddleware;