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

Tower.View.include Tower.ViewRendering
Tower.View.include Tower.ViewAssetHelper
Tower.View.include Tower.ViewComponentHelper
Tower.View.include Tower.ViewEmberHelper
Tower.View.include Tower.ViewHeadHelper
Tower.View.include Tower.ViewRenderingHelper
Tower.View.include Tower.ViewStringHelper

Tower.View.helper Tower.ViewAssetHelper
Tower.View.helper Tower.ViewComponentHelper
Tower.View.helper Tower.ViewEmberHelper
Tower.View.helper Tower.ViewHeadHelper
Tower.View.helper Tower.ViewRenderingHelper
Tower.View.helper Tower.ViewStringHelper
