Maestro.Contact.Employee = {};
Maestro.Contact.Employee.HoursReminder = {};

var _emailHoursReminder = function(employee, totalPeriodHours){
	if(employee.email){
		let businessId = employee.businessId;
	    let business = Businesses.findOne({_id: businessId});
		let toEmail =[employee.email]; //, "arpitnamdeo@gmail.com"];
		let fromEmail = "info@nimbuspos.com";
		let subjectLine = "A reminder to enter those hard earned hours!";
		let messageBody = "";
		var reminderBody = "";

		let referenceStartDate = String(Number(business.payroll.referenceStartDate));
		let frequencyType = business.payroll.frequencyType;
		
		var incrementCode;
		if (frequencyType == "Weekly"){
            incrementCode = '7D';
        } else if (frequencyType == "Bi-Weekly"){
            incrementCode = '14D';
        } else if (frequencyType == "Monthly"){
            incrementCode = '1M';
        }

		let employeeSpecificLink = "http://www.nimbuspos.com/ex/enterHours?" + employee._id + "&" + referenceStartDate + "&" + incrementCode;
		// let employeeSpecificLink = "http://localhost:3000/ex/enterHours?"+employee._id;

		let reminderHeaderHTML = "<h1>Reminder:</h1>";

		var reminderLinesHTML = [];
		reminderLinesHTML[0] = "<p>Hello " + employee.name + ",<br><br>This is a reminder to enter your hours for this pay period. \
								You can go to your specific time sheet by clicking on the link below.</p>";

		if(totalPeriodHours > -1){
			reminderLinesHTML[1] = "<h5>You have logged <b>" + totalPeriodHours + " hours</b> for this period so far.</h5>";	
		} else {
			reminderLinesHTML[1] = "";
		}			

		console.log(totalPeriodHours);

		reminderLinesHTML[2] = "";

		reminderLinesHTML[3] = "";

		reminderLinesHTML[4] = '<table width="100%" border="0" cellspacing="0" cellpadding="0" align="center"> \
								  <tr> \
								    <td> \
								      <table border="0" cellspacing="0" cellpadding="0"> \
								        <tr> \
								          <td bgcolor="#039be5" style="padding: 12px 18px 12px 18px; -webkit-border-radius:3px; border-radius:3px" align="center"><a href="'+employeeSpecificLink+'" target="_blank" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; display: inline-block;">Timesheet &rarr;</a></td> \
								        </tr> \
								      </table> \
								    </td> \
								  </tr> \
								</table>';

		reminderBody = reminderHeaderHTML + "<hr>" + reminderLinesHTML.join("");

		let reminderBox = "<div style='border-style: outset; \
									width: 350px; \
									color: black; \
									background-color: white; \
									padding-top: 10px; \
									padding-right: 10px; \
									padding-bottom: 10px; \
									padding-left: 20px;'>" + reminderBody + "</div>";
		// width: 300px; background-color: white; box-shadow: 5px 5px 3px #888888;
		let htmlBody = reminderBox;

		// var customerName, businessName, itemName, addOnName

		Maestro.Notifications.Email.Send(toEmail, fromEmail, subjectLine, messageBody, htmlBody);
	}
};

Maestro.Contact.Employee.HoursReminder.Send = _emailHoursReminder;


