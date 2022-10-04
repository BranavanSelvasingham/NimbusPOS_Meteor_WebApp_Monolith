Maestro.Templates.Home = "Home";

Template.Home.onCreated(function() {
	// let template = this;

	// template.signInMode = new ReactiveVar();
	// template.logInMode = new ReactiveVar();
	// template.signInMode.set(false);
	// template.logInMode.set(false);

});

Template.Home.onRendered(function() {
	// let template = this;
	// $('.carousel').carousel();
	// $('.carousel.carousel-slider').carousel({full_width: true});

	// $('#slider_div').slider({
	// 	full_width: false,
	// 	indicators: true,
	// 	height: 500,
	// 	interval: 5000
	// });

	// $('#slider_div_small').slider({
	// 	full_width: false,
	// 	indicators: true,
	// 	height: 500,
	// 	interval: 5000
	// });

	// $('#testimonials_slider_div').slider({
	// 	full_width: false,
	// 	indicators: false,
	// 	height: 350,
	// 	interval: 3000
	// });

	// window.setTimeout(function(){Materialize.showStaggeredList('#homeTop');}, 100 );

	// template.signInMode.set(false);
	// template.logInMode.set(false);

	// $('.materialboxed').materialbox();

});

Template.Home.helpers({
	// inSignInMode: function(){
	// 	return Template.instance().signInMode.get();
	// },

	// inLogInMode: function(){
	// 	return	Template.instance().logInMode.get();
	// },

	// inHomeMode: function(){
	// 	return !(Template.instance().signInMode.get() ||	Template.instance().logInMode.get());
	// },
    
});

Template.Home.events({
	// 'click .setSignInMode': function(event, template){
	// 	template.signInMode.set(true);
	// 	template.logInMode.set(false);
	// 	window.setTimeout(function(){Materialize.showStaggeredList('#signUpForm');}, 100 );
	// },

	// 'click .setLogInMode': function(event, template){
	// 	template.logInMode.set(true);
	// 	template.signInMode.set(false);
	// 	window.setTimeout(function(){Materialize.showStaggeredList('#logInForm');}, 100 );
	// },

	// 'click #cancel-login': function(event, template){
	// 	template.logInMode.set(false);
	// 	template.signInMode.set(false);
	// 	window.setTimeout(function(){Materialize.showStaggeredList('#homeTop');}, 100 );
	// },

	// 'click #cancel-create-owner': function(event, template){
	// 	template.logInMode.set(false);
	// 	template.signInMode.set(false);
	// 	window.setTimeout(function(){Materialize.showStaggeredList('#homeTop');}, 100 );
	// },

});



