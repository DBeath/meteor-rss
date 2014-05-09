Router.map(function () {
	this.route('home', {
		path: '/',
		template: 'home',
		layoutTemplate: 'layout'
	});

	this.route('article', {
		path: '/articles/:_id',
		template: 'article'
	});

	// this.route('feed', {
	// 	path: '/:title',
	// 	template: 'articleList'
	// })
});