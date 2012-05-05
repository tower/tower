
Tower.Model.Queue = {
  ClassMethods: {
    enqueue: function() {
      var args, jobs, klass, kue, method, options, queue;
      args = _.args(arguments);
      options = args.shift();
      if (typeof options !== 'object') {
        method = options;
        options = {};
      } else {
        method = args.shift();
      }
      klass = this.className();
      kue = Tower.modules.kue;
      jobs = kue.createQueue();
      queue = options.queue || _.parameterize(klass);
      return jobs.create(queue, {
        klass: klass,
        method: method,
        args: args
      }).save();
    }
  },
  enqueue: function() {
    var _ref;
    return (_ref = this.constructor).enqueue.apply(_ref, arguments);
  }
};

module.exports = Tower.Model.Queue;
