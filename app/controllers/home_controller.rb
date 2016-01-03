class HomeController < ApplicationController
	before_action :get_client, only: [:visualize]
	def index
	end

	def visualize
		user = params[:username] ? params[:username] : 'ramyabandaru'
		repos = Array.new
		langs = Hash.new
		@client.repositories(user = user).each do |repo|
			repos << repo.name
			@client.languages(user + '/' + repo.name).each do |lang, value|
				if langs.keys.include? lang
					langs[lang] += value
				else
					langs[lang] = value
				end
			end
		end
		render json: {
			model: langs
		}
	end

	private
	def get_client
		@client = Octokit::Client::new(access_token: '773ed516605152e57b81e891c77c74b3506c15c8')
	end
end
