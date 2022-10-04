Meteor.methods({
    "deleteThisBusiness": function(businessId) {
        Businesses.remove({_id: businessId});
		
		BusinessUsers.remove({businessId: businessId});
        Customers.remove({businessId: businessId});
        Employees.remove({businessId: businessId});
        Expenses.remove({businessId: businessId});
        Invoices.remove({businessId: businessId});
        Locations.remove({businessId: businessId});
        LoyaltyPrograms.remove({businessId: businessId});
        Notes.remove({businessId: businessId});
        Orders.remove({businessId: businessId});
        ProductAddons.remove({businessId: businessId});
        ProductCategories.remove({businessId: businessId});
        Products.remove({businessId: businessId});
        Reminders.remove({businessId: businessId});
        Tables.remove({businessId: businessId});
    },

    "deleteThisUser": function(userId){
    	Meteor.users.remove(userId);
    },

    "disableUserLogin": function(userId){
    	Meteor.users.update(userId, {
    		$set : {
    			"services.resume": {"loginTokens": []}
    		}
    	});

    	Meteor.users.update(userId, {
			$set: {
		    	loginDisabled: true
			}
		});
    },

    "enableUserLogin": function(userId){
    	Meteor.users.update(userId, {
			$set: {
		    	loginDisabled: false
			}
		});
    },
});