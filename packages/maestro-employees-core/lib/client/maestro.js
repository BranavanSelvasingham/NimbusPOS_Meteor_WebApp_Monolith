var compareDates = function(date1, date2){
    // $("#temporaryConsole").append("<p>" + date1.getFullYear() + " == " + date2.getFullYear() + " && " + date1.getMonth() + " == " + date2.getMonth() + " && " + date1.getDate() + " == " + date2.getDate() + "</p>");
    return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate();
};

Maestro.Client.compareDates = compareDates;

Maestro.Client.getCurrentPayPeriodStartDate = function(referenceDate, referenceBusinessId){
    var businessId = referenceBusinessId || Maestro.Client.businessId();

    let business = Businesses.findOne({_id: businessId}) || {};

    if (business.payroll){
        if(referenceDate){
            var todayDate = new Date(referenceDate);
        } else {
            var todayDate = new Date();
        }
        todayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 0,0,0,0);

        var thisPeriodStart = new Date(todayDate);

        let referenceStart = new Date(business.payroll.referenceStartDate);
        let frequencyType = business.payroll.frequencyType;

        var weeklyIncrement = null;  
        var monthlyIncrement = null;

        if (frequencyType == "Weekly"){
            weeklyIncrement = 7;
        } else if (frequencyType == "Bi-Weekly"){
            weeklyIncrement = 14;
        } else if (frequencyType == "Monthly"){
            monthlyIncrement = 1;
        }

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
    } else {
        var todayDate = new Date();
        todayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 0,0,0,0);
        return todayDate;
    }
};

Maestro.Client.getCurrentPayPeriodEndDate = function(referenceDate, referenceBusinessId){
    var businessId = referenceBusinessId || Maestro.Client.businessId();

    let business = Businesses.findOne({_id: businessId}) || {};

    let startDate = new Date(Maestro.Client.getCurrentPayPeriodStartDate(referenceDate, referenceBusinessId));
    var endDate = new Date(startDate);

    if (business.payroll){
        let referenceStart = new Date(business.payroll.referenceStartDate);
        let frequencyType = business.payroll.frequencyType;

        var weeklyIncrement = null;  
        var monthlyIncrement = null;

        if (frequencyType == "Weekly"){
            weeklyIncrement = 7;
        } else if (frequencyType == "Bi-Weekly"){
            weeklyIncrement = 14;
        } else if (frequencyType == "Monthly"){
            monthlyIncrement = 1;
        }

        if(weeklyIncrement){
            endDate.setDate(startDate.getDate() + weeklyIncrement - 1);
        } else if (monthlyIncrement){
            endDate.setMonth(startDate.getMonth() + 1);
        }

        return endDate;
    }
};

Maestro.Client.getThisPeriodTimeSheetEntries = function(employeeId, referenceDate, referenceBusinessId){
    let startDate = new Date(Maestro.Client.getCurrentPayPeriodStartDate(referenceDate, referenceBusinessId));
    let endDate = new Date(Maestro.Client.getCurrentPayPeriodEndDate(referenceDate, referenceBusinessId));
    var nextStartDate = new Date(endDate);
    nextStartDate.setDate(endDate.getDate() + 1);

    let employee = Employees.findOne({_id: employeeId});

    // console.log('employee:', employee);
    // console.log('dates:', startDate, nextStartDate);

    if (employee.actualHours){
        var timeSheetSet = _.filter(employee.actualHours, function(entry){
            // console.log('compare entry', entry);
            // console.log('logic test', startDate, entry.date, nextStartDate);
            return entry.date >= startDate && entry.date < nextStartDate;
        });

        // console.log('timesheet set:', timeSheetSet);
        return timeSheetSet;
    }
};

Maestro.Client.getThisMonthTimeSheetEntries = function(employeeId, referenceDate){
    let startDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1, 0,0,0,1);
    let endDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1 , 1, 0,0,0,0);

    let employee = Employees.findOne({_id: employeeId});

    // console.log('employee:', employee);
    // console.log('dates:', startDate, endDate);

    if (employee.actualHours){
        var timeSheetSet = _.filter(employee.actualHours, function(entry){
            return entry.date >= startDate && entry.date < endDate;
        });

        // console.log('timesheet set:', timeSheetSet);
        return timeSheetSet;
    }
};

Maestro.Client.getAllEmployeeTimeEntriesForMonth = function (referenceDate) {
    let allEmployees = Employees.find({}).fetch();

    // console.log('all employees: ', allEmployees);

    let allTimeSheetEntries = _.map(allEmployees, function(employee){
        let employeeTime = Maestro.Client.getThisMonthTimeSheetEntries(employee._id, referenceDate);
        return _.map(employeeTime, function(entry){
            entry.employeeName = employee.name;
            return entry;
        });
    });

    // console.log('all time sheet entries: ', allTimeSheetEntries);

    let allEntriesJoint = [];

    _.each(allTimeSheetEntries, function(entrySet){
        $.merge(allEntriesJoint, entrySet);
    });

    // console.log('all entries joint: ', allEntriesJoint);

    return allEntriesJoint;

};

Maestro.Client.getThisPeriodTimeSheetTable = function(employeeId, referenceDate){
    let periodStart = new Date(Maestro.Client.getCurrentPayPeriodStartDate(referenceDate));
    let periodEnd = new Date(Maestro.Client.getCurrentPayPeriodEndDate(referenceDate));
    let existingEntrySet = Maestro.Client.getThisPeriodTimeSheetEntries(employeeId, referenceDate);

    // console.log('received timesheet set:', existingEntrySet);
    
    var datesInPeriodSet = [];

    var newDate = new Date(periodStart);

    while (Number(newDate) <= Number(periodEnd)){
        datesInPeriodSet.push({date: new Date(newDate)});
        newDate.setDate(newDate.getDate() + 1);
    }   

    for (j = 0; j < datesInPeriodSet.length; j++){
        for (i = 0; i < existingEntrySet.length; i ++){
            // console.log('logic test:', existingEntrySet[i].date, datesInPeriodSet[j].date);
            // if(Number(existingEntrySet[i].date) == Number(datesInPeriodSet[j].date)){
            if(compareDates(existingEntrySet[i].date, datesInPeriodSet[j].date)){
                datesInPeriodSet[j].clockIn = existingEntrySet[i].clockIn || null;
                datesInPeriodSet[j].clockOut = existingEntrySet[i].clockOut || null;
                datesInPeriodSet[j].hours = existingEntrySet[i].hours || null;
            }
        }
    }

    return datesInPeriodSet;


};

Maestro.Client.incrementDatePeriodUp = function(referenceDate, referenceBusinessId){
    var businessId = referenceBusinessId || Maestro.Client.businessId();

    let business = Businesses.findOne({_id: businessId}) || {};

    let frequencyType = business.payroll.frequencyType;

    var nextReferenceDate = new Date(referenceDate);
    var weeklyIncrement = null;  
    var monthlyIncrement = null;

    if (frequencyType == "Weekly"){
        weeklyIncrement = 7;
    } else if (frequencyType == "Bi-Weekly"){
        weeklyIncrement = 14;
    } else if (frequencyType == "Monthly"){
        monthlyIncrement = 1;
    }

    if(weeklyIncrement){
        nextReferenceDate.setDate(nextReferenceDate.getDate() + weeklyIncrement);
    } else if (monthlyIncrement){
        nextReferenceDate.setMonth(nextReferenceDate.getMonth() + 1);
    }

    return nextReferenceDate;
};

Maestro.Client.incrementDatePeriodDown = function(referenceDate, referenceBusinessId){
    var nextReferenceDate = new Date(referenceDate);
    var businessId = referenceBusinessId || Maestro.Client.businessId();

    let business = Businesses.findOne({_id: businessId}) || {};
    let frequencyType = business.payroll.frequencyType;

    var weeklyIncrement = null;  
    var monthlyIncrement = null;

    if (frequencyType == "Weekly"){
        weeklyIncrement = 7;
    } else if (frequencyType == "Bi-Weekly"){
        weeklyIncrement = 14;
    } else if (frequencyType == "Monthly"){
        monthlyIncrement = 1;
    }

    if(weeklyIncrement){
        nextReferenceDate.setDate(nextReferenceDate.getDate() - weeklyIncrement);
    } else if (monthlyIncrement){
        nextReferenceDate.setMonth(nextReferenceDate.getMonth() - 1);
    }

    return nextReferenceDate;
};