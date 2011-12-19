Coach.Net.Route.Urls =
  ClassMethods:    
    # Generate a url based on the options provided, default_url_options and the
    # routes defined in routes.rb. The following options are supported:
    #
    # * <tt>:only_path</tt> - If true, the relative url is returned. Defaults to +false+.
    # * <tt>:protocol</tt> - The protocol to connect to. Defaults to 'http'.
    # * <tt>:host</tt> - Specifies the host the link should be targeted at.
    #   If <tt>:only_path</tt> is false, this option must be
    #   provided either explicitly, or via +default_url_options+.
    # * <tt>:subdomain</tt> - Specifies the subdomain of the link, using the +tld_length+
    #   to split the subdomain from the host.
    #   If false, removes all subdomains from the host part of the link.
    # * <tt>:domain</tt> - Specifies the domain of the link, using the +tld_length+
    #   to split the domain from the host.
    # * <tt>:tld_length</tt> - Number of labels the TLD id composed of, only used if
    #   <tt>:subdomain</tt> or <tt>:domain</tt> are supplied. Defaults to
    #   <tt>ActionDispatch::Http::URL.tld_length</tt>, which in turn defaults to 1.
    # * <tt>:port</tt> - Optionally specify the port to connect to.
    # * <tt>:anchor</tt> - An anchor name to be appended to the path.
    # * <tt>:trailing_slash</tt> - If true, adds a trailing slash, as in "/archive/2009/"
    #
    # Any other key (<tt>:controller</tt>, <tt>:action</tt>, etc.) given to
    # +url_for+ is forwarded to the Routes module.
    #
    # Examples:
    #
    #    url_for :controller => 'tasks', :action => 'testing', :host => 'somehost.org', :port => '8080'
    #    # => 'http://somehost.org:8080/tasks/testing'
    #    url_for :controller => 'tasks', :action => 'testing', :host => 'somehost.org', :anchor => 'ok', :only_path => true
    #    # => '/tasks/testing#ok'
    #    url_for :controller => 'tasks', :action => 'testing', :trailing_slash => true
    #    # => 'http://somehost.org/tasks/testing/'
    #    url_for :controller => 'tasks', :action => 'testing', :host => 'somehost.org', :number => '33'
    #    # => 'http://somehost.org/tasks/testing?number=33'
    urlFor: (options) ->
      switch typeof(options)
        when "string"
          options
        else
          # https://github.com/kieran/barista/blob/master/lib/route.js#L157
          {controller, action, host, port, anchor} = options

module.exports = Coach.Net.Route.Urls
