var _;

_ = Tower._;

Tower.ModelQueue = {
  ClassMethods: {
    enqueue: function() {
      var args, callback, job, jobs, klass, method, options, queue,
        _this = this;
      args = _.args(arguments);
      options = args.shift();
      if (typeof options !== 'object') {
        method = options;
        options = {};
      } else {
        method = options.method;
        args = options.args;
      }
      callback = options.complete || _.extractBlock(args);
      klass = this.className();
      jobs = Tower.queue || (Tower.queue = Tower.module('kue').createQueue());
      queue = options.queue || (_.camelize(klass) + '.' + method);
      job = jobs.create(queue, {
        klass: klass,
        method: method,
        args: args,
        async: !!callback
      });
      if (options.delay != null) {
        job.delay(options.delay);
      }
      if (options.priority != null) {
        job.priority(options.priority);
      }
      if (options.attempts != null) {
        job.attempts(options.attempts);
      }
      if (options.progress) {
        job.on('progress', options.progress);
      }
      job.on('failed', function() {
        var message;
        message = 'Job failed';
        if (callback) {
          return callback.call(job, new Error(message));
        } else {
          return console.log(message, job);
        }
      });
      job.on('complete', function() {
        if (callback) {
          return callback.call(job, null);
        }
      });
      return job.save();
    }
  },
  enqueue: function() {
    var _ref;
    return (_ref = this.constructor).enqueue.apply(_ref, arguments);
  }
};

module.exports = Tower.ModelQueue;
