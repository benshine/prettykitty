require 'sinatra'
require 'haml'

get '/' do
  haml :kitties
end