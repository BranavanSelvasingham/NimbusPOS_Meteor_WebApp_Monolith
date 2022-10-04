Maestro.Templates.AllBusinesses = "AllBusinesses";

Template.AllBusinesses.onCreated(function() {
	Template.instance().subscribe('admiral-business-cores');
	let template = this;
	template.selectedBusiness = new ReactiveVar();

	this.autorun(function(){
		let business = template.selectedBusiness.get() || {};
		Template.instance().subscribe('admiral-godview', business._id);
	});

	this.autorun(function(){
		let business = template.selectedBusiness.get();
		if(Template.instance().subscriptionsReady() && !!business){
			console.log(business.name + " - Businesses: ", Businesses.find({_id: business._id}).fetch().length);

			console.log(business.name + " - BusinessUsers: ", BusinessUsers.find({businessId: business._id}).fetch().length);
	        console.log(business.name + " - Customers: ", Customers.find({businessId: business._id}).fetch().length);
	        console.log(business.name + " - Employees: ", Employees.find({businessId: business._id}).fetch().length);
	        console.log(business.name + " - Expenses: ", Expenses.find({businessId: business._id}).fetch().length);
	        console.log(business.name + " - Invoices: ", Invoices.find({businessId: business._id}).fetch().length);
	        console.log(business.name + " - Locations: ", Locations.find({businessId: business._id}).fetch().length);
	        console.log(business.name + " - LoyaltyPrograms: ", LoyaltyPrograms.find({businessId: business._id}).fetch().length);
	        console.log(business.name + " - Notes: ", Notes.find({businessId: business._id}).fetch().length);
	        console.log(business.name + " - Orders: ", Orders.find({businessId: business._id}).fetch().length);
	        console.log(business.name + " - ProductAddons: ", ProductAddons.find({businessId: business._id}).fetch().length);
	        console.log(business.name + " - ProductCategories: ", ProductCategories.find({businessId: business._id}).fetch().length);
	        console.log(business.name + " - Products: ", Products.find({businessId: business._id}).fetch().length);
	        console.log(business.name + " - Reminders: ", Reminders.find({businessId: business._id}).fetch().length);
	        console.log(business.name + " - Tables: ", Tables.find({businessId: business._id}).fetch().length);
		}
	});
});

Template.AllBusinesses.onRendered(function() {
	
});

Template.AllBusinesses.helpers({
	getAllBusinesses: function(){
		return Businesses.find({});
	},
    
});

Template.AllBusinesses.events({
	'click .deleteThisBusiness': function(event, template){
		let business = template.selectedBusiness.get() || {};

		Meteor.call("deleteThisBusiness", business._id, function(error, result){
			if(error){
				console.log(error);
			} else {
				console.log("delete successful");
			}
		})
	},

	'click .businessInfo': function(event, template){
		console.log("Business Info: " + this.name);

		template.selectedBusiness.set(this);
	}

});



