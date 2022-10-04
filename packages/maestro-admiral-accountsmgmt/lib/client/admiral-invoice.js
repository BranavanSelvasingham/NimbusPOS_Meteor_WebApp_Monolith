Maestro.Invoices = {};
Maestro.Invoices.Reminders = {};

var getMonthName = function(monthNum){
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNum];
};

Maestro.Invoices.Reminders.Send = function(invoiceId){
	let invoice = Invoices.findOne({_id: invoiceId});
	if(!invoice){return;}

	let business = Businesses.findOne({_id: invoice.businessId});
	let toEmail = business.email;
	let businessName = business.name;

	if(!toEmail){
		console.log('Business email not specified'); 
		return;
	}

	let fromEmail = "invoice@nimbuspos.com";
	let subjectLine = "Nimbus POS Invoice for " + getMonthName(invoice.billingMonth) + ", " + invoice.billingYear;
	let messageBody = "";
	let invoiceBody = "";

	invoiceBusinessName = "<h3>"+businessName+"</h3>";

	invoiceHeaderHTML = "<h2>Your invoice for " + getMonthName(invoice.billingMonth) + ", " + invoice.billingYear + " is ready</h2>";	

	linkHeaderHTML = "<h5>Please go to www.nimbuspos.com/account for full details.</h5>";

	paymentDueDateHTML = "";

	if (invoice.paymentDue.toFixed(2) == "0.00"){
		invoiceSummary = "<h3>" + getMonthName(invoice.billingMonth) + ", " + invoice.billingYear + "<a style='float:right; color:green;'>FREE</a></h3>";
	} else {
		invoiceSummary = "<h3>" + getMonthName(invoice.billingMonth) + ", " + invoice.billingYear + "<a style='float:right;'>$ "+invoice.paymentDue.toFixed(2)+"</a></h3>";
		paymentDueDateHTML = "<h5><a style='float:right;'>Due by: "+invoice.paymentDueDate.toDateString()+"</a></h5>";
	}

	invoiceBody = invoiceBusinessName + invoiceHeaderHTML + linkHeaderHTML + "<hr>" + invoiceSummary + "<hr>" + paymentDueDateHTML + "<br>&nbsp;<br>"; // + productsTableHTML;

	let invoiceBox = "<div style='border-style: outset; \
								width: 400px; \
								color: black; \
								background-color: white; \
								padding-top: 10px; \
								padding-right: 10px; \
								padding-bottom: 10px; \
								padding-left: 20px;'>" + invoiceBody + "</div>";
	// width: 300px; background-color: white; box-shadow: 5px 5px 3px #888888;
	let htmlBody = invoiceBox;

	Meteor.call('sendEmail', toEmail, fromEmail, subjectLine, messageBody, htmlBody, function(error, result){
		if(error){
			Materialize.toast('Email Failed To Send', 2000, 'rounded red');
		} else {
			Materialize.toast('Emailed Reminder', 2000, 'rounded green');
		}
	});

	Meteor.call('sendEmail', 'info@nimbuspos.com', fromEmail, subjectLine, messageBody, htmlBody, function(error, result){
		if(error){
			Materialize.toast('Email Failed To Send', 2000, 'rounded red');
		} else {
			Materialize.toast('Emailed Reminder', 2000, 'rounded green');
		}
	});
};