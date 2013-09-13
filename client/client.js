Template.feeds.feedList = function () {
    return Feeds.find();
};

Template.articles.open_class = function(){
    return this.open ? "open" : "";
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
    },
    'click input.removeAll': function(){
        Meteor.call('removeAll');
    }
});

Template.articles.events({
    'click #article': function(){
        Articles.update(this._id, {$set: {open: !this.open}});
    }
})


Template.overview.articles = function() {
    return Articles.find({}, {sort: [["date", "desc"]]});
};
