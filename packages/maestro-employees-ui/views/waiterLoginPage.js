Maestro.Templates.WaiterLogin = "WaiterLogin";

Template.WaiterLogin.onCreated(function() {
	var template = this;

	template.employeePin = new ReactiveVar();

	template.selectedEmployee = new ReactiveVar();
	template.selectedEmployee.set();

});

Template.WaiterLogin.onRendered(function() {
	var template = this;
	if(UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE)){
		template.selectedEmployee.set(UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE));
	}
	template.selectedEmployee.set(null);
	template.employeePin.set([]);
});

Template.WaiterLogin.helpers({
	getEmployeePinDigits: function(){
		// console.log('sending to each: ', Template.instance().employeePin.get());
		return Template.instance().employeePin.get();
	},

	listActiveEmployees: function(){
		return Employees.find({status:'Active'},{sort: {name:1}}).fetch();
	},

	unlockThisEmployee: function(employeeId){
		if(Template.instance().selectedEmployee.get()){
			if(Template.instance().selectedEmployee.get()._id == employeeId){
				return true;
			}
		}
		return false;
	},

	employeeIsNotSelected: function(employeeId){
		if(Template.instance().selectedEmployee.get()){
			if(Template.instance().selectedEmployee.get()._id != employeeId){
				return true;
			}
		}
		return false;
	},

	thisIsSystemEmployee: function(employeeId){
		if(UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE)){
			if(UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE)._id == employeeId){
				return true;
			}
		}
		return false;
	}
});

Template.WaiterLogin.events({
	'click .selectThisEmployee': function(event, template){
		template.selectedEmployee.set(this);
		// console.log(this);
	},

	'click .verifyPin': function(event, template){
		let enteredPin;

		// var employee = Meteor.call('verifyEmployeePin', enteredPin, unlockEmployee.get()._id, function(error, result){
		// 	if (error){
		// 		console.log(error);
		// 	} else {
		// 		selectedEmployee.set(result);
		// 	}
		// });
	},

	'click .clearEmployeeSelection': function(event, template){
		template.selectedEmployee.set();
	},

	'click .addToPinDigit': function(event, template){
		let digitEntered =  $(event.target).data('pindigit');
		// console.log('digitEntered: ', digitEntered);
		let allDigits = template.employeePin.get() || [];

		// console.log('allDigits: ', allDigits);
		allDigits.push(digitEntered);

		// console.log('allDigits: ', allDigits);
		template.employeePin.set(allDigits);

		let enteredPin = allDigits.join('');
		// console.log('enteredPin: ', enteredPin);

		if(enteredPin == template.selectedEmployee.get().pin){
			UserSession.set(Maestro.UserSessionConstants.SELECT_EMPLOYEE, template.selectedEmployee.get());
            template.selectedEmployee.set(null);
            template.employeePin.set([]);
            if(FlowRouter.getRouteName()=="WaiterLogin"){
            	Maestro.Client.goToUserHome();
            }
		}
	},

	'click .refreshPinEntered': function(event, template){
		template.employeePin.set([]);
	},

	'click .lockPOS': function(event, template){
		UserSession.set(Maestro.UserSessionConstants.SELECT_EMPLOYEE, null);
		template.selectedEmployee.set(null);
		template.employeePin.set([]);
	}
});

