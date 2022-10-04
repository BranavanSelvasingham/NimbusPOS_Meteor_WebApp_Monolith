Maestro.Templates.HoursSummary = "HoursSummary";


Template.HoursSummary.onCreated(function(){
	let template = this;

	template.todayDate = new Date();
	template.todayDate = new Date(template.todayDate.getFullYear(), template.todayDate.getMonth(), template.todayDate.getDate(), 0, 0, 0, 0);

	template.referenceDate = new ReactiveVar();
	template.referenceDate.set(new Date(template.todayDate));

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

});

Template.HoursSummary.onRendered(function () {

});

Template.HoursSummary.helpers({
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

	getFullSummary: function(){
		var allActiveEmployees = Employees.find({status: "Active"}).fetch();
		var employeeSummary = [];

		allActiveEmployees = _.sortBy(allActiveEmployees, 'name');

		let periodStart = new Date(Maestro.Client.getCurrentPayPeriodStartDate(Template.instance().referenceDate.get()));
		let periodEnd = new Date(Maestro.Client.getCurrentPayPeriodEndDate(Template.instance().referenceDate.get()));

		for (emp = 0; emp < allActiveEmployees.length; emp ++){
			var datesInPeriodSet = [];

			var newDate = new Date(periodStart);

			while (Number(newDate) <= Number(periodEnd)){
				datesInPeriodSet.push({date: new Date(newDate)});
				newDate.setDate(newDate.getDate() + 1);
			}
		
			var employeeId = allActiveEmployees[emp]._id;
			var existingEntrySet = Maestro.Client.getThisPeriodTimeSheetEntries(employeeId, Template.instance().referenceDate.get());
			var totalHours = 0;
			
			for (j = 0; j < datesInPeriodSet.length; j++){
				for (i = 0; i < existingEntrySet.length; i ++){
					// if(Number(existingEntrySet[i].date) == Number(datesInPeriodSet[j].date)){
					if(Maestro.Client.compareDates(existingEntrySet[i].date, datesInPeriodSet[j].date)){
						datesInPeriodSet[j].clockIn = existingEntrySet[i].clockIn || null;
						datesInPeriodSet[j].clockOut = existingEntrySet[i].clockOut || null;
						datesInPeriodSet[j].hours = existingEntrySet[i].hours || null;
						totalHours += datesInPeriodSet[j].hours;
					}
				}
			}

			employeeSummary.push({employee: allActiveEmployees[emp], periodHours: datesInPeriodSet, totalHours: totalHours});
		}

		return employeeSummary;
	},

	getPeriodDateHeaders: function(){
		let periodStart = new Date(Maestro.Client.getCurrentPayPeriodStartDate(Template.instance().referenceDate.get()));
		let periodEnd = new Date(Maestro.Client.getCurrentPayPeriodEndDate(Template.instance().referenceDate.get()));
		
		var datesInPeriodSet = [];

		var newDate = new Date(periodStart);

		while (Number(newDate) <= Number(periodEnd)){
			datesInPeriodSet.push({date: new Date(newDate)});
			newDate.setDate(newDate.getDate() + 1);
		}

		return datesInPeriodSet;
	},

	listActiveEmployees: function(){
		return Employees.find({status:'Active'},{sort: {name:1}});
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

	formatHeaderDay: function(date){
		var dayOfWeek = date.getDay();
		var week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

		return week[dayOfWeek];
	},

	formatHeaderDateMonth: function(date){
		var monthNum = date.getMonth();
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		var dateString = date.getDate() + " - " + months[monthNum];

		return dateString;
	},

	isItToday: function(date){
		today = new Date();
		current = new Date(date);

		if ((today.getDate() == current.getDate())&&(today.getMonth() == current.getMonth())&&(today.getYear() == current.getYear())){
			return "#c8e6c9";
		}
	},

});

Template.HoursSummary.events({
	'click .periodUp': function(event, template){
		template.referenceDate.set(Maestro.Client.incrementDatePeriodUp(template.referenceDate.get()));
	},

	'click .periodDown': function(event, template){
		template.referenceDate.set(Maestro.Client.incrementDatePeriodDown(template.referenceDate.get()));
	},


});