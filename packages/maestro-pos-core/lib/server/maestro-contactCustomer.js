Maestro.Contact.Customer = {};
Maestro.Contact.Customer.Receipt = {};

var formatOrderDateAndTime = function(orderDate){
    let dateOfOrder = new Date(orderDate);
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return dateOfOrder.getDate() + "-" + months[dateOfOrder.getMonth()] + " | " + orderDate.toLocaleTimeString();
};


Maestro.Contact.Customer.Receipt.Send = function(order){
	let customer = Customers.findOne({_id: order.customerId});
	let businessId = order.businessId;
    let business = Businesses.findOne({_id: businessId});

	let toEmail =[customer.email]; //, "arpitnamdeo@gmail.com"];
	let fromEmail = "receipts@nimbuspos.com";
	let subjectLine = business.name + " Receipt - Thank you!";
	let messageBody = "";
	var receiptBody = "";
	
	let orderItems = order.items;

	var productName, productPrice, productQuantity, productSize, itemHtmlLine;
	itemHtmlLine = "";

	var dailyOrderNumber = order.dailyOrderNumber;
	var formattedOrderNumber = "";
	if (dailyOrderNumber){
        if (dailyOrderNumber < 10){
            formattedOrderNumber = "#00"+String(dailyOrderNumber);
        } else if (dailyOrderNumber <100){
            formattedOrderNumber = "#0"+String(dailyOrderNumber);
        } else {
            formattedOrderNumber = '#'+String(dailyOrderNumber);
        }
    }

	orderHeaderHTML = "<h1>Order Summary: <a style='float:right;'>"+formattedOrderNumber+"</a></h1>";

	for (i = 0; i < orderItems.length; i ++){
		productName = orderItems[i].product.name;
		productPrice = orderItems[i].total;
		productQuantity = orderItems[i].quantity;
		productSize = _.find(Maestro.Products.Sizes, function(size){return size.code == orderItems[i].size.code;});
		productSize = productSize.label;
		// productSize = orderItems[i].size.code;

		var addOnsLineHTML = "<li><i>" + productSize + "<a style='float:right;'> $" + String(orderItems[i].size.price.toFixed(2)) + "ea. </a></i></li>";

		for (add=0; add < orderItems[i].addOns.length; add++ ){
			addOnsLineHTML += "<li><i> + " + orderItems[i].addOns[add].name + "<a style='float:right;'> $" + String(orderItems[i].addOns[add].price.toFixed(2)) + "ea.    </a></i></li>";
		}

		addOnsLineHTML =  "<ul style='list-style-type:none;'>"+addOnsLineHTML+"</ul>";

		itemHtmlLine += "<li>"+ "x" + productQuantity+ " " + productName + "<a style='float:right;'> $" + productPrice.toFixed(2) + "</a>" + addOnsLineHTML + "</li>";
	}
	
	itemHtmlLine = "<ul style='list-style-type:none'>"+itemHtmlLine + "</ul>";
	
	var orderSubtotals = "<ul style='list-style-type:none'><hr>";

	orderSubtotals += "<li>"+ "Subtotal" + "<a style='float:right;'> $" + order.subtotals.subtotal.toFixed(2) + "</a>" + "</li>";
	
	if(order.subtotals.discount > 0){
		orderSubtotals += "<li>"+ "Discounts" + "<a style='float:right;'> -$" + order.subtotals.discount.toFixed(2) + "</a>" + "</li>";
	}
	
	if(order.subtotals.adjustments > 0){
		orderSubtotals += "<li>"+ "Adjustments" + "<a style='float:right;'> -$" + order.subtotals.adjustments.toFixed(2) + "</a>" + "</li>";
	}

	orderSubtotals += "<li>"+ "Taxes " + "<a style='float:right;'> $" + order.subtotals.tax.toFixed(2) + "</a>" + "</li>";
	orderSubtotals += "<hr>";
	orderSubtotals += "<li><b>"+ "Total" + "<a style='float:right;'> $" + order.subtotals.total.toFixed(2) + "</a>" + "</b></li>";
	orderSubtotals += "<hr></ul>";	

	let paymentHTMLLine = "";

    let giftCards = order.payment.giftCards;

    var giftCardTotal = _.reduce(giftCards, function(memo, num){return memo + num.redeemedAmount;}, 0);

    if (giftCardTotal > 0){
        paymentHTMLLine += "<li>"+ "Gift Card " + "<a style='float:right;'> - $" + giftCardTotal.toFixed(2) + "</a>" + "</li>";
    	paymentHTMLLine += "<li>"+ Maestro.Payment.MethodsEnum.get(order.payment.method, "label") + "<a style='float:right;'> - $" + order.payment.received.toFixed(2) + "</a>" + "</li>";
    } else if (order.payment.amount > 0){
		paymentHTMLLine += "<li>"+ Maestro.Payment.MethodsEnum.get(order.payment.method, "label") + "<a style='float:right;'> - $" + order.payment.received.toFixed(2) + "</a>" + "</li>"    
    }

    paymentHTMLLine = "<ul style='list-style-type:none'>" + paymentHTMLLine + "</ul>";

    let orderDetails = "<p>Order#:" + order.uniqueOrderNumber + "<a style='float:right;'>" + formatOrderDateAndTime(order.createdAt) + "</a></p>";

	receiptBody = orderHeaderHTML + orderDetails + "<hr>" + itemHtmlLine + orderSubtotals + paymentHTMLLine;

	let receiptBox = "<div style='border-style: outset; \
								width: 350px; \
								color: black; \
								background-color: white; \
								padding-top: 10px; \
								padding-right: 10px; \
								padding-bottom: 10px; \
								padding-left: 20px;'>" + receiptBody + "</div>";
	// width: 300px; background-color: white; box-shadow: 5px 5px 3px #888888;
	let htmlBody = receiptBox;

	// var customerName, businessName, itemName, addOnName

	Maestro.Notifications.Email.Send(toEmail, fromEmail, subjectLine, messageBody, htmlBody);
};


Maestro.Contact.Customer.emailInstructionsTrackLoyalty = function(customerId){
	let customer = Customers.findOne({_id: customerId});
	let businessId = customer.businessId;
    let business = Businesses.findOne({_id: businessId});

	let toEmail =[customer.email]; //, "arpitnamdeo@gmail.com"];
	let fromEmail = "My Nimbus <do-not-reply@nimbuspos.com>";
	let subjectLine = business.name + " - How to track your loyalty cards.";
	
	let messageBody = "";

	let title = "<h3>How to track your " + business.name + " loyalty cards:</h3>";

	let allCompanyBlocks = "";

	let instructionsBlock = '<table border="0" cellpadding="0" cellspacing="0" width="100%">\
							<tr> \
								<td style="padding: 10px 0 30px 0;"> \
									Please go to <a href="my.nimbuspos.com">my.nimbuspos.com</a> to track your loyalty card balances.<br> \
									Use this email address to register or to request an email of your latest loyalty card balances. \
								</tb>\
							</tr>\
						</table>';

	let htmlBody = "<!DOCTYPE html> \
					<html> \
						<head> \
							<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' /> \
							<title>Demystifying Email Design</title> \
							<meta name='viewport' content='width=device-width, initial-scale=1.0'/> \
						</head> \
						<body>" + 
							title +
							instructionsBlock + 
						"</body> \
					</html>";

	Maestro.Notifications.Email.Send(toEmail, fromEmail, subjectLine, messageBody, htmlBody);
};
