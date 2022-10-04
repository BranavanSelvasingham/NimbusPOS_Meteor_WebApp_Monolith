Maestro.Reminders = {};
Maestro.Reminders.Employees = {};

var _setUpEmployeeEmailReminders = function(reminderId, frequencyText){
	var jobFunction = function(){
		var employeesList = Employees.find({status: 'Active'}).fetch();

		for (i=0; i<employeesList.length; i++){
			Maestro.Contact.Employee.HoursReminder.Send(employeesList[i])
		}

		console.log('sent out periodidc reminders to employees');
	};

	Maestro.Scheduler.Create(reminderId, frequencyText, jobFunction);

};

var _deleteReminder = function(reminderId){
	Maestro.Scheduler.Delete(reminderId);
};

Maestro.Reminders.Employees.Create = _setUpEmployeeEmailReminders;
Maestro.Reminders.Employees.Delete = _deleteReminder;