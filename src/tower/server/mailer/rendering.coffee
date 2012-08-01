Tower.Mailer.Rendering =
  ClassMethods:
    config: {}

    transport: ->
      return @_transport if @_transport

      config = @config = Tower.Mailer.config[Tower.env] || {}

      @_transport = require('nodemailer').createTransport 'SMTP', config

    # @todo https://github.com/andris9/Nodemailer/
    # 
    # Rails makes this an object but I don't see the use case for that now.
    # If you do, please tell! (since Nodemailer is doing everything with just a hash).
    # 
    # from - The e-mail address of the sender. All e-mail addresses can be plain sender@server.com or formatted Sender Name <sender@server.com>
    # to - Comma separated list of recipients e-mail addresses that will appear on the To: field
    # cc - Comma separated list of recipients e-mail addresses that will appear on the Cc: field
    # bcc - Comma separated list of recipients e-mail addresses that will appear on the Bcc: field
    # replyTo - An e-mail address that will appear on the Reply-To: field
    # inReplyTo - The message-id this message is replying
    # references - Message-id list
    # subject - The subject of the e-mail
    # text - The plaintext version of the message
    # html - The HTML version of the message
    # generateTextFromHTML - if set to true uses HTML to generate plain text body part from the HTML if the text is not defined
    # headers - An object of additional header fields {"X-Key-Name": "key value"} (NB! values are passed as is, you should do your own encoding to 7bit if needed)
    # attachments - An array of attachment objects.
    # envelope - optional SMTP envelope, if auto generated envelope is not suitable
    # messageId - optional Message-Id value, random value will be generated if not set. Set to false to omit the Message-Id header
    # encoding - optional transfer encoding for the textual parts (defaults to "quoted-printable")
    # 
    # template - path to template for rendering
    # locals
    mail: (options = {}, callback) ->
      @render options, (error, options) =>
        @transport().sendMail(options)

    render: (options, callback) =>
      template = options.template
      delete options.template

      if template
        locals = options.locals || {}
        delete options.locals
        Tower.modules.mint path: template, locals: locals, (error, result) =>
          options.html = result
          callback.call(@, error, options)
      else
        callback.call(@, null, options)

module.exports = Tower.Mailer.Rendering
