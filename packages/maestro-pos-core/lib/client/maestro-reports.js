Maestro.Reports = {};
Maestro.Reports.Daily = {};

var getSelectedDailyDate = function(reportDate){ 
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

    dailyDate = new Date(reportDate);

    return weekdays[dailyDate.getDay()]+", " + months[dailyDate.getMonth()] + " " + dailyDate.getDate() +  ", " + dailyDate.getFullYear();
};

Maestro.Reports.Daily.Send = function(reportDate){
	let dailyDate = new Date(reportDate);
	let nextDay = new Date(dailyDate);
	nextDay.setDate(nextDay.getDate()+1);

	// let customer = Customers.findOne({_id: order.customerId});
	let businessId = Maestro.Business.getBusinessId();
    let business = Maestro.Business.getBusiness();
    let location = Maestro.Business.getLocation();

	let toEmail =business.email;

	if(!toEmail){
		console.log('Business email not specified'); 
		return;
	}

	let fromEmail = "info@nimbuspos.com";
	let subjectLine = business.name +" (" + location.name + ") " + " Report - " + getSelectedDailyDate(dailyDate);
	let messageBody = "";
	let receiptBody = "";

	reportHeaderHTML = "<h2>Summary Report: " + getSelectedDailyDate(dailyDate) + " </h2>";	

	locationHeaderHTML = "<h4>" + business.name +" (" + location.name + ") "+ "</h4>";

	let totalTaxes = Maestro.Atlas.Tally.TaxComponentTotal('total', dailyDate);
	let totalGSTTaxes = Maestro.Atlas.Tally.TaxComponentTotal('gst', dailyDate);
	let totalHSTTaxes = Maestro.Atlas.Tally.TaxComponentTotal('hst', dailyDate);
	let totalPSTTaxes = Maestro.Atlas.Tally.TaxComponentTotal('pst', dailyDate);

	let grandTotal = "";

	if (totalHSTTaxes == 0 && totalGSTTaxes ==0 && totalPSTTaxes == 0){
		grandTotal = "<table style='width:100%;'><tr><th><h5>Grand Total</h5></th><th><h5>Taxes</h5></th><th><h5>Orders</h5></th></tr>" + 
						"<tr><th><h3>$" + Maestro.Atlas.Tally.TotalOrderSales(dailyDate).toFixed(2) + "</h3></th><th><h3>$" + totalTaxes.toFixed(2) + "</h3></th><th><h3>x" + Maestro.Atlas.Tally.TotalOrderCount(dailyDate) + "</h3></th></tr></table>";
	} else {
		// grandTotal = "<table style='width:100%;'><tr><th><h5>Grand Total</h5></th><th><h5>GST</h5></th><th><h5>HST</h5></th><th><h5>Orders</h5></th></tr>" + 
		// 				"<tr><th><h3>$" + Maestro.Atlas.Tally.TotalOrderSales(dailyDate).toFixed(2) + "</h3></th><th><h3>$" + totalGSTTaxes.toFixed(2) + "</h3></th><th><h3>$" + totalHSTTaxes.toFixed(2) + "</h3></th><th><h3>x" + Maestro.Atlas.Tally.TotalOrderCount(dailyDate) + "</h3></th></tr></table>";
		
		grandTotal = "<table style='width:100%;'><tr><th><h5>Grand Total</h5></th>";
		
		_.each(Maestro.Tax.GetTaxComponentKeysForLocation(), function(taxComponent){
			grandTotal += "<th><h5>" + taxComponent.label +"</h5></th>";
		});

		grandTotal += "<th><h5>Orders</h5></th></tr>" + 
						"<tr><th><h3>$" + Maestro.Atlas.Tally.TotalOrderSales(dailyDate).toFixed(2) + "</h3></th>";

		_.each(Maestro.Tax.GetTaxComponentKeysForLocation(), function(taxComponent){
			let taxAmount = Maestro.Atlas.Tally.TaxComponentTotal(taxComponent.key, dailyDate);

			grandTotal += "<th><h3>$" + taxAmount.toFixed(2) + "</h3></th>";
		});

		grandTotal += "<th><h3>x" + Maestro.Atlas.Tally.TotalOrderCount(dailyDate) + "</h3></th></tr></table>";
		
	}

	// grandTotal = "<h5>Total<a style='float:right;'>Orders</a></h5>"+
	// 					"<h3>$"+ Maestro.Atlas.Tally.TotalOrderSales(dailyDate).toFixed(2) +"<a style='float:right;'>x"+ Maestro.Atlas.Tally.TotalOrderCount(dailyDate) +"</a></h3>";

	let cashSales = Maestro.Atlas.Tally.Daily.CashSales(dailyDate);
	let cardSales = Maestro.Atlas.Tally.Daily.CreditDebitSales(dailyDate);
	let giftCardRedemptions = Maestro.Atlas.Tally.Daily.GiftCardRedemptions(dailyDate);
	let tipsGiven = Maestro.Atlas.Tally.Daily.TipsGiven(dailyDate);

	let cashSalesHTML = "";
	let cardSalesHTML = "";

	if (totalHSTTaxes == 0 && totalGSTTaxes ==0 && totalPSTTaxes == 0){
		cashSalesHTML = "<p><b>Cash:</b></p>" + 
							"<p>&nbsp;&nbsp;&nbsp;Grand Total: $"+ (cashSales.grandTotal).toFixed(2) +"</p>" + 
							// "<p>&nbsp;&nbsp;&nbsp;Net Sales: $"+ cashSales.total.toFixed(2) +"</p>" +
							"<p>&nbsp;&nbsp;&nbsp;Taxes: $"+ cashSales.taxes.toFixed(2) +"</p>" +
							"<p>&nbsp;&nbsp;&nbsp;Orders: x" + cashSales.transactions;

		cardSalesHTML = "<p><b>Credit/Debit:</b></p>" + 
				"<p>&nbsp;&nbsp;&nbsp;Grand Total: $"+ (cardSales.grandTotal).toFixed(2) +"</p>" + 
				// "<p>&nbsp;&nbsp;&nbsp;Net Sales: $"+ cardSales.total.toFixed(2) +"</p>" + 
				"<p>&nbsp;&nbsp;&nbsp;Taxes: $"+ cardSales.taxes.toFixed(2) +"</p>" +
				"<p>&nbsp;&nbsp;&nbsp;Orders: x" + cardSales.transactions;
	} else {
		// cashSalesHTML = "<p><b>Cash:</b></p>" + 
		// 					"<p>&nbsp;&nbsp;&nbsp;Grand Total: $"+ (cashSales.grandTotal).toFixed(2) +"</p>" + 
		// 					// "<p>&nbsp;&nbsp;&nbsp;Net Sales: $"+ cashSales.total.toFixed(2) +"</p>" + 
		// 					"<p>&nbsp;&nbsp;&nbsp;GST: $"+ cashSales.gstTax.toFixed(2) +"</p>" +
		// 					"<p>&nbsp;&nbsp;&nbsp;HST: $"+ cashSales.hstTax.toFixed(2) +"</p>" +
		// 					"<p>&nbsp;&nbsp;&nbsp;Orders: x" + cashSales.transactions;

		cashSalesHTML = "<p><b>Cash:</b></p>" + "<p>&nbsp;&nbsp;&nbsp;Grand Total: $"+ (cashSales.grandTotal).toFixed(2) +"</p>";

		_.each(Maestro.Tax.GetTaxComponentKeysForLocation(), function(taxComponent){
			if(taxComponent.key == "gst"){
				cashSalesHTML += "<p>&nbsp;&nbsp;&nbsp;GST: $"+ cashSales.gstTax.toFixed(2) +"</p>"; 
			} else if(taxComponent.key == "hst"){
				cashSalesHTML += "<p>&nbsp;&nbsp;&nbsp;HST: $"+ cashSales.hstTax.toFixed(2) +"</p>";
			} else if(taxComponent.key == "pst"){
				cashSalesHTML += "<p>&nbsp;&nbsp;&nbsp;PST: $"+ cashSales.pstTax.toFixed(2) +"</p>";
			}
		});

		cashSalesHTML += "<p>&nbsp;&nbsp;&nbsp;Orders: x" + cashSales.transactions;

		// cardSalesHTML = "<p><b>Credit/Debit:</b></p>" + 
		// 		"<p>&nbsp;&nbsp;&nbsp;Grand Total: $"+ (cardSales.grandTotal).toFixed(2) +"</p>" + 
		// 		// "<p>&nbsp;&nbsp;&nbsp;Net Sales: $"+ cardSales.total.toFixed(2) +"</p>" +
		// 		"<p>&nbsp;&nbsp;&nbsp;GST: $"+ cardSales.gstTax.toFixed(2) +"</p>" +
		// 		"<p>&nbsp;&nbsp;&nbsp;HST: $"+ cardSales.hstTax.toFixed(2) +"</p>" +
		// 		"<p>&nbsp;&nbsp;&nbsp;Orders: x" + cardSales.transactions;

		cardSalesHTML = "<p><b>Credit/Debit:</b></p>" + "<p>&nbsp;&nbsp;&nbsp;Grand Total: $"+ (cardSales.grandTotal).toFixed(2) +"</p>";

		_.each(Maestro.Tax.GetTaxComponentKeysForLocation(), function(taxComponent){
			if(taxComponent.key == "gst"){
				cardSalesHTML += "<p>&nbsp;&nbsp;&nbsp;GST: $"+ cardSales.gstTax.toFixed(2) +"</p>"; 
			} else if(taxComponent.key == "hst"){
				cardSalesHTML += "<p>&nbsp;&nbsp;&nbsp;HST: $"+ cardSales.hstTax.toFixed(2) +"</p>";
			} else if(taxComponent.key == "pst"){
				cardSalesHTML += "<p>&nbsp;&nbsp;&nbsp;PST: $"+ cardSales.pstTax.toFixed(2) +"</p>";
			}
		});

		cardSalesHTML += "<p>&nbsp;&nbsp;&nbsp;Orders: x" + cardSales.transactions;
	}

	let giftCardRedemptionsHTML = "<p><b>Monetary Gift Card:</b></p>" + 
				"<p>&nbsp;&nbsp;&nbsp;Redemption Value: $"+ (giftCardRedemptions.total).toFixed(2) +"</p>" + 
				"<p>&nbsp;&nbsp;&nbsp;Redemption Count: x"+ giftCardRedemptions.count +"</p>";

	let tipGivenHTML = "";

	if(Maestro.Business.getConfigurations().trackTips){
		tipGivenHTML = "<p><b>Tips Given:</b></p>" + 
					"<p>&nbsp;&nbsp;&nbsp;by Cash: $"+ (tipsGiven.cash).toFixed(2) +"</p>" + 
					"<p>&nbsp;&nbsp;&nbsp;by Card: $"+ (tipsGiven.card).toFixed(2) +"</p>";
	}

	let categoryTable = Maestro.Atlas.Tally.StartToEndDate.CategoryTable(dailyDate, nextDay);

	let categoryTableHTML = "<p><b>Categories:</b></p>";

	for (i = 0; i < categoryTable.length; i++){
		categoryTableHTML += "<p>&nbsp;&nbsp;&nbsp;" + categoryTable[i].categoryName + " $" + categoryTable[i].categoryTotal.toFixed(2); 
	}

	// let productsTable = Maestro.Atlas.Tally.StartToEndDate.ProductsTable(dailyDate, nextDay);

	// let productsTableHTML = "<p><b>Products:</b></p>";

	// for (i = 0; i < productsTable.length; i++){
	// 	productsTableHTML += "<p>&nbsp;&nbsp;&nbsp;" + productsTable[i].product + "  x" + productsTable[i].productQuantity + "   $" + productsTable[i].productTotal.toFixed(2); 
	// }

	receiptBody = reportHeaderHTML + locationHeaderHTML + "<hr>" + grandTotal + "<hr>" + cashSalesHTML + cardSalesHTML + giftCardRedemptionsHTML + tipGivenHTML + categoryTableHTML; // + productsTableHTML;

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

	Meteor.call('sendEmail', toEmail, fromEmail, subjectLine, messageBody, htmlBody, function(error, result){
		if(error){
			Materialize.toast('Report Email Failed To Send', 2000, 'rounded red');
		} else {
			Materialize.toast('Report Emailed', 2000, 'rounded green');
		}
	});
};


Maestro.Reports.Daily.PrintToUSB = function(reportDate, receiptPrinter){
	let location = Maestro.Business.getLocation();
    let locationPrinters = location.printers;

    // if(locationPrinters && locationPrinters.length > 0) {
    	// let receiptPrinter = receiptPrinter = locationPrinters[0];
       	
    let printerInfo = {
        "printer-name": receiptPrinter.name,
        "printer-type": receiptPrinter.connection,
        "printer-address": receiptPrinter.address
    };

	let dailyDate = new Date(reportDate);
	let nextDay = new Date(dailyDate);
	nextDay.setDate(nextDay.getDate()+1);

	let businessId = Maestro.Business.getBusinessId();
    let business = Maestro.Business.getBusiness();

    let printObject = {};
    printObject.title = getSelectedDailyDate(dailyDate);

    let printLines = [];

    let locationHeader = {
    	isBold: true,
    	left: business.name,
    	right: "@" + location.name
    };

    printLines.push(locationHeader);

    let totalTaxes = Maestro.Atlas.Tally.TaxComponentTotal('total', dailyDate);
	let totalGSTTaxes = Maestro.Atlas.Tally.TaxComponentTotal('gst', dailyDate);
	let totalHSTTaxes = Maestro.Atlas.Tally.TaxComponentTotal('hst', dailyDate);
	let totalPSTTaxes = Maestro.Atlas.Tally.TaxComponentTotal('pst', dailyDate);

    let grandTotal;

    if (totalHSTTaxes == 0 && totalGSTTaxes ==0 && totalPSTTaxes == 0){
	    grandTotal = [
	    	{
	    		left: "____________",
	    		right: "____________"
	    	},
	    	{
	    		isBold: true,
	    		left: "Grand Total",
	    		right: "Orders"
	    	},
	    	{
	    		isBold: true,
	    		left: "$"+Maestro.Atlas.Tally.TotalOrderSales(dailyDate).toFixed(2),
	    		right: "x"+Maestro.Atlas.Tally.TotalOrderCount(dailyDate)
	    	},
	    	{
	    		isBold: false,
	    		left: "Taxes: $" + totalTaxes.toFixed(2)
	    	},
	    	{
	    		left: "____________",
	    		right: "____________"
	    	},    		
	    ];
	} else {
		// grandTotal = [
	 //    	{
	 //    		left: "____________",
	 //    		right: "____________"
	 //    	},
	 //    	{
	 //    		isBold: true,
	 //    		left: "Grand Total",
	 //    		right: "Orders"
	 //    	},
	 //    	{
	 //    		isBold: true,
	 //    		left: "$"+Maestro.Atlas.Tally.TotalOrderSales(dailyDate).toFixed(2),
	 //    		right: "x"+Maestro.Atlas.Tally.TotalOrderCount(dailyDate)
	 //    	},
	 //    	{
	 //    		isBold: false,
	 //    		left: "GST: $" + totalGSTTaxes.toFixed(2)
	 //    	},
	 //    	{
	 //    		isBold: false,
	 //    		left: "HST: $" + totalHSTTaxes.toFixed(2)
	 //    	},
	 //    	{
	 //    		left: "____________",
	 //    		right: "____________"
	 //    	},    		
	 //    ];

	    grandTotal = [
	    	{
	    		left: "____________",
	    		right: "____________"
	    	},
	    	{
	    		isBold: true,
	    		left: "Grand Total",
	    		right: "Orders"
	    	},
	    	{
	    		isBold: true,
	    		left: "$"+Maestro.Atlas.Tally.TotalOrderSales(dailyDate).toFixed(2),
	    		right: "x"+Maestro.Atlas.Tally.TotalOrderCount(dailyDate)
	    	},
	    ];

	    _.each(Maestro.Tax.GetTaxComponentKeysForLocation(), function(taxComponent){
	    	$.merge(grandTotal, {
	    		isBold: false,
	    		left: taxComponent.label + ": $" + Maestro.Atlas.Tally.TaxComponentTotal(taxComponent.key, dailyDate).toFixed(2)
	    	});
	    });

	    $.merge(grandTotal, {
    		left: "____________",
    		right: "____________"
    	});
	}

    $.merge(printLines, grandTotal);
    // printLines.concat(grandTotal);

	let cashSales = Maestro.Atlas.Tally.Daily.CashSales(dailyDate);
	let cardSales = Maestro.Atlas.Tally.Daily.CreditDebitSales(dailyDate);

	let cashSalesBlock, cardSalesBlock;
	
    if (totalHSTTaxes == 0 && totalGSTTaxes ==0 && totalPSTTaxes){		
		cashSalesBlock = [
			" ",
			{
				isBold:true,
				left: "Cash:",
				right: "Grand Total: $"+ (cashSales.grandTotal).toFixed(2) 
			},
			{
				right: "Taxes: $"+ cashSales.taxes.toFixed(2) 
			},
			{
				right: "Orders: x" + cashSales.transactions
			},
		];		

		cardSalesBlock = [
			{
				isBold:true,
				left: "Credit/Debit:",
				right: "Grand Total: $"+ (cardSales.grandTotal).toFixed(2) 
			},
			{
				right: "Taxes: $"+ cardSales.taxes.toFixed(2) 
			},
			{
				right: "Orders: x" + cardSales.transactions
			},
		];
	} else {
		// cashSalesBlock = [
		// 	" ",
		// 	{
		// 		isBold:true,
		// 		left: "Cash:",
		// 		right: "Grand Total: $"+ (cashSales.grandTotal).toFixed(2) 
		// 	},
		// 	{
		// 		right: "GST: $"+ cashSales.gstTax.toFixed(2) 
		// 	},
		// 	{
		// 		right: "HST: $"+ cashSales.hstTax.toFixed(2) 
		// 	},
		// 	{
		// 		right: "Orders: x" + cashSales.transactions
		// 	},
		// ];		

		cashSalesBlock = [
			" ",
			{
				isBold:true,
				left: "Cash:",
				right: "Grand Total: $"+ (cashSales.grandTotal).toFixed(2) 
			},
		];

		_.each(Maestro.Tax.GetTaxComponentKeysForLocation(), function(taxComponent){
			if(taxComponent.key == "gst"){
				$.merge(cashSalesBlock, {
					right: taxComponent.label + ": $"+ cashSales.gstTax.toFixed(2) 
				});
			} else if (taxComponent.key == "hst") {
				$.merge(cashSalesBlock, {
					right: taxComponent.label + ": $"+ cashSales.hstTax.toFixed(2) 
				});
			} else if (taxComponent.key == "pst") {
				$.merge(cashSalesBlock, {
					right: taxComponent.label + ": $"+ cashSales.pstTax.toFixed(2) 
				});
			}
		});

		$.merge( cashSalesBlock, {
			right: "Orders: x" + cashSales.transactions
		});

		// cardSalesBlock = [
		// 	{
		// 		isBold:true,
		// 		left: "Credit/Debit:",
		// 		right: "Grand Total: $"+ (cardSales.grandTotal).toFixed(2) 
		// 	},
		// 	{
		// 		right: "GST: $"+ cardSales.gstTax.toFixed(2) 
		// 	},
		// 	{
		// 		right: "HST: $"+ cardSales.hstTax.toFixed(2) 
		// 	},
		// 	{
		// 		right: "Orders: x" + cardSales.transactions
		// 	},
		// ];

		cardSalesBlock = [
			" ",
			{
				isBold:true,
				left: "Credit/Debit:",
				right: "Grand Total: $"+ (cardSales.grandTotal).toFixed(2) 
			},
		];

		_.each(Maestro.Tax.GetTaxComponentKeysForLocation(), function(taxComponent){
			if(taxComponent.key == "gst"){
				$.merge(cardSalesBlock, {
					right: taxComponent.label + ": $"+ cardSales.gstTax.toFixed(2) 
				});
			} else if (taxComponent.key == "hst") {
				$.merge(cardSalesBlock, {
					right: taxComponent.label + ": $"+ cardSales.hstTax.toFixed(2) 
				});
			} else if (taxComponent.key == "pst") {
				$.merge(cardSalesBlock, {
					right: taxComponent.label + ": $"+ cardSales.pstTax.toFixed(2) 
				});
			}
		});

		$.merge( cardSalesBlock, {
			right: "Orders: x" + cardSales.transactions
		});
	}

	$.merge(printLines, cashSalesBlock);
	// printLines.concat(cashSalesBlock);
	$.merge(printLines, cardSalesBlock);
	// printLines.concat(cardSalesBlock);

	let giftCardRedemptions = Maestro.Atlas.Tally.Daily.GiftCardRedemptions(dailyDate);

	let giftCardsBlock = [
		{
			isBold:true,
			left: "Monetary Gift Cards:",
			right: "Redeemed: $"+ (giftCardRedemptions.total).toFixed(2) 
		},
		{
			right: "Count: x"+ giftCardRedemptions.count 
		}
	];

	$.merge(printLines, giftCardsBlock);

	if(Maestro.Business.getConfigurations().trackTips){
		let tipsGiven = Maestro.Atlas.Tally.Daily.TipsGiven(dailyDate);

		let tipsGivenBlock = [
			{
				isBold:true,
				left: "Cash Tips: $" + (tipsGiven.cash).toFixed(2)
			},
			{
				isBold:true,
				left: "Card Tips: $" + (tipsGiven.card).toFixed(2)
			}
		];

		$.merge(printLines, tipsGivenBlock);
	}

	let categoryTable = Maestro.Atlas.Tally.StartToEndDate.CategoryTable(dailyDate, nextDay);

	let categoryTableBlock = [
		{
			left: "----------"
		},
		{
			isBold:true,
			left: "Categories:"
		}
	];

	for (i = 0; i < categoryTable.length; i++){
		categoryTableBlock.push({
			left: categoryTable[i].categoryName + "   $" + categoryTable[i].categoryTotal.toFixed(2)
		});
	}

	$.merge(printLines, categoryTableBlock);
	// printLines.concat(categoryTableBlock);

	// let productsTable = Maestro.Atlas.Tally.StartToEndDate.ProductsTable(dailyDate, nextDay);

	// let productsTableBlock = [
	// 	{
	// 		left: "----------"
	// 	},
	// 	{
	// 		isBold:true,
	// 		left: "Products:"
	// 	}
	// ];

	// for (i = 0; i < productsTable.length; i++){
	// 	productsTableBlock.push({
	// 		left: productsTable[i].product + "  x" + productsTable[i].productQuantity + "   $" + productsTable[i].productTotal.toFixed(2)
	// 	});
	// }

	// $.merge(printLines, productsTableBlock);
	// // printLines.concat(productsTableBlock);

	printObject.printLines = printLines;

	// console.log(printObject);

	if(Meteor.isCordova) {
        //alert("Printing order receipt");
        EscPos.printLines(
            printObject,
            printerInfo,
            function() {
                Materialize.toast("Receipt printed successfully!", 2000, "rounded green");
            },
            function() {
                Materialize.toast("Receipt could not be printed!", 4000, "rounded red");
            }
        );
    }
};

Maestro.Reports.Daily.PrintToWireless = function(reportDate, receiptPrinter){
	let location = Maestro.Business.getLocation();
       	
    let printerInfo = {
        "printer-name": receiptPrinter.name,
        "printer-type": receiptPrinter.connection,
        "printer-address": receiptPrinter.address
    };

	let dailyDate = new Date(reportDate);
	let nextDay = new Date(dailyDate);
	nextDay.setDate(nextDay.getDate()+1);

	let businessId = Maestro.Business.getBusinessId();
    let business = Maestro.Business.getBusiness();

    // let printObject = {};

    let receiptDetails = new Maestro.Print.Job(Maestro.Print.LINE_LENGTH_WIDE);

    receiptDetails.textStyled(getSelectedDailyDate(dailyDate), 'B', 'center', 'a', 2, 2, false, true, false)
            .lineBreak();
	

	receiptDetails.textPadded(business.name, "@" + location.name, 'left', " ", 1, 1, "B")
		.lineBreak();

    // printObject.title = getSelectedDailyDate(dailyDate);

    // let printLines = [];

    // let locationHeader = {
    // 	isBold: true,
    // 	left: business.name,
    // 	right: "@" + location.name
    // };

    // printLines.push(locationHeader);

    let totalTaxes = Maestro.Atlas.Tally.TaxComponentTotal('total', dailyDate);
	let totalGSTTaxes = Maestro.Atlas.Tally.TaxComponentTotal('gst', dailyDate);
	let totalHSTTaxes = Maestro.Atlas.Tally.TaxComponentTotal('hst', dailyDate);
	let totalPSTTaxes = Maestro.Atlas.Tally.TaxComponentTotal('pst', dailyDate);

    let grandTotal;

    if (totalHSTTaxes == 0 && totalGSTTaxes ==0 && totalPSTTaxes == 0){
	    receiptDetails.textPadded("____________", "____________")
			.lineBreak()
			.textPadded("Grand Total", "Orders", 'left', " ", 1, 1, "B")
			.lineBreak()
			.textPadded("$"+Maestro.Atlas.Tally.TotalOrderSales(dailyDate).toFixed(2), "x"+Maestro.Atlas.Tally.TotalOrderCount(dailyDate), 'left', " ", 1, 1, "B")
			.lineBreak()
			.textPadded("Taxes: $" + totalTaxes.toFixed(2), " ")
			.lineBreak()
			.textPadded("____________", "____________")
			.lineBreak();
	} else {
		// receiptDetails.textPadded("____________", "____________")
		// 	.lineBreak()
		// 	.textPadded("Grand Total", "Orders", 'left', " ", 1, 1, "B")
		// 	.lineBreak()
		// 	.textPadded("$"+Maestro.Atlas.Tally.TotalOrderSales(dailyDate).toFixed(2), "x"+Maestro.Atlas.Tally.TotalOrderCount(dailyDate), 'left', " ", 1, 1, "B")
		// 	.lineBreak()
		// 	.textPadded("GST: $" + totalGSTTaxes.toFixed(2), "")
		// 	.lineBreak()
		// 	.textPadded("HST: $" + totalHSTTaxes.toFixed(2), "")
		// 	.lineBreak()
		// 	.textPadded("____________", "____________")
		// 	.lineBreak();

		receiptDetails.textPadded("____________", "____________")
			.lineBreak()
			.textPadded("Grand Total", "Orders", 'left', " ", 1, 1, "B")
			.lineBreak()
			.textPadded("$"+Maestro.Atlas.Tally.TotalOrderSales(dailyDate).toFixed(2), "x"+Maestro.Atlas.Tally.TotalOrderCount(dailyDate), 'left', " ", 1, 1, "B")
			.lineBreak();

		_.each(Maestro.Tax.GetTaxComponentKeysForLocation(), function(taxComponent){
			receiptDetails.textPadded(taxComponent.label + ": $" + Maestro.Atlas.Tally.TaxComponentTotal(taxComponent.key, dailyDate).toFixed(2), "").lineBreak();
		});

		receiptDetails.textPadded("____________", "____________").lineBreak();
	}

    // $.merge(printLines, grandTotal);
    // printLines.concat(grandTotal);

	let cashSales = Maestro.Atlas.Tally.Daily.CashSales(dailyDate);
	let cardSales = Maestro.Atlas.Tally.Daily.CreditDebitSales(dailyDate);

	let cashSalesBlock, cardSalesBlock;
	
    if (totalHSTTaxes == 0 && totalGSTTaxes ==0 && totalPSTTaxes == 0){
    	receiptDetails.textPadded("Cash:", "Grand Total: $"+ (cashSales.grandTotal).toFixed(2), 'left', " ", 1, 1, "B")
			.lineBreak()
			.textPadded("", "Taxes: $"+ cashSales.taxes.toFixed(2))
			.lineBreak()
			.textPadded("", "Orders: x" + cashSales.transactions)
			.lineBreak();	

		receiptDetails.textPadded("Credit/Debit:", "Grand Total: $"+ (cardSales.grandTotal).toFixed(2), 'left', " ", 1, 1, "B")
			.lineBreak()
			.textPadded("", "Taxes: $"+ cardSales.taxes.toFixed(2))
			.lineBreak()
			.textPadded("", "Orders: x" + cardSales.transactions)
			.lineBreak();

	} else {
		// receiptDetails.textPadded("Cash:", "Grand Total: $"+ (cashSales.grandTotal).toFixed(2), 'left', " ", 1, 1, "B")
		// 	.lineBreak()
		// 	.textPadded("", "GST: $"+ cashSales.gstTax.toFixed(2))
		// 	.lineBreak()
		// 	.textPadded("", "HST: $"+ cashSales.hstTax.toFixed(2))
		// 	.lineBreak()
		// 	.textPadded("", "Orders: x" + cashSales.transactions)
		// 	.lineBreak();	

		receiptDetails.textPadded("Cash:", "Grand Total: $"+ (cashSales.grandTotal).toFixed(2), 'left', " ", 1, 1, "B").lineBreak();

		_.each(Maestro.Tax.GetTaxComponentKeysForLocation(), function(taxComponent){
			if(taxComponent.key == "gst"){
				receiptDetails.textPadded("", taxComponent.label + ": $"+ cashSales.gstTax.toFixed(2)).lineBreak();
			} else if (taxComponent.key == "hst"){
				receiptDetails.textPadded("", taxComponent.label + ": $"+ cashSales.hstTax.toFixed(2)).lineBreak();
			} else if (taxComponent.key == "pst"){
				receiptDetails.textPadded("", taxComponent.label + ": $"+ cashSales.pstTax.toFixed(2)).lineBreak();
			}
		});

		receiptDetails.textPadded("", "Orders: x" + cashSales.transactions).lineBreak();

		// receiptDetails.textPadded("Credit/Debit:", "Grand Total: $"+ (cardSales.grandTotal).toFixed(2), 'left', " ", 1, 1, "B")
		// 	.lineBreak()
		// 	.textPadded("", "GST: $"+ cardSales.gstTax.toFixed(2))
		// 	.lineBreak()
		// 	.textPadded("", "HST: $"+ cardSales.hstTax.toFixed(2))
		// 	.lineBreak()
		// 	.textPadded("", "Orders: x" + cardSales.transactions)
		// 	.lineBreak();	

		receiptDetails.textPadded("Credit/Debit:", "Grand Total: $"+ (cardSales.grandTotal).toFixed(2), 'left', " ", 1, 1, "B").lineBreak();

		_.each(Maestro.Tax.GetTaxComponentKeysForLocation(), function(taxComponent){
			if(taxComponent.key == "gst"){
				receiptDetails.textPadded("", taxComponent.label + ": $"+ cardSales.gstTax.toFixed(2)).lineBreak();
			} else if (taxComponent.key == "hst"){
				receiptDetails.textPadded("", taxComponent.label + ": $"+ cardSales.hstTax.toFixed(2)).lineBreak();
			} else if (taxComponent.key == "pst"){
				receiptDetails.textPadded("", taxComponent.label + ": $"+ cardSales.pstTax.toFixed(2)).lineBreak();
			}
		});

		receiptDetails.textPadded("", "Orders: x" + cardSales.transactions).lineBreak();
	}


	let giftCardRedemptions = Maestro.Atlas.Tally.Daily.GiftCardRedemptions(dailyDate);

	receiptDetails.textPadded("Monetary Gift Cards:", "Redeemed: $"+ (giftCardRedemptions.total).toFixed(2), 'left', " ", 1, 1, "B")
			.lineBreak()
			.textPadded("", "Count: x"+ giftCardRedemptions.count)
			.lineBreak();

	if(Maestro.Business.getConfigurations().trackTips){
		let tipsGiven = Maestro.Atlas.Tally.Daily.TipsGiven(dailyDate);

		receiptDetails.textPadded("Cash Tips: $" + (tipsGiven.cash).toFixed(2), "", 'left', " ", 1, 1, "B")
				.lineBreak()
				.textPadded("Card Tips: $" + (tipsGiven.card).toFixed(2), "", 'left', " ", 1, 1, "B")
				.lineBreak();
	}

	let categoryTable = Maestro.Atlas.Tally.StartToEndDate.CategoryTable(dailyDate, nextDay);

	receiptDetails.textNormal("----------")
			.lineBreak()
			.textBold("Categories:")
			.lineBreak();

	for (i = 0; i < categoryTable.length; i++){
		receiptDetails.textNormal(categoryTable[i].categoryName + "   $" + categoryTable[i].categoryTotal.toFixed(2))
			.lineBreak();
		// categoryTableBlock.push({
		// 	left: categoryTable[i].categoryName + "   $" + categoryTable[i].categoryTotal.toFixed(2)
		// });
	}

	receiptDetails.cut();

    let receiptPrintObject = {
        "one": "{data first}"
    };

    receiptPrintObject.printjob = receiptDetails.commands();

    // console.log('comands :: ', receiptDetails.commands());
    // console.log('printing to address ::', receiptPrinter.address);

    // let printCommands = {
    //     print: receiptDetails,
    //     drawer: kickoutCashDrawer
    // };

    HTTP.call(
        'POST',
        'http://' + receiptPrinter.address,
        {
            data: receiptPrintObject
        },
        function(printError, printResult) {
            // console.log('Print Error :: ', printError);
            // console.log('Print Result :: ', printResult);
        }
    );

};

Maestro.Reports.Daily.Print = function(reportDate){
    let locationPrinters = Maestro.Locations.getEnabledPrinters();

    if(locationPrinters && locationPrinters.length > 0) {
    	let firstMainPrinter = _.find(locationPrinters, function(printer){return printer.use == "MAIN";});
        if (!firstMainPrinter){
            Maestro.Reports.Daily.PrintToUSB(reportDate, locationPrinters[0]);
            // console.log('print to USB');
        } else {
            if (firstMainPrinter.connection == "USB"){
                Maestro.Reports.Daily.PrintToUSB(reportDate, firstMainPrinter);
                // console.log('print to USB');
            } else if (firstMainPrinter.connection == "WIRELESS"){
                Maestro.Reports.Daily.PrintToWireless(reportDate, firstMainPrinter);
                // console.log('print to WIRELESS');
            }
        }
    } else {
        Materialize.toast("No printer defined for the selected location!", 4000, "rounded red");
    }
};






        