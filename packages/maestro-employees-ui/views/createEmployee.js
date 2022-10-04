Maestro.Templates.CreateEmployee = "CreateEmployee";

Template.CreateEmployee.helpers({

});

Template.CreateEmployee.events({
	'click #createEmployee': function(event, target){
		event.preventDefault();

		$('#errorMessages').text("");

		var employeeName = document.getElementById('employeeName').value;
		var employeeEmail = document.getElementById('employeeEmail').value;
        var unformattedPhone = document.getElementById('employeePhone').value;
        var hourlyRate = Number(document.getElementById('employeeRate').value);

        var businessId = Maestro.Business.getBusinessId();

        var newEmployee = {businessId: businessId};  
    
		if (!employeeName.length){
            $('#errorMessages').text('Enter an employee name');
            return;
        }

		var nameMatch = _.pluck(Employees.find({name: employeeName}).fetch(),"name");

		if (nameMatch.length > 0){
			$('#errorMessages').text('Identical employee name already exists');
            return;
		}

        newEmployee.name = employeeName;

		if (!employeeEmail.length && !unformattedPhone.length){
            $('#errorMessages').text('Enter either an email or phone number');
            return;
        }

        if(employeeEmail.length){
            newEmployee.email = employeeEmail;
        }            

        if(hourlyRate > 0){
            newEmployee.rate = hourlyRate;
        } else {
            $('#errorMessages').text('Please enter a valid hourly rate');
            return;
        }

        var formattedPhone = "";

        for (i=0; i < unformattedPhone.length; i++){
            if (unformattedPhone[i] > -1){
                formattedPhone += unformattedPhone[i];
            }
        }

        if(formattedPhone.length){
            newEmployee.phone = Number(formattedPhone);
        }

        var dateToday = new Date();
        dateToday = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate());

        newEmployee.plannedHours = [{date: dateToday}];
        newEmployee.actualHours = [{date: dateToday}];
        newEmployee.status = "Active";

        Meteor.call("createNewEmployee", newEmployee, function(error, result) {
            if(error) {
                console.log(error);
            } else {
                Materialize.toast("Created a new employee", 4000);

                FlowRouter.go("/business/employees");
            }
        });

	},

	'click #cancelCreateEmployee': function(event, target){
		document.getElementById('enterEmployeeInfo').reset();
		FlowRouter.go("/business/employees");
	}

});