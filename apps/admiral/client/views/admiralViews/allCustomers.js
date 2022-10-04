Maestro.Templates.AllCustomers = "AllCustomers";

Template.AllCustomers.onCreated(function() {
	let template = this;
	template.selectedBusiness = new ReactiveVar();
	Template.instance().subscribe('admiral-business-cores');
	this.autorun(function(){
		let business = template.selectedBusiness.get() || {};
		Template.instance().subscribe('admiral-customers', business._id);
		Template.instance().subscribe('admiral-loyalty-cards', business._id);
		// Template.instance().subscribe('aadmiral-loyalty-programs', business._id);

		// console.log(LoyaltyPrograms.find().fetch());
	});

	// this.autorun(function(){
	// 	let business = template.selectedBusiness.get();
	// 	if(!!business){

	// 	}
	// });
});

Template.AllCustomers.onRendered(function() {
	
});

Template.AllCustomers.helpers({
	getAllBusinesses: function(){
		return Businesses.find({});
	},

	getSelectedBusiness: function(){
		return Template.instance().selectedBusiness.get();
	},

	getAllCustomers: function(){
		return Customers.find({});
	},

	getTotalNumberOfCustomers: function(){
		return Customers.find({}).count();
	},

	getTotalNumberofLoyaltyPrograms: function(programs){
		return (programs || []).length;
	},

	getTotalNumberofTallyPrograms: function(programs){
		return (programs || []).length;
	},

	getAllLoyaltyCards: function(){
		// console.log(LoyaltyCards.find().fetch());
		return LoyaltyCards.find({programType: {$ne: 'Tally'}});
	},

	getAllTallyCards: function(){
		// console.log(LoyaltyCards.find().fetch());
		return LoyaltyCards.find({programType: 'Tally'});
	},

	getTotalNumberOfCards: function(){
		return LoyaltyCards.find({programType: {$ne: 'Tally'}}).count();
	},

	getTotalNumberOfTallyCards: function(){
		return LoyaltyCards.find({programType: 'Tally'}).count();
	},

	getCustomerName: function(customerId){
		return (Customers.findOne({_id: customerId}) || {}).name;
	},

    getProgramName: function(programId){
    	return (LoyaltyPrograms.findOne({_id: programId}) || {}).name;
    },
});

Template.AllCustomers.events({
	'click .selectBusiness': function(event, template){
		console.log("Business Info: " + this.name);
		template.selectedBusiness.set(this);
	},

	'click .deselectBusiness': function(event, template){
		console.log("clearing")
		template.selectedBusiness.set(null);
	},

	'click .startBusinessMigration': function(event, template){
		Maestro.LoyaltyCards.Migrations.migrateBusiness(template.selectedBusiness.get()._id);
	}

});



