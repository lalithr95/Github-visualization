// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

$(document).ready(function(){
	$("#search").click(function() {
		var searchterm = $("#term").val() ? $("#term").val() : "Lalithr95";
		clear();
		getDefaultLanguages(drawDefaultGraph);
		var repos = [];
		var langs = new Object();

		function getDefaultLanguages(callback) {
			$.get("/visualize/" + searchterm, function(data) {
				success: callback(data.model);
			});
		};

		function drawDefaultGraph(data) {
			$("#chart").html("");
			$("#chart").highcharts({
				chart: {
					type: 'column'
				},
				credits: {
					enabled: false
				},
				title: {
					text: "Github Visualization"
				},
				xAxis: {
					title: {
						text: 'Languages'
					},
					categories: Object.keys(data)
				},
				yAxis: {
					title: {
						text: 'Insertions'
					}
				},
				series: [{
					data: Object.keys(data).map(function(key) {
						return data[key];
					})
				}]
			});
		};

		console.log(langs);
		// for clear
		$('#clear').click(function(e) {
			e.preventDefault();
			$("#term").text("");
			$("#username").html("");
			$("#repoDetails").html("");
			$("#chart").html("");
		});

		function clear() {
			$("#term").text("");
			$("#username").html("");
			$("#repoDetails").html("");
			$("#chart").html("");
		}


		function charInitialize(dataset) {
			$('#chart').highcharts({
				chart: {
					type: 'column'
				},
				credits: {
					enabled: false
				},
				title: {
					text: "Github Visualization"
				},
				xAxis: {
					title: {
						text: 'Languages'
					},
					categories: Object.keys(dataset)
				},
				yAxis: {
					title: {
						text: 'Insertions'
					}
				},
				series: [
					{
						data: Object.keys(dataset).map(function(key) {
							return dataset[key];
						})
					}
				]
			});
		};

		function getUserData(callback) {
			$.get("https://api.github.com/users/" + searchterm, function(data, status) {
				console.log(data);
				success: callback(data, status);
			});
		};

		function getUserRepos(callback) {
			$.get("https://api.github.com/users/"+ searchterm + "/repos?per_page=100", function(data, status){
				console.log(data);
				success: callback(data, status);
			});
		};

		function getRepoLang(callback, repo) {
			$.get("https://api.github.com/repos/" + searchterm + "/" + repo + "/languages", function(data, status){
				console.log(data);
				success: callback(data, status, repo);
			});
		};
		
		function showUser(data, status) {
			console.log(status);
			var username = "<h3>" + data.name + "</h3>";
			$("#username").append(username);
		};

		function showRepos(data , status) {
			console.log(status);
			for(var i=0; i < data.length; i++) {
				$("#repoDetails").append("<li class='repo"+ i + "'>" + data[i].name + "</li>");
			};
			$("#repoDetails").children().click(function(){
				var repoChoice = $(this).html();
				getRepoLang(showLang, repoChoice);
			});
		};

		function showLang(data, status, repo) {
			var dataset = [];
			for(var key in data) {
				console.log(key + " " + data[key]);
				dataset[key] = data[key];
			};
			charInitialize(dataset);
		};

		getUserData(showUser);
		getUserRepos(showRepos);
	});
});