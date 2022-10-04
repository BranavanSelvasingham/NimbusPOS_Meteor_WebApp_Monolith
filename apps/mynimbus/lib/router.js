import { Meteor } from 'meteor/meteor'

let isUserLoggedIn = function(){
    if(!Meteor.user()){
        FlowRouter.go("/welcome");
    }
};

let isUserNotLoggedIn = function(){
    if(!!Meteor.user()){
        FlowRouter.go("/");
    } else {

    }
}

let goHome = function(params, queryParams) {
    if(!!Meteor.user()){
        FlowRouter.go('/balances');
    } else {
        FlowRouter.go('/welcome');
    }
};

FlowRouter.route('/', {
    name: 'root',
    action: goHome
});

FlowRouter.route('/welcome', {
    name: 'welcome',
    triggersEnter: [isUserNotLoggedIn],
    action: function(){
        BlazeLayout.render("Layout", {content: 'Home'});
    }
})

FlowRouter.route('/home', {
    name: 'home',
    action: goHome
});

FlowRouter.route('/balances', {
    name: 'balances',
	action: function(params, queryParams) {
    	BlazeLayout.render("Layout", {content: 'CardBalances'});
    }
});

FlowRouter.route('/info', {
    name: 'info',
	action: function(params, queryParams) {
    	BlazeLayout.render("Layout", {content: 'InfoPage'});
        // Activity.WelcomeLog();
    }
});

FlowRouter.route('/account', {
    name: "account",
	action: function(params, queryParams) {
    	BlazeLayout.render("Layout", {content: 'AccountPage'});
        // Activity.WelcomeLog();
    }
});

FlowRouter.route('/logout', {
    name: "logout",
    action: function(){
        Meteor.logout(function(){
            FlowRouter.go('/');
        });
    }
});

FlowRouter.triggers.enter([isUserLoggedIn], {except: ["welcome", "info"]});

// FlowRouter.route('/pin/:pin', {
//     action: function(params, queryParams) {
//         let accountObject = new ReactiveVar();
//         Meteor.call('verifyPin', params.pin, function(error, result){
//             accountObject.set(result);
//             if(!!accountObject.get()){
//                 let user = accountObject.get();
//                 Meteor.loginWithPassword(user.username, user.pin, function(){
//                     Session.set("APPLICATION", user.username);
//                     FlowRouter.go('/');
//                 });
//             } else {
//                 FlowRouter.go('/');
//             }
//         });
//         Activity.StartedSession();
//         FlowRouter.go('/');

//     }
// });

FlowRouter.notFound = {
    action: function () {
        FlowRouter.go('/');
    }
};

