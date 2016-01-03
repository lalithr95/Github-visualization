class HomeController < ApplicationController
	before_action :get_client, only: [:visualize]
	def index
	end

	def visualize
		user = params[:username] ? params[:username] : 'ramyabandaru'
		repos = Array.new
		langs = Hash.new
		@client.repositories(user = user).each do |repo|
			if !repo.fork
				repos << repo.name
				@client.languages(user + '/' + repo.name).each do |lang, value|
					if langs.keys.include? lang
						langs[lang] += value
					else
						langs[lang] = value
					end
				end
			end
		end
		render json: {
			model: langs
		}
	end

	private
	def get_client
		@client = Octokit::Client::new(access_token: ENV['access_token'])
	end
end
