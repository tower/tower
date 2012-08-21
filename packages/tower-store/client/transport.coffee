# Don't know the best way to implement this yet (where it goes, methods it should have, etc.),
# but this should work now.
# 
# Down the road this maybe should be customizable on a per-model basis, 
# but that's too abstract for my head right now.
# 
# For now, the default implementation is blank, and if you want to use Ajax
# then set `Tower.NetConnection.include(Tower.StoreAjaxTransport)`
Tower.StoreTransport = {}

require './transport/ajax'
