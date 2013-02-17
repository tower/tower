(function() {

    function Container() {

        this.map = {};
        this.resources = {
            controller: {},
            model: {},
            template: {},
            view: {}
        };

        this.get = function (key) {
            return this.map[key];
        };

        this.set = function (key, value) {
            this.map[key] = value;
        };

        this.lookup = function (type, resource) {
            if (this.resources[type]) {
                if (this.resources[type][resource]) {
                    return this.resources[type][resource];
                }
            }
        };

        this.resource = function (type, resource, value) {
            if (!this.resources[type])
            {
                this.resources[type] = {};
            }
            this.resources[type][resource] = value;
        }

        this.alias = function alias(name) {
            return createAlias(this, name);
        };

    };

    function createAlias(container, aliasName) {
        return new Proxy(

        function() {
            return container.get(aliasName);
        }, {
            get: function(target, name) {
                return createAlias(container, aliasName + '.' + name);
            },
            set: function(target, name, value) {
                container.set(aliasName + '.' + name, value);
            }
        });
    }

    Tower.Container = Container;
})();