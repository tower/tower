class Tower.GithubDownloadStore extends Tower.Store
  @reopen
    configure: (options, callback) ->
      return if @isConfigured

      if typeof options == 'function'
        callback  = options
        options   = {}
      options ||= {}

      @_extractCredentials options, (error, key, secret) =>
        throw error if error

        @config =
          key:    key
          secret: secret

        @isConfigured = true

        callback.call(@) if callback

    # @example
    #   store.create(from: './file.js', to: 'file.0.1.0.js', name: 'a file')
    create: (criteria, callback) ->
      local = criteria.from

      @_createGitHubResource criteria, (response) =>
        data    = response.body

        # @todo conver this to knox
        # client  = Tower.module('knox').createClient
        command = """
          curl
          -F "key=#{data.path}"
          -F "acl=#{data.acl}"
          -F "success_action_status=201"
          -F "Filename=#{data.name}"
          -F "AWSAccessKeyId=#{data.accesskeyid}"
          -F "Policy=#{data.policy}"
          -F "Signature=#{data.signature}"
          -F "Content-Type=#{data.mime_type}"
          -F "file=@#{local}"
          https://github.s3.amazonaws.com/
        """.replace(/\n/g, ' ')

        # S3 only gives an XML response
        @_exec command, (error, data) =>
          if error
            return callback.call(@, error) if callback
            throw error

          process.nextTick =>
            callback.call(@, null, data) if callback

    find: (criteria, callback) ->
      @_normalizeCriteria(criteria)

      key     = @config.key
      secret  = @config.secret
      repo    = criteria.repo

      @_request(
        'get',
        "https://api.github.com/repos/#{key}/#{repo}/downloads?access_token=#{secret}"
      ).end (response) =>
        downloads = if _.isArray(response.body) then response.body else []
        callback.call(@, null, downloads)

      undefined

    update: (criteria, callback) ->
      @_normalizeCriteria(criteria)

      key     = @config.key
      secret  = @config.secret
      repo    = criteria.repo
      name    = criteria.name

      @find criteria, (error, downloads) =>
        existing  = _.detect downloads, (download) ->
          download.name == name

        if existing
          criteria.id = existing.id
          @destroy criteria, (response) =>
            delete criteria.id
            process.nextTick =>
              @create(criteria, callback)
        else
          @create(criteria, callback)

    # store.destroy(id: 'asdf')
    destroy: (criteria, callback) ->
      @_normalizeCriteria(criteria, false)

      key   = @config.key
      repo  = criteria.repo

      request = @_request(
        'del', 
        "https://api.github.com/repos/#{key}/#{repo}/downloads/#{criteria.id}?access_token=#{@config.secret}"
      )

      request.set('Content-Length', 0) # random, github wants this or will give 411 error

      request.end(callback)

    _createGitHubResource: (criteria, callback) ->
      @_normalizeCriteria(criteria)
      data    = @_buildGitHubResource(criteria)
      key     = @config.key
      secret  = @config.secret
      repo    = criteria.repo

      request = @_request(
        'post',
        "https://api.github.com/repos/#{key}/#{repo}/downloads?access_token=#{secret}"
      )

      request.send(data)

      request.end(callback)

    _buildGitHubResource: (criteria) ->
      @_normalizeCriteria(criteria)

      local     = criteria.from
      remote    = criteria.to

      # @todo '.coffee' returns as 'application/octet-stream', should be something better
      contentType = criteria.contentType || require('mime').lookup(local)

      size    = if criteria.size? then parseInt(criteria.size) else require('fs').statSync(local).size

      data    =
        name:         criteria.name
        size:         parseInt(size)
        content_type: contentType

      data.description = criteria.description if criteria.description?

      data

    _normalizeCriteria: (criteria, upload = true) ->
      throw new Error('Must specify the `from:` key, the path to the local file') if upload && !criteria.from?
      return criteria if criteria._normalized # tmp opt
      repo    = @config.repo || criteria.repo
      throw new Error('Must specify a GitHub repo: `create({repo: "my-project"})`') unless repo?
      criteria.repo = repo
      criteria.to  ||= require('path').basename(criteria.from) if upload
      criteria.name = if criteria.name? then criteria.name else criteria.to
      criteria._normalized = true
      criteria

    _extractCredentials: (options, callback) ->
      if typeof options == 'function'
        callback  = options
        options   = {}
      options ||= {}

      key     = options.key || options.username
      secret  = options.secret || options.token || options.password

      unless key? && secret?
        # @todo a cross-OS way of getting this info
        # git config --global github.token
        # 
        # This prints out the following:
        #   github.user <username>
        #   github.token <hash>
        @_exec 'git config --global --get-regexp github', (error, stdout) =>
          return callback(new Error("""
            Make sure you have created a GitHub token.
            git config --global github.token <hash>
          """)) if error

          stdout.split('\n').forEach (line) =>
            line.replace /^github\.(\w+)\s+(.+)$/, (__, configKey, configValue) =>
              switch configKey
                when 'user', 'username'
                  key     = configValue.trim()
                when 'token'
                  secret  = configValue.trim()

          options.key     ||= key
          options.secret    = secret

          callback.call(@, null, key, secret) if callback
      else
        options.key     ||= key
        options.secret  ||= secret

        callback.call(@, null, key, secret) if callback

    _request: (method, path) ->
      Tower.module('superagent')[method.toLowerCase()](path)

    _exec: (command, callback) ->
      require('child_process').exec command, callback
