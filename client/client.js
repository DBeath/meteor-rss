Session.setDefault('article_open', null);
Session.setDefault('previous_article', null);
Session.setDefault('current_feed', null);

function done(err, result){
    if(err){
        console.log(err);
    } else if(result) {
        console.log(result);
    };
};

Deps.autorun(function(){
    Meteor.subscribe('feeds');
    
});

Deps.autorun(function(){
    Meteor.subscribe('articles', Session.get('current_feed'));
});



