Maestro.Templates.SetupRemindersEmployees= "SetupRemindersEmployees";

Template.SetupRemindersEmployees.onCreated(function(){
	let template = this;

	template.todayDate = new Date();
	template.todayDate = new Date(template.todayDate.getFullYear(), template.todayDate.getMonth(), template.todayDate.getDate(), 0, 0, 0, 0);

	template.referenceDate = new ReactiveVar();
	template.referenceDate.set(new Date(template.todayDate));
});

Template.SetupRemindersEmployees.onRendered(function(){
	$('select').material_select();
});

Template.SetupRemindersEmployees.helpers({
	existingReminders: function(){
		return Reminders.find({});
	},

	getReferenceDateWeekDay: function(){
		weekDaySet = []
		return 
	}

});

Template.SetupRemindersEmployees.events({
	'click .deleteReminder': function(event, template){
		var element = event.target;
		var reminderId = element.dataset.reminderid;

		Meteor.call('deleteReminder', reminderId, function(error, result){
			if (error){
				console.log("error: ", error)
			} else {
				Materialize.toast("Deleted Reminder",1000);
			}
		});
	},

	'click .sendEmployeeReminders': function(event, template){
		let employees = Employees.find({status: 'Active'}).fetch();

		for (emp = 0; emp < employees.length; emp ++){
	        let timeSheetEntries = Maestro.Client.getThisPeriodTimeSheetEntries(employees[emp]._id, template.todayDate);

	        let totalPeriodHours = _.reduce(timeSheetEntries, function(memo, entry){ return memo + entry.hours;}, 0);

			Meteor.call('emailEmployeeReminder', employees[emp], totalPeriodHours, function(error, resutl){
				if(error){
					console.log(error);
				} 
			});
		}
	},

	'click #createReminder': function(event, template){
		var weekDayObj = document.getElementById('weekDayField');
		var weekDay = weekDayObj.options[weekDayObj.selectedIndex].text;
		var hourField = Number(document.getElementById('hourField').value);
		var minutesField = Number(document.getElementById('minutesField').value);
		var amPMFieldObj = document.getElementById('amPMField');
		var amPMField = amPMFieldObj.options[amPMFieldObj.selectedIndex].text;

		var minutesText = document.getElementById('minutesField').value;

		if (minutesField <0 || minutesField>59){
			return;
		} else if (minutesField<10){
			minutesText = "0"+ String(minutesField);
		}
		// var frequencyText = "on every " + weekDay + " at " + hourField + ":" + minutesText + " " + amPMField;
		var frequencyText = "at " + hourField + ":" + minutesText + " " + amPMField + " every " + weekDay;
		console.log(frequencyText);

		var businessId = Maestro.Business.getBusinessId();

		var reminderDetails = {
			businessId : businessId,
			name: "Employees Hours Entry",
			details: "Remind all employees to enter hours " + frequencyText
		}

		Meteor.call('remindEmployees', frequencyText, reminderDetails, function(error, result){
			if (error){
				console.log("error: ", error)
			} else {
				Materialize.toast("Created Reminder",1000);
			}
		});

	},

});