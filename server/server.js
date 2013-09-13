var FeedParser = Npm.require('feedparser')
	, request = Npm.require('request')
	, fs = Npm.require('fs')
	, Fiber = Npm.require('fibers');

var addArticle = function(feed) {
	return function(article){
		Fiber(function(){
			Articles.insert({
				title: article.title,
				date: article.date
			});
		}).run();
	};
};

var readFeed = function(feed){
	request(feed)
		.pipe(new FeedParser([]))
		.on('error', function (error) {
		   	 console.log(error);
		})
		.on('meta', function (meta) {
		    	console.log('===== %s =====', meta.title);
		})
		.on('readable', function() {
			var stream = this, item;
			while (item = stream.read()) {
		      	console.log('Got article: %s', item.title || item.description);
		      	Fiber(function(){
		      		Articles.insert({
		      			title: item.title,
		      			date: item.date,
		      			content: item.description
		      		});
		      	}).run();	
		    	}
  		});
};

var removeAllArticles = function(){
	Articles.remove({});
};

Meteor.methods({
  "addFeed": function(url) {
      Feeds.insert({name: url });
      try {
      	readFeed(url);
      } catch(e) {
      	console.error(e);
          console.log("Invalid URL: " + url);
      }
  },
  "removeAll": function(){
  	removeAllArticles();
  }
});

Meteor.startup(function () {
// code to run on server at startup
});