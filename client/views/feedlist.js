/// feedList ///

Template.feedList.feedList = function(){
    return Feeds.find();
};

Template.feedList.current = function(){
    return Session.equals('current_feed', this._id);
};

Template.feedList.events({
    'click #addFeed': function(){
        Meteor.call('addFeed', $('#feedUrl').val(), done);
        $("#feedUrl").val("");
    },
    'click span.removeFeed': function(){
        Meteor.call('removeFeed', this, done);
        Session.set('current_feed', null);
    },
    'click .feed': function(){
        Session.set('current_feed', this._id);
        Meteor.call('refreshFeed', this, done);
    },
    'click span.markRead': function(){
        Meteor.call('markAllRead', this, done);
    }   
});