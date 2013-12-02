/// article ///
function articleClick(article, done){
    var articleOpen = Session.get('article_open');
    if (articleOpen != article._id && articleOpen != null){
        Meteor.call('markRead', articleOpen, done);
        Session.set('previous_article', articleOpen);
    };
    Session.set('article_open', article._id);       
};

Template.article.open = function(){
    return Session.equals('article_open', this._id) ? "open" : "";
};

Template.article.events({
    'click .articletitle': function(){
        articleClick(this, done);
    },
    'click .markedRead': function(){
        Meteor.call('markUnread', this._id, done);
    },
    'click .closeArticle': function(e){
        Meteor.call('markRead', this._id, done);
        Session.set('article_open', null);
        e.stopImmediatePropagation();
    }
});

Template.article.helpers({
    timestamp: function(){
        var date = this.date;
        return moment(date).format("MMM Do YYYY, HH:mm");
    }
});