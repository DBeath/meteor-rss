/// articleList ///

// Template.articleList.articles = function(){
//     return Articles.find({feedId: Session.get('current_feed')},
//         { sort:  [['read', 'asc'],["date", "desc"]] });
// };

Template.articleList.events({
    'click input.removeArticle': function(){
        Articles.remove(this._id);
    },
    'click input.removeAll': function(){
        Meteor.call('removeAll', done);
    },
    // 'keydown input' : function(event){
    //     console.log('key', event);
    //     if(event.which == 13){
    //         Session.set('previous_article', Session.get('article_open'));
    //         Meteor.call('markRead', Session.get('article_open'), done);
    //         Session.set('article_open', $( "#"+Session.get('article_open').next().id() ));
    //     }

    //     $('body').on('keydown',function(){
    //         console.log('key pressed');
    //     });
    // }
});

// Template.articleList.rendered = function(){
//     var divId = '#' + Session.get('article_open');
//     $('html, body').scrollTop($(divId).offset().top - 50);
// };
