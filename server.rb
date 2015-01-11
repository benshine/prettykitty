require 'sinatra'
require 'haml'

get '/' do
  haml :kitties
end

get '/test' do
  haml :tests
end