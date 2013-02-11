var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var gaze = require('gaze');
var Gaze = gaze.Gaze;

function Watch(paths) {
    // Just to get a cleaner syntax:
    if(!(this instanceof Watch)) {
        return new Watch(paths);
    }

    this.isWatching = false;

    // Defaulted Options:
    var options = {
        paths: [],
        ignore: [],
        filters: [],
        events: {
            'changed': [],
            'removed': [],
            'added': [],
            'ready': [],
            'error': []
        },
        forcePolling: false,
        latency: null
    };

    if (typeof paths == "string") {
        options.paths.push(paths);
    } else {
        for (var i = 0; i<paths.length; i++) {
            options.paths.push(paths[i]);
        }
    }

    this.options = options;

    return this;
}

Watch.prototype.ignore = function(regex) {

    if(regex instanceof Array) {
        for(var i = 0; i < regex.length; i++) {
            this.options.ignore.push(regex[i]);
        }
    } else {
        this.options.ignore.push(regex);
    }

    return this;
};

Watch.prototype.latency = function(num) {
    this.options.latency = num;
    return this;
};

Watch.prototype.filter = function(regex) {

    if(regex instanceof Array) {
        for(var i = 0; i < regex.length; i++) {
            this.options.filters.push(regex[i]);
        }
    } else {
        this.options.filters.push(regex);
    }

    return this;
};

Watch.prototype.forcePolling = function(bool) {
    this.options.forcePolling = bool;
    return this;
}

Watch.prototype.start = function(callback) {
    var self = this;
    // XXX: Wondering if we should create multiple watchers
    //      for multiple paths. 
    this._instance = new Gaze(this.options.paths[0], {maxListeners:0});

    this._instance.on('ready', function(w) {
        self.emit('ready');
        self.isWatching = true;
    });

    this._instance.on('changed', function(filepath) {
        self.emit('changed', [filepath]);
    });

    this._instance.on('added', function(filepath) {
        self.emit('added', [filepath]);
    });

    this._instance.on('deleted', function(filepath) {
        self.emit('removed', [filepath]);
    });

    this._instance.on('all', function(filepath) {
        self.emit('all', [filepath]);
    });

    this._instance.on('error', function(err) {
        self.emit('error', [err]);
    });
}

Watch.prototype.emit = function(event, args) {
    if(!event) return false;

    if (this.options.events[event] == null) 
        return false;

    for(var i = 0; i < this.options.events[event].length; i++) {
        if(typeof this.options.events[event][i] == "function") {
            this.options.events[event][i].apply({}, args);
        }
    }
};

Watch.prototype.on = function(event, callback) {
    this.options.events[event].push(callback);
    return this;
}

module.exports = Watch;