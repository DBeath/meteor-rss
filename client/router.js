Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading'
});

Router.map(function () {
	this.route('home', {
		path: '/',
		template: 'home',
		yieldTemplates: {
			'feedList': {to: 'feedList'}
		},
		waitOn: function () {
			return Meteor.subscribe('feeds');
		},
		data: {
			feedList: Feeds.find()
		}
	});

	this.route('article', {
		path: '/articles/:_id',
		template: 'article'
	});

	this.route('feed', {
		path: '/:title',
		layoutTemplate: 'home',
		template: 'articleList',
		yieldTemplates: {
			'articleList': {to: 'articleList'},
			'feedList': {to: 'feedList'}
		},
		notFoundTemplate: 'notFound',
		waitOn: function () {
			return [
				Meteor.subscribe('articles', this.params._id),
				Meteor.subscribe('feeds')
			]
		},
		articles: function () {
			return Articles.find({},
        { sort:  [['read', 'asc'],["date", "desc"]] });
		},
		data: function () {
			return {
				feedList: Feeds.find(),
				articles: Articles.find({},
        { sort:  [['read', 'asc'],["date", "desc"]] })
			};
		}
		// data: {
			// feedList: Feeds.find(),
			// articles: Articles.find({feedId: Session.get('current_feed')},
   //      { sort:  [['read', 'asc'],["date", "desc"]] })
			// articles: this.articles()
		// }
	});
});