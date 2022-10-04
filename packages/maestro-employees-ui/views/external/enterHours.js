Maestro.Templates.EnterHours = "EnterHours";

var unlockEmployee = new ReactiveVar();
var selectedEmployee = new ReactiveVar();
var checkInOutTime = new ReactiveVar();
var todayDate = new Date();
todayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 0, 0, 0, 0);

var referenceDate = new ReactiveVar();
referenceDate.set(new Date(todayDate));

var weeklyIncrement = null;
var monthlyIncrement = null;

var selectedEntry = new ReactiveVar();
var createNewEntryDate = new ReactiveVar();

var passedDetails;
passedDetails = window.location.search.substring(1);
var passedDetailsSplit = passedDetails.split("&");

var employeeId = passedDetailsSplit[0];
var passedEmployeeId = passedDetailsSplit[0];
var referenceStartDate = new Date(Number(passedDetailsSplit[1]));
var frequencyTypeCode = passedDetailsSplit[2];

var enteredPin;

if(frequencyTypeCode == "7D"){
	weeklyIncrement = 7;
} else if (frequencyTypeCode == "14D"){
	weeklyIncrement = 14;
} else if (frequencyTypeCode == "1M"){
	monthlyIncrement = 1;
}


var setRoundedTime = function(){
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

var calcHours = function(clockIn, clockOut){
	let hours = Math.round((clockOut.getTime() - clockIn.getTime())/(1000*60*60)*100)/100;
    return hours;
};


var clearEmployeeInfo = function(){
	selectedEmployee.set();
	referenceDate.set(new Date(todayDate));
	checkInOutTime.set();
	selectedEntry.set();
	createNewEntryDate.set();

	weeklyIncrement = null;
 	monthlyIncrement = null;

	passedDetails = null;
	passedDetails = null;
	passedDetailsSplit = null;

	employeeId = null;
	passedEmployeeId = null;
	referenceStartDate = null;
	frequencyTypeCode = null;

	enteredPin = null;
};

var initEnterHours = function(){
	selectedEmployee.set();
	checkInOutTime.set();
	todayDate = new Date();
	todayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 0, 0, 0, 0);

	referenceDate.set(new Date(todayDate));

	weeklyIncrement = null;
	monthlyIncrement = null;

	selectedEntry.set();
	createNewEntryDate.set();

	passedDetails = window.location.search.substring(1);
	passedDetailsSplit = passedDetails.split("&");

	employeeId = passedDetailsSplit[0];
	passedEmployeeId = passedDetailsSplit[0];
	referenceStartDate = new Date(Number(passedDetailsSplit[1]));
	frequencyTypeCode = passedDetailsSplit[2];

	if(frequencyTypeCode == "7D"){
		weeklyIncrement = 7;
	} else if (frequencyTypeCode == "14D"){
		weeklyIncrement = 14;
	} else if (frequencyTypeCode == "1M"){
		monthlyIncrement = 1;
	}

};

getCurrentPayPeriodStartDate = function(){
    var thisPeriodStart = new Date(referenceDate.get());

    let referenceStart = new Date(referenceStartDate);

    if(weeklyIncrement){
        let difference = new Date() - referenceStart;
        let deltaDays = Math.round(difference/(24*60*60*1000));
        let daysOffset = deltaDays % weeklyIncrement;
        thisPeriodStart.setDate(thisPeriodStart.getDate() - daysOffset + 1);
        return thisPeriodStart;
    } else if (monthlyIncrement){
        let referenceMonthDate = referenceStart.getDate();
        let thisMonthDate = todayDate.getDate();
        if (referenceMonthDate > thisMonthDate){
            thisPeriodStart.setMonth(thisPeriodStart.getMonth() -1 );
            thisPeriodStart.setDate(referenceStart.getDate());
        } else {
            thisPeriodStart.setDate(referenceStart.getDate());
        }
        return thisPeriodStart;
    }
};

getCurrentPayPeriodEndDate = function(){
    let startDate = new Date(getCurrentPayPeriodStartDate());
    var endDate = new Date(startDate);

    let referenceStart = new Date(referenceStartDate);

    if(weeklyIncrement){
        endDate.setDate(startDate.getDate() + weeklyIncrement - 1);
    } else if (monthlyIncrement){
        endDate.setMonth(startDate.getMonth() + 1);
    }

    return endDate;
};

getThisPeriodTimeSheetEntries = function(){
    let startDate = new Date(getCurrentPayPeriodStartDate());
    let endDate = new Date(getCurrentPayPeriodEndDate());
    var nextStartDate = new Date(endDate);
    nextStartDate.setDate(endDate.getDate() + 1);

    let employee = selectedEmployee.get();

    if (employee.actualHours){
        var timeSheetSet = _.filter(employee.actualHours, function(entry){
            return entry.date >= startDate && entry.date < nextStartDate;
        });

        return timeSheetSet;
    }
};

incrementDatePeriodUp = function(){
    var nextReferenceDate = new Date(referenceDate.get());

    if(weeklyIncrement){
        nextReferenceDate.setDate(nextReferenceDate.getDate() + weeklyIncrement);
    } else if (monthlyIncrement){
        nextReferenceDate.setMonth(nextReferenceDate.getMonth() + 1);
    }

    return nextReferenceDate;
};

incrementDatePeriodDown = function(){
    var nextReferenceDate = new Date(referenceDate.get());

    if(weeklyIncrement){
        nextReferenceDate.setDate(nextReferenceDate.getDate() - weeklyIncrement);
    } else if (monthlyIncrement){
        nextReferenceDate.setMonth(nextReferenceDate.getMonth() - 1);
    }

    return nextReferenceDate;
};

var compareDates = function(date1, date2){
    return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate();
};

Template.EnterHours.onCreated(function(){
	
});

Template.EnterHours.onRendered(function () {
	checkInOutTime.set(setRoundedTime());
});

Template.EnterHours.helpers({
	getThisPeriodStart: function(){
		let periodStart = new Date(getCurrentPayPeriodStartDate());
		return periodStart.toDateString();
	},

	getThisPeriodEnd: function(){
		let periodEnd = new Date(getCurrentPayPeriodEndDate());
		return periodEnd.toDateString();
	},

	getPeriodDates: function(){
		let employee = selectedEmployee.get();
		let periodStart = new Date(getCurrentPayPeriodStartDate());
		let periodEnd = new Date(getCurrentPayPeriodEndDate());
		let existingEntrySet = getThisPeriodTimeSheetEntries();
		
		var datesInPeriodSet = [];

		var newDate = new Date(periodStart);

		while (Number(newDate) <= Number(periodEnd)){
			datesInPeriodSet.push({date: new Date(newDate)});
			newDate.setDate(newDate.getDate() + 1);
		}	

		for (j = 0; j < datesInPeriodSet.length; j++){
			for (i = 0; i < existingEntrySet.length; i ++){
				// if(Number(existingEntrySet[i].date) == Number(datesInPeriodSet[j].date)){
				if(compareDates(existingEntrySet[i].date, datesInPeriodSet[j].date)){
					datesInPeriodSet[j].clockIn = existingEntrySet[i].clockIn || null;
					datesInPeriodSet[j].clockOut = existingEntrySet[i].clockOut || null;
					datesInPeriodSet[j].hours = existingEntrySet[i].hours || null;
				}
			}
		}

		return datesInPeriodSet;
	},

	isExistingEntry: function(clockIn, clockOut){
		if(clockOut || clockIn){
			return true;
		}
		return false;
	},

	isEmployeeUnlocked: function(){
		if(selectedEmployee.get()){
			return true;
			console.log(selectedEmployee.get());
		} 
		return false;
	},

	getSelectedEmployee: function(){
		return selectedEmployee.get();
	},

	getTodayDate: function(){
		return todayDate.toDateString();
	},

	getCreateNewEntryDate: function(){
		return createNewEntryDate.get();
	},

	isAlreadyCheckedInToday: function(){
		let employee = selectedEmployee.get();

		var recordExistIndex;

		if(employee.actualHours){
			for (entry = 0; entry < employee.actualHours.length; entry ++){
            	let entryDate = new Date(employee.actualHours[entry].date);
            	if(Maestro.Client.compareDates(entryDate, todayDate)){
            		recordExistIndex = entry;
            	}
            }

            if(recordExistIndex >= 0){
            	if(employee.actualHours[recordExistIndex].clockIn){
            		return true;
            	}
	        } else {
	        	return false;
	        }
        } else {
			return false;
        }
	},

	isAlreadyCheckedOutToday: function(){
		let employee = selectedEmployee.get();

		var recordExistIndex;

		if(employee.actualHours){
			for (entry = 0; entry < employee.actualHours.length; entry ++){
            	let entryDate = new Date(employee.actualHours[entry].date);
            	if(Maestro.Client.compareDates(entryDate, todayDate)){
            		recordExistIndex = entry;
            	}
            }

            if(recordExistIndex >= 0){
            	if(employee.actualHours[recordExistIndex].clockOut){
            		return true;
            	}
	        } else {
	        	return false;
	        }

        } else {
			return false;
        }
	},

	getTimeNow: function(){
		if(checkInOutTime.get()){
			return checkInOutTime.get().toLocaleTimeString();
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
		return selectedEntry.get();
	},

});

Template.EnterHours.events({
	'click .checkInOut': function(event, target){
		checkInOutTime.set(setRoundedTime());
		$('#checkInOut').openModal();
	},

	'click .editEntry': function(event, target){
		selectedEntry.set(this);
		$('#editEntryModal').openModal();
	},

	'click .deleteEntry': function(event, target){
		console.log(this);
		Meteor.call('employeeEntryDelete', selectedEmployee.get()._id, this.date, function(error, result){
			if (error){
				console.log(error);
			} else {
				Materialize.toast('Updated', 400);
			}
		});
	},

	'click .periodUp': function(event, target){
		referenceDate.set(new Date(incrementDatePeriodUp()));
	},

	'click .periodDown': function(event, target){
		referenceDate.set(new Date(incrementDatePeriodDown()));
	},

	'click .addNewEntry': function(event, target){
		var entry = {};
		entry.date = new Date(this.date);
		entry.clockIn = new Date(entry.date.getFullYear(), entry.date.getMonth(), entry.date.getDate(), 9,0,0,0);
		entry.clockOut = new Date(entry.date.getFullYear(), entry.date.getMonth(), entry.date.getDate(), 17,0,0,0);
		entry.hours = 8;
		selectedEntry.set(entry);
		$('#editEntryModal').openModal();
	},

	'click .editEntryIncrementUpCheckIn': function(event, target){
		let entry = selectedEntry.get();
		if(entry.clockIn){
			entry.clockIn.setMinutes(entry.clockIn.getMinutes() + 15);
		} else {
			entry.clockIn = new Date(entry.clockOut) || new Date(entry.date);
			entry.clockIn.setMinutes(entry.clockIn.getMinutes() + 15);
		}

		entry.hours = calcHours(entry.clockIn, entry.clockOut);

		selectedEntry.set(entry);
	},

	'click .editEntryIncrementDownCheckIn': function(event, target){
		let entry = selectedEntry.get();
		if(entry.clockIn){
			entry.clockIn.setMinutes(entry.clockIn.getMinutes() - 15);
		} else {
			entry.clockIn = new Date(entry.clockOut) || new Date(entry.date);
			entry.clockIn.setMinutes(entry.clockIn.getMinutes() - 15);
		}
		entry.hours = calcHours(entry.clockIn, entry.clockOut);
		selectedEntry.set(entry);
	},

	'click .editEntryIncrementUpCheckOut': function(event, target){
		let entry = selectedEntry.get();
		if(entry.clockOut){
			entry.clockOut.setMinutes(entry.clockOut.getMinutes() + 15);
		} else {
			entry.clockOut = new Date(entry.clockIn) || new Date(entry.date);
			entry.clockOut.setMinutes(entry.clockOut.getMinutes() + 15);
		}
		entry.hours = calcHours(entry.clockIn, entry.clockOut);
		selectedEntry.set(entry);
	},

	'click .editEntryIncrementDownCheckOut': function(event, target){
		let entry = selectedEntry.get();
		if(entry.clockOut){
			entry.clockOut.setMinutes(entry.clockOut.getMinutes() - 15);
		} else {
			entry.clockOut = new Date(entry.clockIn) || new Date(entry.date);
			entry.clockOut.setMinutes(entry.clockOut.getMinutes() - 15);
		}
		entry.hours = calcHours(entry.clockIn, entry.clockOut);
		selectedEntry.set(entry);
	},

	'click .confirmEntryEdit': function(event, target){
		let employeeId = selectedEmployee.get()._id;
		let entry = selectedEntry.get();

		console.log(employeeId, entry.clockIn, entry.clockOut, entry.date);

		Meteor.call('employeeCheckInOut', employeeId, entry.clockIn, entry.clockOut, entry.date, function(error, result){
			if (error){
				console.log(error);
			} else {
				Materialize.toast('Updated', 400);
			}
		});

		var employee = Meteor.call('verifyEmployeePin', enteredPin, passedEmployeeId, function(error, result){
			if (error){
				console.log(error);
			} else {
				selectedEmployee.set(result);
			}
		});
	},

	'click .incrementTimeUp': function(){
		var timeNow = new Date(checkInOutTime.get());
		timeNow.setMinutes(timeNow.getMinutes() + 15);
		checkInOutTime.set(timeNow);
	},

	'click .incrementTimeDown': function(){
		var timeNow = new Date(checkInOutTime.get());
		timeNow.setMinutes(timeNow.getMinutes() - 15);
		checkInOutTime.set(timeNow);
	},

	'click .confirmCheckIn': function(){
		let checkInTime = checkInOutTime.get();
		let employeeId = selectedEmployee.get()._id;

		Meteor.call('employeeCheckInOut', employeeId, checkInTime, null, null, function(error, result){
			if (error){
				console.log(error);
			} else {
				Materialize.toast('Great! ... Now get to work! :p', 400);
			}
		});

		var employee = Meteor.call('verifyEmployeePin', enteredPin, passedEmployeeId, function(error, result){
			if (error){
				console.log(error);
			} else {
				selectedEmployee.set(result);
			}
		});
	},

	'click .confirmCheckOut': function(){
		let checkOutTime = checkInOutTime.get();
		let employeeId = selectedEmployee.get()._id;

		Meteor.call('employeeCheckInOut', employeeId, null, checkOutTime, null, function(error, result){
			if (error){
				console.log(error);
			} else {
				Materialize.toast('Woohoo! :D', 400);
			}
		});

		var employee = Meteor.call('verifyEmployeePin', enteredPin, passedEmployeeId, function(error, result){
			if (error){
				console.log(error);
			} else {
				selectedEmployee.set(result);
			}
		});
	},

	'click .verifyPin': function(event, target){
		initEnterHours();

		enteredPin = document.getElementById('employeePin').value;

		var employee = Meteor.call('verifyEmployeePin', enteredPin, passedEmployeeId, function(error, result){
			if (error){
				console.log(error);
			} else {
				selectedEmployee.set(result);
			}
		});
	},

	'click .clearEmployee': function(){
		clearEmployeeInfo();
	},

});