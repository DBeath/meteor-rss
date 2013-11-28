/// article ///
function articleClick(article){
    var articleOpen = Session.get('article_open');

    Meteor.call('markRead', articleOpen, done);

    if (articleOpen === article._id){
        Session.set('article_open', null);
    } else {
        Session.set('previous_article', articleOpen);
         
        Session.set('article_open', article._id);   
    };    
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
    }
});

Template.article.helpers({
    timestamp: function(){
        var date = this.date;
        return moment(date).format("MMM Do YYYY, HH:mm");
    }
});