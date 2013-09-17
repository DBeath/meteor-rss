var Feedparser = Npm.require('feedparser')
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

var addFeed = function(url, userId){
	if(Feeds.findOne({url: url, userId: userId})) return false;
		request(url).pipe(new Feedparser([]))
			.on('meta', function(meta){
				Fiber(function(){
					Feeds.insert({
						title: meta.title,
						url: url,
						userId: userId
					}, function(err, feedId){
						if(feedId) {
							readFeed(feeds.findOne({_id: feedId}));
						}
					});
				}).run();
			});
};

var addArticle = function(article, feed){
	Fiber(function(){
		if(articles.findOne({feedId: feed._id, guid: article.guid})) return false;
		Articles.insert({
			title: item.title,
			date: item.date,
			content: item.description,
			link: item.link,
			feedId: feedId._id,
			userId: feed.userId,
			summary: article.summary,
			guid: article.guid,
			read: false
		});
	}).run();
};

var readFeed = function(feed){
	request(feed.url)
		.pipe(new Feedparser([]))
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
			      			content: item.description,
			      			link: item.link,
			      			read: false,
			      		});
			      	}).run();	
		    	}
  		});
};

var removeAllArticles = function(){
	Articles.remove({});
};

Meteor.methods({
	'addFeed': function(url) {
		// Feeds.insert({name: url });
		// try {
		// 	readFeed(url);
		// } catch(e) {
		// 	console.error(e);
		//     console.log("Invalid URL: " + url);
		// }
		addFeed(url, this.userId);
	},
	'removeAll': function(){
		removeAllArticles();
	}
});

Meteor.startup(function () {
// code to run on server at startup
});