# file named watch.rb
require 'rubygems'
require 'listen'

listener = Listen.to(Dir.pwd)
listener = listener.latency(0.2)
listener = listener.change do |modified, added, removed|
  puts modified, added, removed
end
listener.start