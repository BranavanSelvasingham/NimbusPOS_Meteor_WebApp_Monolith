Maestro.Templates.EnterEmployeeHours = "EnterEmployeeHours";


Template.EnterEmployeeHours.onCreated(function(){
	let template = this;

	template.unlockEmployee = new ReactiveVar();
	template.selectedEmployee = new ReactiveVar();
	template.checkInOutTime = new ReactiveVar();
	template.checkInOutTimeRaw = new ReactiveVar();
	template.todayDate = new Date();
	template.todayDate = new Date(template.todayDate.getFullYear(), template.todayDate.getMonth(), template.todayDate.getDate(), 0, 0, 0, 0);

	template.referenceDate = new ReactiveVar();
	template.referenceDate.set(new Date(template.todayDate));

	template.selectedEntry = new ReactiveVar();
	template.createNewEntryDate = new ReactiveVar();

	template.setRoundedTime = function(){
		var timeNow = new Date();
		timeNow.setSeconds(0);
		timeNow.setMilliseconds(0);

		var minutesNowRound = timeNow.getMinutes();
		var deltaMinutes = minutesNowRound % 15;
		if (deltaMinutes >= 7){
			minutesNowRound = minutesNowRound - deltaMinutes + 15;
		} else {
			minutesNowRound = minutesNowRound - deltaMinutes;
		}

		timeNow.setMinutes(minutesNowRound);

		return timeNow;
	};

	template.setRawTime = function(){
		return new Date();
	};

	template.calcHours = function(clockIn, clockOut){
		let hours = Math.round((clockOut.getTime() - clockIn.getTime())/(1000*60*60)*100)/100;
	    return hours;
	};

	template.setCreateNewEntryDate = function(){
		let periodStart = new Date(Maestro.Client.getCurrentPayPeriodStartDate(template.referenceDate.get()));
		let periodEnd = new Date(Maestro.Client.getCurrentPayPeriodEndDate(template.referenceDate.get()));

		var datesInPeriodSet = [];

		for (newDate = new Date(periodStart); newDate < periodEnd; newDate.setDate(newDate.getDate() + 1)){
			datesInPeriodSet.push(newDate.getTime());
		}
		
		datesInPeriodSet.push(periodEnd.getTime());

		existingEntrySet = Maestro.Client.getThisPeriodTimeSheetEntries(employeeId, template.referenceDate.get());

	};

	template.clearEmployeeInfo = function(){
		template.selectedEmployee.set();
		template.unlockEmployee.set();
		template.referenceDate.set(new Date(template.todayDate));
		template.checkInOutTime.set();
		template.checkInOutTimeRaw.set();
		template.selectedEntry.set();
		template.createNewEntryDate.set();
	};

	template.getExistingEntry = function(){
		let employeeId = Template.instance().selectedEmployee.get()._id;
		let employee = Employees.findOne({_id: employeeId});

		let existingEntry = null;

		if(employee.actualHours){
			_.each(employee.actualHours, function(entry){
				// $("#temporaryConsole").append("<p>comparing dates to get existingEntry==========</p>");
				if(Maestro.Client.compareDates(new Date(entry.date), Template.instance().todayDate)){
					existingEntry = entry;
					// $("#temporaryConsole").append("<p>*****MATCH FOUND*****</p>");
				}
				// $("#temporaryConsole").append("<p>==========</p>");
			});
			return existingEntry;
		}

		return null;

	}

	this.autorun(function(){
		if(!!UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE)){
			let employee = UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE);
			template.selectedEmployee.set(Employees.findOne({_id: employee._id}));
			console.log(Employees.findOne({_id: employee._id}));
		}
	});

});

Template.EnterEmployeeHours.onRendered(function () {
	let template = this;

	template.todayDate = new Date();
	template.todayDate = new Date(template.todayDate.getFullYear(), template.todayDate.getMonth(), template.todayDate.getDate(), 0, 0, 0, 0);

	template.referenceDate.set(new Date(template.todayDate));
	template.checkInOutTime.set(template.setRoundedTime());
	template.checkInOutTimeRaw.set(template.setRawTime());
	window.setInterval(function(){template.checkInOutTimeRaw.set(template.setRawTime());}, 1000);
});

Template.EnterEmployeeHours.helpers({
	isEmployeeLoggedInToSystem: function(){
		return !!UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE);
	},

	isTimeAdjustDisabled: function(){
		// return true;

		if(Maestro.Business.getConfigurations().disableEmployeeTimeAdjust === true && Maestro.Client.isCordova){
			return true;
		}
		return false;
	},

	getThisPeriodStart: function(){
		let periodStart = new Date(Maestro.Client.getCurrentPayPeriodStartDate(Template.instance().referenceDate.get()));
		return periodStart.toDateString();
	},

	getThisPeriodEnd: function(){
		let periodEnd = new Date(Maestro.Client.getCurrentPayPeriodEndDate(Template.instance().referenceDate.get()));
		return periodEnd.toDateString();
	},

	getTimeSheetEntries: function(employeeId){
		return Maestro.Client.getThisPeriodTimeSheetEntries(employeeId, Template.instance().referenceDate.get());
	},

	getPeriodDates: function(employeeId){
		Employees.find(); // refresh flag
		return Maestro.Client.getThisPeriodTimeSheetTable(employeeId, Template.instance().referenceDate.get());
	},

	isExistingEntry: function(clockIn, clockOut){
		if(clockOut || clockIn){
			return true;
		}
		return false;
	},

	getSelectedEmployee: function(){
		return Template.instance().selectedEmployee.get();
	},

	getTodayDate: function(){
		return Template.instance().todayDate.toDateString();
	},

	getCreateNewEntryDate: function(){
		return Template.instance().createNewEntryDate.get();
	},

	isAlreadyCheckedInToday: function(){
		let existingEntry = Template.instance().getExistingEntry();
        
        if(!!existingEntry){
        	if(!!existingEntry.clockIn){
        		return true;
        	}
        }
        
        return false;

	},

	isAlreadyCheckedOutToday: function(){
		let existingEntry = Template.instance().getExistingEntry();
        
        if(!!existingEntry){
        	if(!!existingEntry.clockOut){
        		return true;
        	}
        } 
        
        return false;
	},

	getTimeNow: function(){
		if(Template.instance().checkInOutTime.get()){
			return Template.instance().checkInOutTime.get().toLocaleTimeString();
		}
	},

	getRawTimeNow: function(){
		if(Template.instance().checkInOutTimeRaw.get()){
			return Template.instance().checkInOutTimeRaw.get().toLocaleTimeString();
		}
	},

	getFormattedDate: function(entryDate){
		if (entryDate){
			return entryDate.toDateString();
		}
	},

	getFormattedTime: function(entryTime){
		if (entryTime){
			return entryTime.toLocaleTimeString();
		}
	},

	getSelectedEntry: function(){
		return Template.instance().selectedEntry.get();
	},

	fullAccessMode: function(){
		let loggedInUser = Meteor.user();
		if (Roles.userIsInRole(loggedInUser, Maestro.roles.BUSINESS_ADMIN) && !Maestro.Client.isCordova) {
        	return true;
        }
        return false;
	}

});

Template.EnterEmployeeHours.events({
	'click .checkInOut': function(event, template){
		template.checkInOutTime.set(template.setRoundedTime());
		$('#checkInOut').openModal();
	},

	'click .editEntry': function(event, template){
		template.selectedEntry.set(this);
		$('#editEntryModal').openModal();
	},

	'click .deleteEntry': function(event, template){
		Maestro.Employees.EmployeeEntryDelete(template.selectedEmployee.get()._id, this.date);

		// Meteor.call('employeeEntryDelete', template.selectedEmployee.get()._id, this.date, function(error, result){
		// 	if (error){
		// 		console.log(error);
		// 	} else {
		// 		Materialize.toast('Updated', 400);
		// 	}
		// });
	},

	'click .periodUp': function(event, template){
		template.referenceDate.set(Maestro.Client.incrementDatePeriodUp(template.referenceDate.get()));
	},

	'click .periodDown': function(event, template){
		template.referenceDate.set(Maestro.Client.incrementDatePeriodDown(template.referenceDate.get()));
	},

	'click .addNewEntry': function(event, template){
		var entry = {};
		entry.date = new Date(this.date);
		entry.clockIn = new Date(entry.date.getFullYear(), entry.date.getMonth(), entry.date.getDate(), 9,0,0,0);
		entry.clockOut = new Date(entry.date.getFullYear(), entry.date.getMonth(), entry.date.getDate(), 17,0,0,0);
		entry.hours = 8;
		template.selectedEntry.set(entry);
		$('#editEntryModal').openModal();
	},

	'click .editEntryIncrementUpCheckIn': function(event, template){
		let entry = template.selectedEntry.get();
		if(entry.clockIn){
			entry.clockIn.setMinutes(entry.clockIn.getMinutes() + 15);
		} else {
			entry.clockIn = new Date(entry.clockOut) || new Date(entry.date);
			entry.clockIn.setMinutes(entry.clockIn.getMinutes() + 15);
		}

		entry.hours = template.calcHours(entry.clockIn, entry.clockOut);

		template.selectedEntry.set(entry);
	},

	'click .editEntryIncrementDownCheckIn': function(event, template){
		let entry = template.selectedEntry.get();
		if(entry.clockIn){
			entry.clockIn.setMinutes(entry.clockIn.getMinutes() - 15);
		} else {
			entry.clockIn = new Date(entry.clockOut) || new Date(entry.date);
			entry.clockIn.setMinutes(entry.clockIn.getMinutes() - 15);
		}
		entry.hours = template.calcHours(entry.clockIn, entry.clockOut);
		template.selectedEntry.set(entry);
	},

	'click .editEntryIncrementUpCheckOut': function(event, template){
		let entry = template.selectedEntry.get();
		if(entry.clockOut){
			entry.clockOut.setMinutes(entry.clockOut.getMinutes() + 15);
		} else {
			entry.clockOut = new Date(entry.clockIn) || new Date(entry.date);
			entry.clockOut.setMinutes(entry.clockOut.getMinutes() + 15);
		}
		entry.hours = template.calcHours(entry.clockIn, entry.clockOut);
		template.selectedEntry.set(entry);
	},

	'click .editEntryIncrementDownCheckOut': function(event, template){
		let entry = template.selectedEntry.get();
		if(entry.clockOut){
			entry.clockOut.setMinutes(entry.clockOut.getMinutes() - 15);
		} else {
			entry.clockOut = new Date(entry.clockIn) || new Date(entry.date);
			entry.clockOut.setMinutes(entry.clockOut.getMinutes() - 15);
		}
		entry.hours = template.calcHours(entry.clockIn, entry.clockOut);
		template.selectedEntry.set(entry);
	},

	'click .confirmEntryEdit': function(event, template){
		let employeeId = template.selectedEmployee.get()._id;
		let entry = template.selectedEntry.get();

		let updated = Maestro.Employees.EmployeeCheckInOut(employeeId, entry.clockIn, entry.clockOut, entry.date);

		if(updated){
			Materialize.toast('Updated', 800);
			$('#editEntryModal').closeModal();
		}
		
		// Meteor.call('employeeCheckInOut', employeeId, entry.clockIn, entry.clockOut, entry.date, function(error, result){
		// 	if (error){
		// 		console.log(error);
		// 	} else {
		// 		Materialize.toast('Updated', 400);
		// 		$('#editEntryModal').closeModal();
		// 	}
		// });
	},

	'click .incrementTimeUp': function(event, template){
		var timeNow = new Date(template.checkInOutTime.get());
		timeNow.setMinutes(timeNow.getMinutes() + 15);
		template.checkInOutTime.set(timeNow);
	},

	'click .incrementTimeDown': function(event, template){
		var timeNow = new Date(template.checkInOutTime.get());
		timeNow.setMinutes(timeNow.getMinutes() - 15);
		template.checkInOutTime.set(timeNow);
	},

	'click .confirmCheckIn': function(event, template){
		let checkInTime = template.checkInOutTime.get();
		let employeeId = template.selectedEmployee.get()._id;

		let updated = Maestro.Employees.EmployeeCheckInOut(employeeId, checkInTime, null, null);

		if (updated){
			Materialize.toast('Great! ... Now get to work! :p', 800);
		}

		// Meteor.call('employeeCheckInOut', employeeId, checkInTime, null, null, function(error, result){
		// 	if (error){
		// 		console.log(error);
		// 	} else {
		// 		Materialize.toast('Great! ... Now get to work! :p', 400);
		// 	}
		// });
	},

	'click .confirmCheckOut': function(event, template){
		let checkOutTime = template.checkInOutTime.get();
		let employeeId = template.selectedEmployee.get()._id;

		let updated = Maestro.Employees.EmployeeCheckInOut( employeeId, null, checkOutTime, null);

		if(updated){
			Materialize.toast('Woohoo! :D', 400);
		}

		// Meteor.call('employeeCheckInOut', employeeId, null, checkOutTime, null, function(error, result){
		// 	if (error){
		// 		console.log(error);
		// 	} else {
		// 		Materialize.toast('Woohoo! :D', 400);
		// 	}
		// });
	},

	'click .confirmCheckInRaw': function(event, template){
		let checkInTime = template.checkInOutTimeRaw.get();
		let employeeId = template.selectedEmployee.get()._id;

		let updated = Maestro.Employees.EmployeeCheckInOut(employeeId, checkInTime, null, null);

		if (updated){
			Materialize.toast('Great! ... Now get to work! :p', 800);
		}

		// Meteor.call('employeeCheckInOut', employeeId, checkInTime, null, null, function(error, result){
		// 	if (error){
		// 		console.log(error);
		// 	} else {
		// 		Materialize.toast('Great! ... Now get to work! :p', 400);
		// 	}
		// });
	},

	'click .confirmCheckOutRaw': function(event, template){
		let checkOutTime = template.checkInOutTimeRaw.get();
		let employeeId = template.selectedEmployee.get()._id;

		let updated = Maestro.Employees.EmployeeCheckInOut( employeeId, null, checkOutTime, null);

		if(updated){
			Materialize.toast('Woohoo! :D', 400);
		}

		// Meteor.call('employeeCheckInOut', employeeId, null, checkOutTime, null, function(error, result){
		// 	if (error){
		// 		console.log(error);
		// 	} else {
		// 		Materialize.toast('Woohoo! :D', 400);
		// 	}
		// });
	},

	'click .changePin': function(event, template){
		$('#changePinModal').openModal();
	},

	'click .verifyChangePin': function(event, template){
		 let currentPin = document.getElementById('changePinCurrent').value;
		 let newPin = document.getElementById('changePinNew').value;
		 let newPinReType = document.getElementById('changePinReType').value;
		 let employeeId = template.selectedEmployee.get()._id;

		 if (currentPin == template.selectedEmployee.get().pin){
		 	if(newPin == newPinReType){
		 		if(newPin){
		 			if(isNaN(newPin)){
		 				Materialize.toast('Please keep Pin Numeric');
		 				return;
		 			}
		 			Meteor.call("updateEmployee", employeeId, {pin: newPin}, function(error, result){
		 				if(error){

		 				} else {
		 					Materialize.toast('Pin Changed', 500);
		 					$('#changePinModal').closeModal();
		 				}
		 			});
		 		} else {
		 			Materialize.toast('Enter a valid new Pin', 500);
		 		}
		 	} else {
		 		Materialize.toast('New Pin does not match', 500);
		 	}
		 } else {
		 	if(!template.selectedEmployee.get().pin){
		 		Meteor.call("updateEmployee", employeeId, {pin: newPin}, function(error, result){
	 				if(error){

	 				} else {
	 					Materialize.toast('Pin Changed', 500);
	 					$('#changePinModal').closeModal();
	 				}
	 			});
		 	} else {
		 		Materialize.toast('Incorrect Current Pin', 500);
		 	}
		 }
		 document.getElementById('changePinForm').reset();
	},

	'click .clearEmployee': function(event, template){
		template.clearEmployeeInfo();
	},

});