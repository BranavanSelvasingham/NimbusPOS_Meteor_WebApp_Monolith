Maestro.Templates.SetPayrollInfo = "SetPayrollInfo";

Template.SetPayrollInfo.onRendered(function () {
	$('.datepicker').pickadate({
	    selectMonths: true, // Creates a dropdown to control month
	    selectYears: 3 // Creates a dropdown of 15 years to control year
  	});
  	$('select').material_select();
  	$('.modal-trigger').leanModal();
});

Template.SetPayrollInfo.helpers({
	getThisPeriodStart: function(){
		let periodStart = new Date(Maestro.Client.getCurrentPayPeriodStartDate());
		return periodStart.toLocaleDateString();
	},

	getPeriodStart: function(){
		let business = Businesses.findOne({_id: Maestro.Client.businessId()});
		if(business.payroll){
			return business.payroll.referenceStartDate;
		}
	},

	getFrequencyType: function(){
		let business = Businesses.findOne({_id: Maestro.Client.businessId()});
		if(business.payroll){
			return business.payroll.frequencyType;
		}
	},

});

Template.SetPayrollInfo.events({
	'click #updatePayrollSettings': function(event, target){
		var periodStart = new Date(document.getElementById('periodStartDate').value);
		console.log(periodStart);
		let frequencyType = document.getElementById('frequencyType').value;

		if (periodStart && frequencyType){
			periodStart = new Date(periodStart.getFullYear(), periodStart.getMonth(), periodStart.getDate(), 0,0,0,0);
			console.log(periodStart);

			var businessInfo = {};
			businessInfo.payroll = {
				referenceStartDate: new Date(periodStart),
				frequencyType: frequencyType
			};
			console.log(businessInfo.payroll.referenceStartDate);
			Meteor.call('setBusinessAttr', Maestro.Client.businessId(), businessInfo, function(error, result) {
                if(error) {
                    console.log(error);
                } else {
                    Materialize.toast("Updated", 1000);
            	}
            });
		} else {
			Materialize.toast('Select a date and a period type', 1000);
		}

		console.log(Businesses.findOne({_id: Maestro.Client.businessId()}));

	}
});