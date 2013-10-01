
// Publish the user's feeds.
Meteor.publish("feeds", function(){
	return Feeds.find({userId: this.userId});
});

// Publish the user's articles.
Meteor.publish("articles", function(feedId){
	return Articles.find({feedId: feedId, userId: this.userId});
});


Articles.allow({
	update: function(userId, doc, fieldNames, modifier ){
		return doc.userId == userId;
	}
});

Feeds.allow({
	update: function(userId, doc, fieldNames, modifier){
		return doc.userId == userId;
	},
	remove: function(userId, doc){
		return doc.userId == userId;
	}
});