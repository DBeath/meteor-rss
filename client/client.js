Session.setDefault('article_open', null);

/// feeds ///

Template.feeds.feedList = function(){
    return Feeds.find();
};

Template.feeds.events({
    'click #addFeed': function(){
        Meteor.call('addFeed', $('#feedUrl').val());
        $("#feedUrl").val("");
    },
    'click input.removeFeed': function(){
        Feeds.remove(this._id);
    },
    'keydown' : function(){
        if(event.which == 13){
            
        }
    }
    
});

/// article ///

Template.article.open_class = function(){
    return this.open ? "open" : "";
};

Template.article.open = function(){
    return Session.equals('article_open', this._id);
};

Template.article.events({
    'click #article': function(){
        Articles.update(this._id, {$set: {open: !this.open}});
    },

    'click .article': function(){
        Session.set('article_open', this._id);
        Deps.flush();
    }
})

/// overview ///

Template.overview.articles = function(){
    return Articles.find({}, {sort: [["date", "desc"]]});
};

Template.overview.events({
    'click input.removeArticle': function(){
        Articles.remove(this._id);
    },
    'click input.removeAll': function(){
        Meteor.call('removeAll');
    }
});
