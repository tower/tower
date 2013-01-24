module.exports = (function() {
    return (function() {

        return function Container() {

            var map = {};

            this.get = function get(key) {
                return map[key];
            };

            this.set = function set(key, value) {
                map[key] = value;
            };

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

    })();
})();