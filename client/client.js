Session.setDefault('article_open', null);
Session.setDefault('previous_article', null);
Session.setDefault('current_feed', null);

function done(err, result){
    if(err){
        console.log(err);
    } else if(result) {
        console.log(result);
    }
};

Deps.autorun(function(){
    Meteor.subscribe('feeds');
    
});

Deps.autorun(function(){
    Meteor.subscribe('articles', Session.get('current_feed'));
});


/// feeds ///

Template.feeds.feedList = function(){
    return Feeds.find();
};

Template.feeds.current = function(){
    return Session.equals('current_feed', this._id);
};

Template.feeds.events({
    'click #addFeed': function(){
        Meteor.call('addFeed', $('#feedUrl').val(), done);
        $("#feedUrl").val("");
    },
    'click button.removeFeed': function(){
        Meteor.call('removeFeed', this, done);
        Session.set('current_feed', null);
    },
    'click .feed': function(){
        Session.set('current_feed', this._id);
        Meteor.call('refreshFeed', this, done);
    },
    'click button.markRead': function(){
        Meteor.call('markAllRead', this, done);
    }
    // 'keydown' : function(){
    //     if(event.which == 13){

    //     }
    // }
    
});

/// article ///

Template.article.open = function(){
    return Session.equals('article_open', this._id) ? "open" : "";
};

Template.article.events({
    'click .article': function(){
        Session.set('previous_article', Session.get('article_open'));
        Meteor.call('markRead', Session.get('article_open'), done); 
        Session.set('article_open', this._id);
    }
});

/// overview ///

Template.overview.articles = function(){
    return Articles.find({feedId: Session.get('current_feed')},
        { sort:  [['read', 'asc'],["date", "desc"]] });
};

Template.overview.events({
    'click input.removeArticle': function(){
        Articles.remove(this._id);
    },
    'click input.removeAll': function(){
        Meteor.call('removeAll', done);
    }
});
