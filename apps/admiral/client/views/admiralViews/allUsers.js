Maestro.Templates.AllUsers = "AllUsers";

Template.AllUsers.onCreated(function() {
	Template.instance().subscribe('admiral-business-cores');
});

Template.AllUsers.onRendered(function() {
	
});

Template.AllUsers.helpers({
	getAllBusinessUsers: function(){
		return Meteor.users.find({isEndCustomer: {$ne: true}}).fetch();
	},

	getAllEndCustomerUsers: function(){
		return Meteor.users.find({isEndCustomer: true}).fetch();
	},
    
    userIsDisabled: function(disableLogin){
    	if(disableLogin == true){
    		return true;
    	}
    	return false;
    },

    getBusinessName: function(businessId){
    	return (Businesses.findOne({_id: businessId}) || {}).name;
    },

});

Template.AllUsers.events({
	'click .userInfo': function(event, template){
		console.log("Info for: " + this.username);
		console.log(this);
	},

	'click .enableUserLogin': function(event, template){
		let userId = this._id;
		Meteor.call("enableUserLogin", userId, function(error, result){
			if(error){
				console.log(error);
			} else {
				console.log('user enabled');
			}
		});
	},

	'click .disableUserLogin': function(event, template){
		let userId = this._id;
		Meteor.call("disableUserLogin", userId, function(error, result){
			if(error){
				console.log(error);
			} else {
				console.log('user disabled');
			}
		});
	},

	'click .deleteThisUser': function(event, template){
		let userId = this._id;
		Meteor.call("deleteThisUser", userId, function(error, result){
			if(error){
				console.log(error);
			} else {
				console.log('user removed');
			}
		});
	},

});



