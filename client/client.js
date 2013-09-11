Template.feeds.feedList = function () {
    return Feeds.find();
};

Template.feeds.events({
    'click #addFeed': function() {
        Meteor.call('addFeed', $('#feedUrl').val());
        $("#feedUrl").val("");
    },
    'click input.remove': function(){
        Feeds.remove(this._id);
    }
});


Template.overview.articles = function() {
    return Articles.find({}, {sort: [["published", "desc"]]});
};
