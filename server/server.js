var feedparser = Npm.require('feedparser');

var addArticle = function(feed) {
	return function(article){
		Fiber(function(){
			Articles.insert({
				headline: article.title,
				published: article.date
			});
		}).run();
	};
};

Meteor.methods({
  "addFeed": function(url) {
      Feeds.insert({name: url });
      try {
          feedparser.parseUrl(url).on('meta', addArticle(url));
      } catch(e) {
          console.log("Invalid URL: " + url);
      }
  }
});

Meteor.startup(function () {
// code to run on server at startup
});