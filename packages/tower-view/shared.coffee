require './shared/view'
require './shared/rendering'
require './shared/component'
require './shared/table'
require './shared/form'
require './shared/helpers/assetHelper'
require './shared/helpers/componentHelper'
require './shared/helpers/elementHelper'
require './shared/helpers/emberHelper'
require './shared/helpers/headHelper'
require './shared/helpers/renderingHelper'
require './shared/helpers/stringHelper'

Tower.View.include Tower.View.Rendering
Tower.View.include Tower.View.AssetHelper
Tower.View.include Tower.View.ComponentHelper
Tower.View.include Tower.View.EmberHelper
Tower.View.include Tower.View.HeadHelper
Tower.View.include Tower.View.RenderingHelper
Tower.View.include Tower.View.StringHelper

Tower.View.helper Tower.View.AssetHelper
Tower.View.helper Tower.View.ComponentHelper
Tower.View.helper Tower.View.EmberHelper
Tower.View.helper Tower.View.HeadHelper
Tower.View.helper Tower.View.RenderingHelper
Tower.View.helper Tower.View.StringHelper
