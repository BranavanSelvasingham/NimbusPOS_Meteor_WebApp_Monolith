Maestro.Employees = {};

Maestro.Employees.UpdateEmployee = function(employeeId, employeeDetails){
    var updated;

    try {
        updated = Employees.update(employeeId, {$set: employeeDetails});
    } catch(e){
        console.log("Error updating employee: " + e);
    }
};

Maestro.Employees.EmployeeCheckInOut = function(employeeId, checkInTime, checkOutTime, entryDate){
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

    var employee = Employees.findOne({_id: employeeId});
    var recordExistIndex;

    if(checkInTime){
        if(employee.actualHours){
            for (entry = 0; entry < employee.actualHours.length; entry ++){
                let entryDate = new Date(employee.actualHours[entry].date);

                if(Maestro.Client.compareDates(entryDate, checkInDate)){
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

                if(Maestro.Client.compareDates(entryDate, checkInDate)){
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

    try {
        updated = Employees.update(employeeId, {$set: {actualHours: employee.actualHours}});
        console.log(employee.name + " checked in/out");
        return updated;
    } catch(e){
        console.log("Error checking in: ", e);
    }
};

Maestro.Employees.EmployeeEntryDelete = function(employeeId, entryDate){
    var employee = Employees.findOne({_id: employeeId});
    employee.actualHours = _.reject(employee.actualHours, function(entry){
        return Maestro.Client.compareDates(entry.date, entryDate);
    });
    try {
        updated = Employees.update(employeeId, {$set: {actualHours: employee.actualHours}});
        Materialize.toast('Deleted entry', 800);
        return updated;
    } catch(e){
        console.log("Error deleting entry: ", e);
    }
};

Maestro.Employees.PushEmployeeHours = function(employeeId, hoursObj){
    var updates;

    try{
        updates = Employees.update(employeeId, {$push: hoursObj});
        console.log("Records updated: ", updates);
    } catch(e){
        console.log("Error updating product: ", e);
    }
};

Maestro.Employees.PullEmployeeHours = function(employeeId, hoursObj){
    var updated;

    try {
        updated = Employees.update(employeeId, {$pull: hoursObj});
    } catch(e){
        console.log("Error updating employee: " + e);
    }
};