// var Feedparser = Npm.require('feedparser')
// 	, request = Npm.require('request')
// 	, fs = Npm.require('fs')
// 	, Fiber = Npm.require('fibers');

var request = Npm.require('request'),
	fs = Npm.require('fs'),
	Fiber = Npm.require('fibers');


// Adds a new feed.
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

// Adds a new article to the feed.
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
			author: article.author,
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

// Reads the feed and updates the articles.
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
	  	updateUnreadCount(feed);
	  	return "Feed updated";
	} else {
		return "Feed does not exist";
	}
};

// Removes all articles.
var removeAllArticles = function(){
	Articles.remove({});
	updateAllUnreadCount();
	return "All articles removed";
};

// Updates the unread count of a feed.
var updateUnreadCount = function(feed){
	var unreadCount = Articles.find({feedId: feed._id, read: false}).count();
	Feeds.update(feed._id, {$set: {unread: unreadCount}});
};

// Updates the unread count of all feeds.
var updateAllUnreadCount = function(){
	Feeds.find({userId: this.userId}).forEach(updateUnreadCount);
};

var markAllRead = function(feed){
	Articles.update({feedId: feed._id}, {$set: {read: true}}, {multi: true});
	updateUnreadCount(feed);
	return "Marked all read";
};

// Publish the user's feeds.
Meteor.publish("feeds", function(){
	return Feeds.find({userId: this.userId});
});

// Publish the user's articles.
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

	markAllRead: function(feed){
		return markAllRead(feed);
	}
});

Meteor.startup(function () {
// code to run on server at startup
});