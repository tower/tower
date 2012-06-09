require './store/transport'
require './store/localStorage'

# If you want to sync with Ajax, you must set the data transporter
# (need to find a better way to do this automatically)
# Tower.Store.Memory.transport = Tower.Store.Transport.Ajax