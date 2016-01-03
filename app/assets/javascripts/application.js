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


		function charInitialize(dataset) {
			$('#chart').highcharts({
				chart: {
					type: 'column'
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
			$.get("https://api.github.com/users/"+ searchterm + "/repos", function(data, status){
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


		// char starts here
		var dataset = [];
		var margin = {
			top: 70,
			left: 100,
			right: 20,
			botton: 60
		};
		var w = 600 - margin.left - margin.right;
		var h = 500 - margin.top - margin.bottom;

		// SVG
		var svg = d3.select("div#chart").append("svg").attr("width", w + margin.left + margin.right).attr("height", h + margin.top + margin.bottom);

		var xScale = d3.scale.ordinal().domain(dataset.map(function(d) { return d.key })).rangeRoundBands([margin.left + w], 0.05);
		var yScale = d3.scale.linear().domain([0, d3.max(dataset, function(d) { return d.value; })]).range([h, margin.top]);

		//define x y axis
		var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
		var yAxis = d3.svg.axis().scale(yScale).orient("left");
	});
});