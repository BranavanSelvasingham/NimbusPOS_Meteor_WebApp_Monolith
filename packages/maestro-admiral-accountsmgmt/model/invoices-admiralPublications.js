Meteor.publish("admiral-invoices", function() {
	return [
		Invoices.find({})
	]; 
});