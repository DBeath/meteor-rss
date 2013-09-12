Template.feeds.feedList = function () {
    return Feeds.find();
};

Template.feeds.events({
    'click #addFeed': function() {
        Meteor.call('addFeed', $('#feedUrl').val());
        $("#feedUrl").val("");
    },
    'click input.removeFeed': function(){
        Feeds.remove(this._id);
    }
    
});

Template.overview.events({
    'click input.removeArticle': function(){
        Articles.remove(this._id);
    }
});


Template.overview.articles = function() {
    return Articles.find({}, {sort: [["published", "desc"]]});
};
