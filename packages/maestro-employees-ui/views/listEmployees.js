Maestro.Templates.ListEmployees = "ListEmployees";

Template.ListEmployees.onCreated(function(){
	let template = this;

	var originalName;
	var originalEmail;
	var originalPhone;

	template.selectedEmployee = new ReactiveVar();
	template.todayDate = new Date();
	template.todayDate = new Date(template.todayDate.getFullYear(), template.todayDate.getMonth(), template.todayDate.getDate(), 0, 0, 0, 0);

	template.referenceDate = new ReactiveVar();
	template.referenceDate.set(new Date(template.todayDate));

	template.editMode = new ReactiveVar();
	template.editMode.set(false);

	template.showDeactivatedMode = new ReactiveVar();
	template.showDeactivatedMode.set(false);
});

Template.ListEmployees.onRendered(function(){

});

Template.ListEmployees.helpers({
	businessSettingEmailOn: function(){
		let business = Businesses.findOne({_id: Maestro.Client.businessId()});
		if (business.configuration){
			if (business.configuration.emailHoursReminder){
				if (business.configuration.emailHoursReminder == true){
					return true;
				}
			}
		}
		return false;
	},

	payRollSettingsDone: function(){
		let business = Businesses.findOne({_id: Maestro.Client.businessId()});
		if(business){
			if(business.payroll){
				if(business.payroll.referenceStartDate && business.payroll.frequencyType){
					return true;
				}
			}
			return false;
		}
	},

	inEditMode: function(){
		return Template.instance().editMode.get();
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
		return Maestro.Client.getThisPeriodTimeSheetTable(employeeId, Template.instance().referenceDate.get());
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

	listActiveEmployees: function(){
		return Employees.find({status:'Active'},{sort: {name:1}}).fetch();
	},

	listDeactivatedEmployees: function(){
		return Employees.find({status:'Deactivated'},{sort: {name:1}}).fetch();
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

	phoneFormat: function(phone){
		var phoneNumber = String(phone);

		if (!phone){
			return "No phone on record";
		} else if (phoneNumber.length==10){			
			var formatPhone = "(";
			for (i=0; i<phoneNumber.length; i++){
				formatPhone += phoneNumber[i];
				if (i==2){
					formatPhone += ") ";
				} else if (i==5){
					formatPhone += "-";
				}
			}
			return formatPhone;
		} else {
			return "Partial / Unrecognized: " + phoneNumber;
		}
	},

	emailFormat: function(email){
		if (email){
			return email;
		} else {
			return "Email not on record";
		}
	},

	isEmailAvailable: function(email){
		if (email){
			return true;
		}
		return false;
	},

	isPhoneAvailable: function(phone){
		if (phone){
			return true;
		}
		return false;
	},

	getSelectedEmployee: function(){
		if(Template.instance().selectedEmployee.get()){
			return Employees.findOne({_id: Template.instance().selectedEmployee.get()._id});
		}
	},

	isEmployeeSelected: function(thisId){
		let employee = Template.instance().selectedEmployee.get();
		if (employee){
			if(employee._id == thisId){
				return true;
			}
		}
		return false;
	},

	isActiveEmployee: function(employeeId){
		let employee = Employees.findOne({_id: employeeId});

		if(employee.status == "Active"){
			return true;
		}
		return false;
	},

	getActualTimeSheet: function(employeeId){
		let employee = Employees.findOne({_id: employeeId});
		return employee.actualHours;
	},


	getActualTimeSheet: function(employeeId){
		let employee = Employees.findOne({_id: employeeId});
		return employee.plannedHours;
	},

	anyDeactivatedEmployees: function(){
		let deactivated = Employees.findOne({status: 'Deactivated'});
		if (deactivated){
			return true;
		}
		return false;
	},

	inShowDeactivatedMode: function(){
		return 	Template.instance().showDeactivatedMode.get();
	},

});

Template.ListEmployees.events({
	'click .selectEmployee': function(event, template){
		template.selectedEmployee.set(this);
	},

	'click .selectDeactivatedEmployee': function(event, template){
		template.selectedEmployee.set();
		let employee = Employees.findOne({_id: this._id});
		window.setTimeout(function(){template.selectedEmployee.set(employee);}, 100 );
	},

	'click .periodUp': function(event, template){
		template.referenceDate.set(Maestro.Client.incrementDatePeriodUp(template.referenceDate.get()));
	},

	'click .periodDown': function(event, template){
		template.referenceDate.set(Maestro.Client.incrementDatePeriodDown(template.referenceDate.get()));
	},

	'click .activateEmployee': function(event, template){
		event.preventDefault();
		let employeeId = template.selectedEmployee.get()._id;
        var activeStatus = document.getElementById('_activate').checked;
        var employeeDetails = {status: 'Active'};

        if(activeStatus){
        	Meteor.call("updateEmployee", employeeId, employeeDetails, function(error, result) {
	            if(error) {
	                console.log(error);
	            } else {
	                Materialize.toast("Reactivated employee", 4000);
	            }
        	});
        }
	},

	'click #showDeactivated': function(event, template){
		template.showDeactivatedMode.set(true);
	},

	'click #hideDeactivated': function(event, template){
		template.showDeactivatedMode.set(false);
	},

	'click .showEditCard': function(event, template){
		template.editMode.set(true);
	},

	'click .saveChanges': function(event, template){
        event.preventDefault();

        let employeeId = template.selectedEmployee.get()._id;

		var employeeName = document.getElementById('_employeeName').value;
		var employeeEmail = document.getElementById('_employeeEmail').value;
        var unformattedPhone = document.getElementById('_employeePhone').value;
        var activeStatus = document.getElementById('_deactivate').checked;
        var hourlyRate = Number(document.getElementById('_employeeRate').value);

        var employeeDetails = {};  
    
		if (!employeeName.length){
            Materialize.toast('Enter an employee name',1000);
            return;
        }

		// var nameMatch = Employees.find({name: employeeName}).fetch();

		// if (nameMatch.length > 0 && !(employeeId==nameMatch[0]._id)){
		// 	Materialize.toast('Identical employee name already exists',1000);
  //           return;
		// }

        employeeDetails.name = employeeName;

		if (!employeeEmail.length && !unformattedPhone.length){
            Materialize.toast('Enter either an email or phone number',1000);
            return;
        }

        // if(employeeEmail.length){
            employeeDetails.email = employeeEmail;
        // }            

        var formattedPhone = "";

        for (i=0; i < unformattedPhone.length; i++){
            if (unformattedPhone[i] > -1){
                formattedPhone += unformattedPhone[i];
            }
        }

        if(formattedPhone.length){
            employeeDetails.phone = Number(formattedPhone);
        }

        if(!activeStatus){
        	employeeDetails.status = "Deactivated";
        }

        if(hourlyRate > 0){
            employeeDetails.rate = hourlyRate;
        } else {
        	Materialize.toast('Please enter a valid hourly rate',1000);
            return;
        }

        Meteor.call("updateEmployee", employeeId, employeeDetails, function(error, result) {
            if(error) {
                console.log(error);
            } else {
                Materialize.toast("Updated employee details", 4000);
                template.editMode.set(false);
            }
        });

        template.selectedEmployee.set();
		let employee = Employees.findOne({_id: employeeId});
		window.setTimeout(function(){template.selectedEmployee.set(employee);}, 100 );
		template.editMode.set(false);

	},

	'click .clearChanges': function(event, template){
		template.editMode.set(false);
	},

	'click .emailReminder': function(event, template){
        let timeSheetEntries = Maestro.Client.getThisPeriodTimeSheetEntries(template.selectedEmployee.get()._id, template.todayDate);

        let totalPeriodHours = _.reduce(timeSheetEntries, 
        	function(memo, entry){ 
        		if(entry.hours){
        			return memo + entry.hours;
        		} else {
        			return memo + 0;
        		}
        	}, 0);

		Meteor.call('emailEmployeeReminder', template.selectedEmployee.get(), totalPeriodHours, function(error, resutl){
			if(error){
				console.log(error);
			} else {
				Materialize.toast("Reminder Sent to " + template.selectedEmployee.get().name, 4000);
			}
		});
	}
	
});