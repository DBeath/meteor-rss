// var Feedparser = Npm.require('feedparser')
// 	, request = Npm.require('request')
// 	, fs = Npm.require('fs')
// 	, Fiber = Npm.require('fibers');

var request = Npm.require('request'),
	fs = Npm.require('fs'),
	Fiber = Npm.require('fibers');

function done(err, result){
    if(err){
        console.log(err);
    } else if(result) {
        console.log(result);
    }
};

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
			pubdate: article.pubdate,
			author: article.author,
			content: article.description,
			link: article.link,
			origlink: article.origlink,
			feedId: feed._id,
			userId: feed.userId,
			summary: article.summary,
			guid: article.guid,
			read: false, 
			starred: false,
			comments: article.comments,
			image: article.image,
			categories: article.categories,
			source: article.source,
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
	Articles.remove({}, done);
	updateAllUnreadCount(done);
	return "All articles removed";
};

// Updates the unread count of a feed.
var updateUnreadCount = function(feed, done){
	var unreadCount = Articles.find({feedId: feed._id, read: false}).count();
	Feeds.update(feed._id, {$set: {unread: unreadCount}});
};

// Updates the unread count of all feeds.
var updateAllUnreadCount = function(done){
	Feeds.find({userId: this.userId}).forEach(updateUnreadCount);
};

// Marks all articles in a feed as read.
var markAllRead = function(feed){
	Articles.update({feedId: feed._id}, {$set: {read: true}}, {multi: true}, done);
	updateUnreadCount(feed, done);
	return "Marked all read";
};

var markRead = function(articleId, done){
	var article = Articles.findOne({_id: articleId}, done);
	if (!article.read) {
		Articles.update(article._id, {$set: {read: true}}, done);
		Feeds.update(article.feedId, {$inc: {unread: -1}}, done);
	};
};

var removeFeed = function(feed, done){
	Feeds.remove(feed._id);
	Articles.remove({feedId: feed._id, starred: false}, done);
};

var removeArticle = function(articleId, done){
	Articles.remove(articleId);
};

Meteor.methods({
	addFeed: function(url) {
		return addFeed(url, this.userId);
	},

	removeFeed: function(feed){
		return removeFeed(feed, done);
	},

	removeAll: function(){
		return removeAllArticles();
	},

	refreshFeed: function(feed){
		return readFeed(feed);
	},

	markAllRead: function(feed){
		return markAllRead(feed);
	},

	markRead: function(articleId){
		return markRead(articleId, done);
	}
});

Meteor.startup(function () {
// code to run on server at startup
});