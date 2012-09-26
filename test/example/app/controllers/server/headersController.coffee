class App.HeadersController extends App.ApplicationController
  acceptJSON: ->
    @render json: {}

  acceptUndefined: ->
    @render text: 'acceptUndefined'

  acceptCharsetUTF8: ->
    @render json: {}

  acceptCharsetISO: ->
    @render json: symbol: 'Œ'