Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading'
});

Router.map(function(){
	this.route('home', {
		path: '/',
		template: 'home',
		yieldTemplates: {
			'feedList': {to: 'feedList'},
			'articleList': {to: 'articleList'}
		}
	});

	this.route('article', {
		path: '/:_id',
		template: 'article'
	});

	this.route('feed', {
		path: '/:title',
		template: 'articleList'
	})
});