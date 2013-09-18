Session.setDefault('article_open', null);
Session.setDefault('current_feed', null);

function done(error, result){
    if(error){
        console.log(error);
    } else {
        console.log(result);
    }
};

/// feeds ///

Template.feeds.feedList = function(){
    return Feeds.find();
};

Template.feeds.events({
    'click #addFeed': function(){
        Meteor.call('addFeed', $('#feedUrl').val(), done);
        $("#feedUrl").val("");
    },
    'click input.removeFeed': function(){
        Feeds.remove(this._id);
    },
    'click .feed': function(){
        Session.set('current_feed', this._id);
        Meteor.call('refreshFeed', this, done);
    },
    'keydown' : function(){
        if(event.which == 13){

        }
    }
    
});

/// article ///

Template.article.open = function(){
    return Session.equals('article_open', this._id);
};

Template.article.events({
    'click .article': function(){
        if(!this.read){
            Meteor.call('markOneRead', this.feedId, done);
        }
        Articles.update(this._id, {$set: {read: true}});
        Session.set('article_open', this._id);
        Deps.flush();
    }
})

/// overview ///

Template.overview.articles = function(){
    return Articles.find({feedId: Session.get('current_feed')}, {sort: [["date", "desc"]]});
};

Template.overview.events({
    'click input.removeArticle': function(){
        Articles.remove(this._id);
    },
    'click input.removeAll': function(){
        Meteor.call('removeAll', done);
    }
});
