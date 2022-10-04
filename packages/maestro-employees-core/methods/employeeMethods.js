//employee methods
var compareDates = function(date1, date2){
    return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate();
};


Meteor.methods({
	createNewEmployee: function(newEmployee){
        check(newEmployee, Maestro.Schemas.Employee);

        var employeeId;

        try{
            employeeId = Employees.insert(newEmployee);
        } catch(e){
            console.log("Error creating employee: " + e);
        }

    },

    verifyEmployeePin: function(enteredPin, employeeId){
        if(Meteor.isServer){
            let employee = Employees.findOne({_id: employeeId});
            
            if(employee.pin == "" || !employee.pin){  // temporary measure for older employee records without a pin attribute
                return employee;
            }

            if(enteredPin == employee.pin){
                return employee;
            } else {
                return null;
            }
        }
    },

    updateEmployee: function(employeeId, employeeDetails){
        var updated;

        try {
            updated = Employees.update(employeeId, {$set: employeeDetails});
        } catch(e){
            console.log("Error updating employee: " + e);
        }
    },

    emailEmployeeReminder: function(employee, totalPeriodHours){
        if(Meteor.isServer){
            Maestro.Contact.Employee.HoursReminder.Send(employee, totalPeriodHours);
        }
    },

    employeeCheckInOut: function(employeeId, checkInTime, checkOutTime, entryDate){
        if(entryDate){
             var checkInDate = new Date(entryDate);
        } else {
            if(checkInTime){
                var checkInDate = new Date(checkInTime.getFullYear(), checkInTime.getMonth(), checkInTime.getDate(), 0,0,0,0);
            }

            if (checkOutTime){
                var checkInDate = new Date(checkOutTime.getFullYear(), checkOutTime.getMonth(), checkOutTime.getDate(), 0,0,0,0);
            }
        }

        console.log(checkInDate);

        var employee = Employees.findOne({_id: employeeId});
        var recordExistIndex;

        if(checkInTime){
            if(employee.actualHours){
                for (entry = 0; entry < employee.actualHours.length; entry ++){
                    let entryDate = new Date(employee.actualHours[entry].date);

                    if(compareDates(entryDate, checkInDate)){
                        recordExistIndex = entry;
                    }
                }
            } else {
                employee.actualHours = [];
                recordExistIndex = -1;
            }

            if(recordExistIndex >= 0){
                employee.actualHours[recordExistIndex].clockIn = checkInTime;

                let clockInTime = employee.actualHours[recordExistIndex].clockIn;
                let clockOutTime = employee.actualHours[recordExistIndex].clockOut;

                if(clockOutTime){
                    let difference = Math.round((clockOutTime.getTime() - clockInTime.getTime())/(1000*60*60)*100)/100;
                    employee.actualHours[recordExistIndex].hours = difference;
                }
            } else {
                employee.actualHours.push({
                    date: checkInDate,
                    clockIn: new Date(checkInTime)
                });
            }
        }

        if(checkOutTime){
            if(employee.actualHours){
                for (entry = 0; entry < employee.actualHours.length; entry ++){
                    let entryDate = new Date(employee.actualHours[entry].date);

                    if(compareDates(entryDate, checkInDate)){
                        recordExistIndex = entry;
                    }
                }
            } else {
                employee.actualHours = [];
                recordExistIndex = -1;
            }


            if(recordExistIndex >= 0){
                employee.actualHours[recordExistIndex].clockOut = checkOutTime;
            } 

            let clockInTime = employee.actualHours[recordExistIndex].clockIn;
            let clockOutTime = employee.actualHours[recordExistIndex].clockOut;

            let difference = Math.round((clockOutTime.getTime() - clockInTime.getTime())/(1000*60*60)*100)/100;
            employee.actualHours[recordExistIndex].hours = difference;
        }

        var updated;

        console.log(employee.actualHours);

        try {
            updated = Employees.update(employeeId, {$set: {actualHours: employee.actualHours}});
            console.log(employee.name + " checked in");
        } catch(e){
            console.log("Error checking in: ", e);
        }
    },

    employeeEntryDelete: function(employeeId, entryDate){
        var employee = Employees.findOne({_id: employeeId});
        employee.actualHours = _.reject(employee.actualHours, function(entry){
            return compareDates(entry.date, entryDate);
        });
        try {
            updated = Employees.update(employeeId, {$set: {actualHours: employee.actualHours}});
            console.log('deleted entry');
        } catch(e){
            console.log("Error deleting entry: ", e);
        }

    },

    pushEmployeeHours: function(employeeId, hoursObj){
        var updates;

        try{
            updates = Employees.update(employeeId, {$push: hoursObj});
            console.log("Records updated: ", updates);
        } catch(e){
            console.log("Error updating product: ", e);
        }

    },

    pullEmployeeHours: function(employeeId, hoursObj){
        var updated;

        try {
            updated = Employees.update(employeeId, {$pull: hoursObj});
        } catch(e){
            console.log("Error updating employee: " + e);
        }
    },
// 
});