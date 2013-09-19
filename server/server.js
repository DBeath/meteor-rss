var Feedparser = Npm.require('feedparser')
	, request = Npm.require('request')
	, fs = Npm.require('fs')
	, Fiber = Npm.require('fibers');



var addFeed = function(url, userId){
	if( !(Feeds.findOne({url: url, userId: userId})) ){
		request(url)
			.pipe(new Feedparser([]))
			.on('meta', function(meta){
				Fiber(function(){
					Feeds.insert({
						title: meta.title,
						url: url,
						userId: userId,
						unread: 0
					}, function(err, feedId){
						if(feedId) {
							readFeed(Feeds.findOne({_id: feedId}));
						}
					});
				}).run();
			})
			.on('error', function(error){
				console.log(error);
			});
		return "Added feed " + url;
	} else {
		return "Feed " + url + " already exists.";
	}
};

var addArticle = function(article, feed){
	Fiber(function(){
		if(Articles.findOne({feedId: feed._id, guid: article.guid})) return false;
		var date = null;
		if (article.date){
			date = article.date;
		} else {
			date = article.pubdate;
		};
		Articles.insert({
			title: article.title,
			date: date,
			content: article.description,
			link: article.link,
			feedId: feed._id,
			userId: feed.userId,
			summary: article.summary,
			guid: article.guid,
			read: false
		});
		Feeds.update(feed._id, {$inc: {unread: 1}});
	}).run();
};

var readFeed = function(feed){
	if(Feeds.findOne({_id: feed._id})){
		request(feed.url)
			.pipe(new Feedparser([]))
			.on('error', function (error) {
			   	return error;
			})
			.on('readable', function() {
				var stream = this, item;
				while (item = stream.read()) {
					addArticle(item, feed);      	
			    }
	  		});
	  	return "Feed updated";
	} else {
		return "Feed does not exist";
	}
};

var removeAllArticles = function(){
	Articles.remove({});
	updateAllUnreadCount();
	return "All articles removed";
};

var updateUnreadCount = function(feed){
	var unreadCount = Articles.find({feedId: feed._id, read: false}).count();
	Feeds.update(feed._id, {$set: {unread: unreadCount}});
};

var updateAllUnreadCount = function(){
	Feeds.find({}).forEach(updateUnreadCount);
}

Meteor.publish("feeds", function(){
	return Feeds.find({userId: this.userId});
});

Meteor.publish("articles", function(feedId){
	return Articles.find({feedId: feedId, userId: this.userId});
})

Meteor.methods({
	addFeed: function(url) {
		return addFeed(url, this.userId);
	},

	removeFeed: function(feed){
		Feeds.remove(feed._id);
	},

	removeAll: function(){
		return removeAllArticles();
	},

	refreshFeed: function(feed){
		return readFeed(feed);
	},

	markOneRead: function(feedId){
		Feeds.update(feedId, {$inc: {unread: -1}});
		return "Marked read";
	}
});

Meteor.startup(function () {
// code to run on server at startup
});