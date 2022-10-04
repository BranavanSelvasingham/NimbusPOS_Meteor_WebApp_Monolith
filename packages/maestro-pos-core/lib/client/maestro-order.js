Maestro.Order={};


let showPriorOrderSummaryCheck = function(template){
    if(UserSession.get(Maestro.UserSessionConstants.POS_ALWAYS_PRIOR_ORDER_SUMMARY)){
        // $('#prior-order-review-button').sideNav('show');
        template.openRecentOrderSummaryPopup();
        template.openRecentOrderSummaryUnderlay();
    }
};

let convertOrderLoyaltyItemsToBuyItems = function(template){
    // let buyLoyaltyItems = template.orderLoyaltyItems.get();
    let buyLoyaltyDetails = [];

    // for (i = 0; i < buyLoyaltyItems.length; i++){
    _.each(template.orderLoyaltyItems.get(), function(loyaltyItem){
        let orderLoyaltyItem = Maestro.POS.Loyalty.getOrderLoyaltyItem(template, loyaltyItem) || {quantity:1};
        buyLoyaltyDetails.push({
            programId: loyaltyItem._id,
            remainingQuantity: loyaltyItem.programType.quantity * orderLoyaltyItem.quantity,
            remainingAmount: loyaltyItem.programType.creditAmount * orderLoyaltyItem.quantity,
            creditPercent: loyaltyItem.programType.creditPercentage,
            expired: false,
            boughtOn: new Date(),
            prePurchase: loyaltyItem.prePurchase || false 
        });
    });
    // console.log('buy loyalty details: ', buyLoyaltyDetails);
    return buyLoyaltyDetails;
};

let prepareLoyaltyItemsForPurchase = function(template, order, updateExistingPrograms, buyLoyaltyDetails ){

    let customerId = template.orderCustomer.get() && template.orderCustomer.get()["_id"] || null;

    updateExistingPrograms.quantityBased = template.existingQuantityLoyalty.get() || null;

    let giftCards = template.existingAmountLoyalty.get();
    let giftCardRedeemInfo = [];

    if(giftCards){
        for (i=0; i<giftCards.length; i++){
            giftCardRedeemInfo.push({
                programId: giftCards[i].programId,
                redeemedAmount: giftCards[i].remainingAmount - template.giftCardsBalances[i]
            });

            giftCards[i].remainingAmount = template.giftCardsBalances[i];
        }
        updateExistingPrograms.amountBased = giftCards;

        order.payment.giftCards = giftCardRedeemInfo;
        order.payment.giftCardTotal = _.reduce(giftCardRedeemInfo, function(memo, card){
            return memo + card.redeemedAmount;
        }, 0.00);
    }

    if(updateExistingPrograms.quantityBased){
        for (k = 0; k < updateExistingPrograms.quantityBased.length; k++){
            if(updateExistingPrograms.quantityBased[k].prePurchase == true){
                let buyLoyaltyIndex = _.indexOf(buyLoyaltyDetails, _.find(buyLoyaltyDetails, function(program){return program.programId == updateExistingPrograms.quantityBased[k].programId; }));
                buyLoyaltyDetails[buyLoyaltyIndex].remainingQuantity = updateExistingPrograms.quantityBased[k].remainingQuantity;
                updateExistingPrograms.quantityBased.splice(k,1);
            }
        }
    }

    if(updateExistingPrograms.amountBased){
        for (k = 0; k < updateExistingPrograms.amountBased.length; k++){
            if(updateExistingPrograms.amountBased[k].prePurchase == true){
                let buyLoyaltyIndex = _.indexOf(buyLoyaltyDetails, _.find(buyLoyaltyDetails, function(program){return program.programId == updateExistingPrograms.amountBased[k].programId; }));
                buyLoyaltyDetails[buyLoyaltyIndex].remainingAmount = updateExistingPrograms.amountBased[k].remainingAmount;
                updateExistingPrograms.amountBased.splice(k,1);
            }
        }
    }

    if(customerId){
        let allCustomerProgramsPreOrder = Maestro.LoyaltyCards.getCustomerActiveCards(customerId);
        let allQuantityPrograms = _.filter(allCustomerProgramsPreOrder, function(program){ return (program.remainingQuantity > 0) && (program.expired == false); }) 
        let quantityCardRedeemInfo = [];
    
        if(updateExistingPrograms.quantityBased){
            for (k = 0; k < updateExistingPrograms.quantityBased.length; k++){
                let afterOrderProgram = updateExistingPrograms.quantityBased[k];
                let originalProgram = _.find(allQuantityPrograms, function(program){return program.programId == afterOrderProgram.programId;});
                if(!originalProgram){
                    originalProgram = {
                        programId: afterOrderProgram.programId,
                        remainingQuantity: LoyaltyPrograms.findOne({_id: afterOrderProgram.programId}).programType.quantity
                    };
                }

                quantityCardRedeemInfo.push({
                    programId: afterOrderProgram.programId,
                    redeemedQuantity: originalProgram.remainingQuantity - afterOrderProgram.remainingQuantity
                });
            }
            order.payment.quantityCards = quantityCardRedeemInfo;
        }
    }

    if(customerId){
        let customerTally = template.existingTallyPrograms.get();
        let updateCustomerTally = _.map(customerTally, function(tallyObj){
            return {
                programId: tallyObj.programId,
                tally: tallyObj.customerTally
            };
        });
        updateExistingPrograms.updateTallyPrograms = updateCustomerTally;
    }

};

Maestro.Order.GetLatestCompletedOrder = function(){
    let locationId = Maestro.Business.getLocationId();

    let findCriteria = {
        locationId: locationId,
        status: "Completed"
    };

    let sortCriteria = {
        sort:{createdAt:-1}
    };

    return Orders.findOne(findCriteria, sortCriteria);
};

Maestro.Order.InsertNew = function(order){
    check(order, Maestro.Schemas.Order);
    return Orders.insert(order);
};

Maestro.Order.Delete = function(orderId){
    if(!!orderId){
        return Orders.remove({_id: orderId});
    }
};

Maestro.Order.Update = function(orderId, updateAttr){
    if(!!orderId){
        return Orders.update({_id: orderId}, {$set: updateAttr});
    }
}

Maestro.Order.GetNextOrderNumber = function(locationId){
	let refStart = 1;

	var todayDate = new Date();
	todayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 0,0,0,0);

	let findCriteria = {
		locationId: locationId,
		createdAt: {$gt: todayDate}
	};

	let sortCriteria = {
		sort:{createdAt:-1}
	};

	let mostRecentOrder = Orders.findOne(findCriteria, sortCriteria);

	if(mostRecentOrder){
		if (mostRecentOrder.dailyOrderNumber > 0){
			return mostRecentOrder.dailyOrderNumber + 1;
		} else {
			return refStart;
		}
	} else {
		return refStart;
	}
};

Maestro.Order.GetNextUniqueOrderNumber = function(){
	let refStart = 1000;

	let sortCriteria = {
		sort:{createdAt:-1}
	};

	let mostRecentOrder = Orders.findOne({}, sortCriteria);

	if(mostRecentOrder){
		if (mostRecentOrder.uniqueOrderNumber > 0){
			return mostRecentOrder.uniqueOrderNumber + 1;
		} else {
			return refStart;
		}
	} else {
		return refStart;
	}	
};

Maestro.Order.GetDailyIncompleteOrders = function(referenceDate){
    let todayDate;

    if(!!referenceDate){
        todayDate = new Date(referenceDate);
    } else {
        todayDate = new Date();
    }

    todayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 0,0,0,0);

    let findCriteria = {
        locationId: Maestro.Business.getLocationId(),
        createdAt: {$gt: todayDate},
        status: "Created"
    };

    let dailyIncompleteOrders = Orders.find(findCriteria).fetch();

    return dailyIncompleteOrders;
};

getOrderType = function(type){ 
    if(type == "EXPRESS"){
        return "Express";
    } else if (type == "DINEIN"){
        return "Dine-In";
    } else if (type == "TAKEOUT"){
        return "Take-Out";
    } else if (type == "DELIVERY"){
        return "Delivery";
    }

    return null;
};

formattedDateAndTime = function(orderDate){
    let dateOfOrder = new Date(orderDate);
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return dateOfOrder.getDate() + "-" + months[dateOfOrder.getMonth()] + "-" + dateOfOrder.getFullYear() + " | " + orderDate.toLocaleTimeString();
};

formattedTime = function(orderDate){
    let time = new Date();
    if(!!orderDate){
        time = new Date(orderDate);
    } 
    // let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return time.toLocaleTimeString();
};

formatCurrency = function(currency){
	return "$" + currency.toFixed(2);
};

Maestro.Order.SendToKitchen = function(order, kickoutCashDrawer = false){
    _.each(order.items, function(item, index){
        if(!item.sentToKitchen){
            // Maestro.Order.SendItemToKitchen(item, order, index);
            order.items[index].sentToKitchen = true;
        }
    });

    Orders.update({_id: order._id}, {$set: {items: order.items}});
    
    //Print receipt in kitchen printer
    Maestro.Order.PrintKitchenOrder(order);
};

Maestro.Order.SendItemToKitchen = function(item, order, kickoutCashDrawer = false, itemIndex = null){
    let locationPrinters = Maestro.Locations.getEnabledPrinters();
    
    // console.log(locationPrinters);
    
    if(locationPrinters.length>0) {
        let findIndex;

        if(itemIndex){
            order.items[itemIndex].sentToKitchen = true;
        } else {
            _.each(order.items, function(orderItem, index){
                if(_.isEqual(orderItem, item)){
                    findIndex = index;
                }
            });
            order.items[findIndex].sentToKitchen = true;
        }
        Orders.update({_id: order._id}, {$set: {items: order.items}});

        let firstKitchenPrinter = _.find(locationPrinters, function(printer){return printer.use == "KITCHEN";});
        if (!firstKitchenPrinter){
            // Maestro.Order.PrintOrderReceiptToUSB(order, kickoutCashDrawer, locationPrinters[0]);
            // console.log('print to USB');
        } else {
            if (firstKitchenPrinter.connection == "USB"){
                // Maestro.Order.PrintOrderReceiptToUSB(order, kickoutCashDrawer, firstKitchenPrinter);
                // console.log('print to USB');
            } else if (firstKitchenPrinter.connection == "WIRELESS"){
                Maestro.Order.PrintKitchenItemToWireless(item, order, firstKitchenPrinter);
                // console.log('print to WIRELESS');
            }
        }
        
    } else {
        Materialize.toast("No printer defined for the selected location!", 4000, "rounded red");
    }
};

//prints individual item to kitchen
Maestro.Order.PrintKitchenItemToWireless = function(item, order, receiptPrinter){
    // console.log('item: ', item);
    let printer = {
        name: receiptPrinter.name,
        connection: receiptPrinter.connection,
        address: receiptPrinter.address
    };

    let receiptDetails = new Maestro.Print.Job(Maestro.Print.LINE_LENGTH_WIDE);

    // console.log('receiptDetails: ', receiptDetails);
    receiptDetails.textStyled("Item Print for #"+order.dailyOrderNumber, 'normal', 'right', 'a', 2, 2, false, true, false)
        .lineBreak()
        .textStyled("Received: " + formattedTime(), 'normal', 'left', 'a', 1, 1, false, true, false)
        .lineBreak()
        .textStyled("Order #: " + order.uniqueOrderNumber, 'normal', 'left', 'a', 1, 1, false, true, false)
        .lineBreak()
        .textStyled("Table #: " + Maestro.Tables.GetSpecificTableLabel(order.tableId), 'B', 'left', 'a', 1, 1, false, true, false)
        .lineBreak();

    // let itemsGroupedBySeats = _.groupBy(order.items, function(item){return item.seatNumber;});
    // console.log('items grouped by seats: ', itemsGroupedBySeats);

    // _.each(itemsGroupedBySeats, function(seatItems, key){
    receiptDetails.textStyled("_______________________________________________", 'normal', 'center', 'a', 1, 1, false, true, false)
        .lineBreak()
        .textStyled("Seat " + item.seatNumber, 'B', 'left', 'a', 1, 1, false, true, false)
        .lineBreak();

    // _.each(seatItems, function(item){
    let name = item.product.name;
    let sizeName = "";
    if(item.product.sizes.length > 1){
        sizeName = " - " + Maestro.Client.getProductSizeName(item.size.code);
    }

    let addItem = {
        quantity: item.quantity,
        name: String(name + sizeName),
        price: formatCurrency(item.size.price),
        addons: []
    };

    receiptDetails.textStyled("x" + addItem.quantity + " " + addItem.name)
        .lineBreak();

    if (item.addOns.length){
        for (j = 0 ; j < item.addOns.length; j++){

            let addOnName = item.addOns[j].name;
            let addOnPrice = formatCurrency(item.addOns[j].price);

            receiptDetails.textStyled(" +" + addOnName)
                .lineBreak();
        }
    }

    let notes = item.notes || [];
    if (notes.length > 0){
        for (j = 0 ; j < notes.length; j++){
            receiptDetails.textStyled(" *" + notes[j]).lineBreak();
        }
    }
    

    receiptDetails.textStyled("Partial Order Print", 'B', 'center', 'a', 1, 1, false, true, false); 

    receiptDetails.cut();

    let receiptPrintObject = {
        "one": "{data first}"
    };

    receiptPrintObject.printjob = receiptDetails.commands();

    // console.log('comands :: ', receiptDetails.commands());
    // console.log('printing to address ::', printer.address);

    HTTP.call(
        'POST',
        'http://' + printer.address,
        {
            data: receiptPrintObject
        },
        function(printError, printResult) {
            // console.log('Print Error :: ', printError);
            // console.log('Print Result :: ', printResult);
        }
    );
};

Maestro.Order.PrintKitchenOrder = function(order, kickoutCashDrawer = false){
    let locationPrinters = Maestro.Locations.getEnabledPrinters();
    
    if(locationPrinters.length>0) {
        let firstKitchenPrinter = _.find(locationPrinters, function(printer){return printer.use == "KITCHEN";});
        if (!firstKitchenPrinter){
            // Maestro.Order.PrintOrderReceiptToUSB(order, kickoutCashDrawer, locationPrinters[0]);
            // console.log('print to USB');
        } else {
            if (firstKitchenPrinter.connection == "USB"){
                // Maestro.Order.PrintOrderReceiptToUSB(order, kickoutCashDrawer, firstKitchenPrinter);
                // console.log('print to USB');
            } else if (firstKitchenPrinter.connection == "WIRELESS"){
                Maestro.Order.PrintKitchenOrderToWireless(order, kickoutCashDrawer, firstKitchenPrinter);
                // console.log('print to WIRELESS');
            }
        }
        
    } else {
        Materialize.toast("No printer defined for the selected location!", 4000, "rounded red");
    }
};

//prints entire order to kitchen
Maestro.Order.PrintKitchenOrderToWireless = function(order, kickoutCashDrawer = false, receiptPrinter){  
    let printer = {
        name: receiptPrinter.name,
        connection: receiptPrinter.connection,
        address: receiptPrinter.address
    };

    let receiptDetails = new Maestro.Print.Job(Maestro.Print.LINE_LENGTH_WIDE);

    // console.log('receiptDetails: ', receiptDetails);
    receiptDetails.textStyled("#"+order.dailyOrderNumber, 'normal', 'right', 'a', 2, 2, false, true, false)
        .lineBreak()
        .textStyled("Received: " + formattedTime(), 'normal', 'left', 'a', 1, 1, false, true, false)
        .lineBreak()
        .textStyled("Order #: " + order.uniqueOrderNumber, 'normal', 'left', 'a', 1, 1, false, true, false)
        .lineBreak()
        .textStyled("Table #: " + Maestro.Tables.GetSpecificTableLabel(order.tableId), 'B', 'left', 'a', 1, 1, false, true, false)
        .lineBreak();

    // console.log(order);
    if(!!order.orderInformation){
        let info = order.orderInformation;
        if(info.orderType == "TAKEOUT" || info.orderType == "DELIVERY"){
            receiptDetails.textStyled("_______________________________________________", 'normal', 'center', 'a', 1, 1, false, true, false).lineBreak();
            receiptDetails.textStyled(getOrderType(info.orderType) + " Info:", 'B', 'left', 'a', 2, 1, false, true, false).lineBreak();
        }
        if(!!info.orderName){
            receiptDetails.textStyled("Name: " + info.orderName, 'normal', 'left', 'a', 1, 1, false, true, false).lineBreak();
        }
        if(!!info.orderPhone){
            receiptDetails.textStyled("Phone: " + info.orderPhone, 'normal', 'left', 'a', 1, 1, false, true, false).lineBreak();
        }
        if(!!info.unitNumber || !!info.buzzerNumber){
            receiptDetails.textStyled("Unit #" + info.unitNumber + ", (Buzzer #" + info.buzzerNumber + ")", 'normal', 'left', 'a', 1, 1, false, true, false).lineBreak();
        }
        if(!!info.streetNumber || !!info.street || !!info.city || !!info.postalCode){
            receiptDetails.textStyled(info.streetNumber + " " + info.street, 'normal', 'left', 'a', 1, 1, false, true, false).lineBreak();
            receiptDetails.textStyled(info.city + ", " + info.postalCode, 'normal', 'left', 'a', 1, 1, false, true, false).lineBreak();
        }
        if(!!info.instructions){
            receiptDetails.textStyled("Note: " + info.instructions, 'B', 'left', 'a', 1, 1, false, true, false).lineBreak();
        }
    }

    let itemsGroupedBySeats = _.groupBy(order.items, function(item){return item.seatNumber;});
    // console.log('items grouped by seats: ', itemsGroupedBySeats);

    _.each(itemsGroupedBySeats, function(seatItems, key){
        receiptDetails.textStyled("_______________________________________________", 'normal', 'center', 'a', 1, 1, false, true, false)
            .lineBreak()
            .textStyled("Seat " + key, 'B', 'left', 'a', 1, 1, false, true, false)
            .lineBreak();

        _.each(seatItems, function(item){
            let name = item.product.name;
            let sizeName = "";
            if(item.product.sizes.length > 1){
                sizeName = " - " + Maestro.Client.getProductSizeName(item.size.code);
            }

            let addItem = {
                quantity: item.quantity,
                name: String(name + sizeName),
                price: formatCurrency(item.size.price),
                addons: []
            };

            receiptDetails.textStyled("x" + addItem.quantity + " " + addItem.name)
                .lineBreak();

            if (item.addOns.length){
                for (j = 0 ; j < item.addOns.length; j++){

                    let addOnName = item.addOns[j].name;
                    let addOnPrice = formatCurrency(item.addOns[j].price);

                    receiptDetails.textStyled(" +" + addOnName)
                        .lineBreak();
                }
            }

            let notes = item.notes || [];
            if (notes.length > 0){
                for (j = 0 ; j < notes.length; j++){
                    receiptDetails.textStyled(" *" + notes[j]).lineBreak();
                }
            }
        });

    });
       
    receiptDetails.cut();

    let receiptPrintObject = {
        "one": "{data first}"
    };

    receiptPrintObject.printjob = receiptDetails.commands();

    // console.log('comands :: ', receiptDetails.commands());
    // console.log('printing to address ::', printer.address);

    HTTP.call(
        'POST',
        'http://' + printer.address,
        {
            data: receiptPrintObject
        },
        function(printError, printResult) {
            // console.log('Print Error :: ', printError);
            // console.log('Print Result :: ', printResult);
        }
    );

};


Maestro.Order.PrintOrderReceiptToWireless = function(order, kickoutCashDrawer = false, receiptPrinter){  //not for new orders.. look at next function for new orders
    let location = Maestro.Business.getLocation();
    let receiptMessage = location.receiptMessage || "";
    let gstHstNumber = location.gstHstNumber || "";

    // let receiptPrinter = receiptPrinter = locationPrinters[0]; //selectedPrinter should be selecting which printer

    let printer = {
        name: receiptPrinter.name,
        connection: receiptPrinter.connection,
        address: receiptPrinter.address
    };

    let receiptDetails = new Maestro.Print.Job();

    // console.log('receiptDetails: ', receiptDetails);
    receiptDetails.textStyled(Maestro.Business.getBusinessName(), 'normal', 'center', 'a', 2, 2, false, true, false)
        .lineBreak()
        .textStyled(location.address.street, 'normal', 'center', 'a', 1, 1, false, true, false)
        .lineBreak()
        .textStyled(location.address.city, 'normal', 'center', 'a', 1, 1, false, true, false)
        .lineBreak()
        .textStyled(formattedDateAndTime(order.createdAt), 'normal', 'center', 'a', 1, 1, false, true, false)
        .lineBreak();
        // .textStyled("_______________________________________________", 'normal', 'center', 'a', 1, 1, false, true, false)
        // .lineBreak();
        

    if(order.status == "Cancelled"){
        receiptDetails.textStyled("CANCELLED - #"+order.dailyOrderNumber, 'normal', 'right', 'a', 2, 1, true, true, false)
            .lineBreak();
    } else {
        receiptDetails.textStyled("#"+order.dailyOrderNumber, 'normal', 'right', 'a', 2, 1, true, true, false)
            .lineBreak();
    }

    receiptDetails
        .textStyled("_______________________________________________", 'normal', 'center', 'a', 1, 1, false, true, false)
        .lineBreak();


    for (i = 0; i < order.items.length; i ++){
        let name = order.items[i].product.name;
        let sizeName = "";
        if(order.items[i].product.sizes.length > 1){
            sizeName = " - " + Maestro.Client.getProductSizeName(order.items[i].size.code);
        }

        let addItem = {
            quantity: order.items[i].quantity,
            name: String(name + sizeName),
            // price: formatCurrency(order.items[i].size.price),
            price: formatCurrency(order.items[i].total),
            unitPrice: formatCurrency(order.items[i].size.price),
            addons: []
        };

        if (order.items[i].addOns.length > 0){
            if(order.items[i].unitBasedPrice == true){
                addItem.unitPrice = String(order.items[i].unitBasedPriceQuantity) +" " +order.items[i].unitLabel + " x " +  formatCurrency(order.items[i].unitPrice) + "/" + order.items[i].unitLabel;
                
                receiptDetails.textPadded("x" + addItem.quantity + " " + addItem.name, addItem.price, "center")
                .lineBreak()
                .textPadded("    " + addItem.unitPrice + " ea.", "", "center")
                .lineBreak();
            // } else if(addItem.quantity > 1){
            //     receiptDetails.textPadded("x" + addItem.quantity + " " + addItem.name + " (" + addItem.unitPrice + "ea)", addItem.price, "center")
            //     // receiptDetails.textPadded("", addItem.unitPrice + "ea.    ", "center")
            //     .lineBreak();
            } else {
                receiptDetails.textPadded("x" + addItem.quantity + " " + addItem.name, addItem.price, "center")
                .lineBreak();
            }
        
            receiptDetails.textPadded("  " + Maestro.Client.getProductSizeName( order.items[i].size.code ), formatCurrency( order.items[i].size.price ) + "    ", "center")
            .lineBreak();

            for (j = 0 ; j < order.items[i].addOns.length; j++){

                let addOnName = order.items[i].addOns[j].name;
                let addOnPrice = formatCurrency(order.items[i].addOns[j].price);

                receiptDetails.textPadded("  + " + addOnName, addOnPrice + "    ", "center")
                    .lineBreak();
            }
        } else {
            if(order.items[i].unitBasedPrice == true){
                addItem.unitPrice = String(order.items[i].unitBasedPriceQuantity) +" " +order.items[i].unitLabel + " x " +  formatCurrency(order.items[i].unitPrice) + "/" + order.items[i].unitLabel;
                
                receiptDetails.textPadded("x" + addItem.quantity + " " + addItem.name, addItem.price, "center")
                .lineBreak()
                .textPadded("    " + addItem.unitPrice + " ea.", "", "center")
                .lineBreak();
            } else if(addItem.quantity > 1){
                receiptDetails.textPadded("x" + addItem.quantity + " " + addItem.name + " (" + addItem.unitPrice + "ea)", addItem.price, "center")
                // receiptDetails.textPadded("", addItem.unitPrice + "ea.    ", "center")
                .lineBreak();
            } else {
                receiptDetails.textPadded("x" + addItem.quantity + " " + addItem.name, addItem.price, "center")
                .lineBreak();
            }

        }

        let notes = order.items[i].notes || [];
        if (notes.length > 0){
            for (j = 0 ; j < notes.length; j++){
                receiptDetails.textStyled("    *" + notes[j]).lineBreak();
            }
        }

        if (order.items[i].addOns.length > 0){receiptDetails.lineBreak();}
    }

    receiptDetails.textStyled("_______________________________________________", 'normal', 'center', 'a', 1, 1, false, true, false)
        .lineBreak()
        .textPadded("Subtotal: ", formatCurrency(order.subtotals.subtotal), "center")
        .lineBreak();

    // console.log(order);

    if(order.subtotals.discount != 0){
        receiptDetails.textPadded("Discounts: ", formatCurrency(-1*order.subtotals.discount), "center")
            .lineBreak();
    }

    if(order.subtotals.adjustments != 0){
        receiptDetails.textPadded("Adjustments: ", formatCurrency(-1*order.subtotals.adjustments), "center")
            .lineBreak();
    }

    // This is to break the tax line into individual tax components
    // console.log(order);
    // _.each(Maestro.Tax.GetTaxComponentKeysForLocation(), function(taxComponent){
    //     if(order.subtotals.taxComponents[taxComponent.key] > 0){
    //         receiptDetails.textPadded(taxComponent.label + ":", formatCurrency(order.subtotals.taxComponents[taxComponent.key]), "center")
    //         .lineBreak();
    //     }
    // });
    
    receiptDetails.textPadded("Tax: ", formatCurrency(order.subtotals.tax), "center")
        .lineBreak()
        .textPadded("Total: ", formatCurrency(order.subtotals.total), "center", " ", 1, 1, 'B')
        .lineBreak()
        .textStyled("_______________________________________________", 'normal', 'center', 'a', 1, 1, false, true, false)
        .lineBreak();

    if(!!order.payment.cashGiven && order.payment.cashGiven != 0){
        receiptDetails.textPadded("Cash Given: ", formatCurrency(order.payment.cashGiven), "center")
            .lineBreak()
            .textPadded("Change Due: ", formatCurrency(order.payment.change), "center", " ", 1, 1, 'B')
            .lineBreak()
            .textStyled("_______________________________________________", 'normal', 'center', 'a', 1, 1, false, true, false)
            .lineBreak();
    }

    if(!!order.orderInformation){
        let info = order.orderInformation;
        if(info.orderType == "TAKEOUT" || info.orderType == "DELIVERY"){
            receiptDetails.textStyled(getOrderType(info.orderType) + " Info:", 'B', 'left', 'a', 2, 1, false, true, false).lineBreak();
        }
        if(!!info.orderName){
            receiptDetails.textStyled("Name: " + info.orderName, 'normal', 'left', 'a', 1, 1, false, true, false).lineBreak();
        }
        if(!!info.orderPhone){
            receiptDetails.textStyled("Phone: " + info.orderPhone, 'normal', 'left', 'a', 1, 1, false, true, false).lineBreak();
        }
        if(!!info.unitNumber || !!info.buzzerNumber){
            receiptDetails.textStyled("Unit #" + info.unitNumber + ", (Buzzer #" + info.buzzerNumber + ")", 'normal', 'left', 'a', 1, 1, false, true, false).lineBreak();
        }
        if(!!info.streetNumber || !!info.street || !!info.city || !!info.postalCode){
            receiptDetails.textStyled(info.streetNumber + " " + info.street, 'normal', 'left', 'a', 1, 1, false, true, false).lineBreak();
            receiptDetails.textStyled(info.city + ", " + info.postalCode, 'normal', 'left', 'a', 1, 1, false, true, false).lineBreak();
        }
        if(!!info.instructions){
            receiptDetails.textStyled("Note: " + info.instructions, 'B', 'left', 'a', 1, 1, false, true, false).lineBreak();
        }

    }

    // receiptDetails.textStyled("Order #: " + order.uniqueOrderNumber, 'normal', 'center', 'a', 1, 1, false, true, false)
    //     .lineBreak();
    receiptDetails.barcode(order.uniqueOrderNumber).lineBreak();

    if(!!gstHstNumber){
        receiptDetails.lineBreak()
            .lineBreak()
            .textStyled("Tax #: " + gstHstNumber, 'normal', 'center', 'a', 1, 1, false, true, false)
            .lineBreak();
    }

    if(!!receiptMessage){
        receiptDetails.textStyled(receiptMessage, 'normal', 'center', 'a', 1, 1, false, true, false);
    }

    receiptDetails.cut();

    if(kickoutCashDrawer == true){
         receiptDetails.cashdraw();
    }

    let receiptPrintObject = {
        "one": "{data first}"
    };

    receiptPrintObject.printjob = receiptDetails.commands();

    // console.log('comands :: ', receiptDetails.commands());
    // console.log('printing to address ::', printer.address);

    // let printCommands = {
    //     print: receiptDetails,
    //     drawer: kickoutCashDrawer
    // };

    HTTP.call(
        'POST',
        'http://' + printer.address,
        {
            data: receiptPrintObject
        },
        function(printError, printResult) {
            // console.log('Print Error :: ', printError);
            // console.log('Print Result :: ', printResult);
        }
    );

    // if(Meteor.isCordova) {
    //     //alert("Printing order receipt");
    //     EscPos.printerCommand(
    //         printCommands,
    //         printerInfo,
    //         function() {
    //             Materialize.toast("Receipt printed successfully!", 2000, "rounded green");
    //         },
    //         function() {
    //             Materialize.toast("Receipt could not be printed!", 4000, "rounded red");
    //         }
    //     );
    // }
};

Maestro.Order.PrintOrderReceiptToUSB = function(order, kickoutCashDrawer = false, receiptPrinter){
    let location = Maestro.Business.getLocation();
    let receiptMessage = location.receiptMessage || "";
    let gstHstNumber = location.gstHstNumber || "";

    // let locationPrinters = location.printers;

    // let receiptPrinter = receiptPrinter = locationPrinters[0];

    let printerInfo = {
        "printer-name": receiptPrinter.name,
        "printer-type": receiptPrinter.connection,
        "printer-address": receiptPrinter.address
    };

    let receiptDetails = {
        title: Maestro.Business.getBusinessName(),
        addressLine1: location.address.street,
        addressLine2: location.address.city,
        gstHstNumber: gstHstNumber,
        orderNumber: order.dailyOrderNumber,
        barcode: order.uniqueOrderNumber,
        invoiceDate: formattedDateAndTime(order.createdAt),
        subtotal: formatCurrency(order.subtotals.subtotal),
        tax: formatCurrency(order.subtotals.tax),
        total: formatCurrency(order.subtotals.total),
        message: receiptMessage
    };

    if (order.status == "Cancelled") {
        receiptDetails.orderNumber = order.dailyOrderNumber + "-CANCELLED";
    }

    receiptDetails.items = [];

    for (i = 0; i < order.items.length; i ++){
        let name = order.items[i].product.name;
        let sizeName = "";
        if(order.items[i].product.sizes.length > 1){
            sizeName = " - " + Maestro.Client.getProductSizeName(order.items[i].size.code);
        }

        let addItem;

        if(order.items[i].quantity > 1){
            addItem = {
                quantity: order.items[i].quantity,
                name: String(name + sizeName + ", (" + formatCurrency(order.items[i].size.price) + "ea.)"),
                price: formatCurrency(order.items[i].total),
                addons: []
            };
        } else {
            addItem = {
                quantity: order.items[i].quantity,
                name: String(name + sizeName),
                price: formatCurrency(order.items[i].total),
                addons: []
            };
        }

        if (order.items[i].addOns.length){
            for (j = 0 ; j < order.items[i].addOns.length; j++){
                addItem.addons.push({
                    name: order.items[i].addOns[j].name,
                    price: formatCurrency(order.items[i].addOns[j].price)
                });
            }
        }

        receiptDetails.items.push(addItem);
    }

    let printCommands = {
        print: receiptDetails,
        drawer: kickoutCashDrawer
    };

    // console.log("This is the actual print object: ", printCommands);
    // console.log("Printer details: ", printerInfo);

    if(Meteor.isCordova) {
        //alert("Printing order receipt");
        EscPos.printerCommand(
            printCommands,
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

Maestro.Order.PrintOrderReceipt = function(order, kickoutCashDrawer = false){  //not for new orders.. look at next function for new orders
    let locationPrinters = Maestro.Locations.getEnabledPrinters();

    if(locationPrinters && locationPrinters.length > 0) {
        let firstMainPrinter = _.find(locationPrinters, function(printer){return printer.use == "MAIN";});
        if (!firstMainPrinter){
            Maestro.Order.PrintOrderReceiptToUSB(order, kickoutCashDrawer, locationPrinters[0]);
            // console.log('print to USB');
        } else {
            if (firstMainPrinter.connection == "USB"){
                Maestro.Order.PrintOrderReceiptToUSB(order, kickoutCashDrawer, firstMainPrinter);
                // console.log('print to USB');
            } else if (firstMainPrinter.connection == "WIRELESS"){
                Maestro.Order.PrintOrderReceiptToWireless(order, kickoutCashDrawer, firstMainPrinter);
                // console.log('print to WIRELESS');
            }
        }
        
    } else {
        Materialize.toast("No printer defined for the selected location!", 4000, "rounded red");
    }
};

Maestro.Order.OpenDrawer = function(){
    let locationPrinters = Maestro.Locations.getEnabledPrinters();
    // console.log('open drawer');
    if(locationPrinters && locationPrinters.length > 0) {
        let firstMainPrinter = _.find(locationPrinters, function(printer){return printer.use == "MAIN";});
        if (!firstMainPrinter){
            Maestro.Order.OpenDrawerToUSB(locationPrinters[0]);
            // console.log('open drawer to USB');
        } else {
            if (firstMainPrinter.connection == "USB"){
                Maestro.Order.OpenDrawerToUSB(firstMainPrinter);
                // console.log('open drawer to USB');
            } else if (firstMainPrinter.connection == "WIRELESS"){
                Maestro.Order.OpenDrawerToWireless(firstMainPrinter);
                // console.log('open drawer to WIRELESS');
            }
        }
        
    } else {
        Materialize.toast("No printer defined for the selected location!", 4000, "rounded red");
    }

};

Maestro.Order.OpenDrawerToUSB = function(receiptPrinter){
    let printerInfo = {
        "printer-name": receiptPrinter.name,
        "printer-type": receiptPrinter.connection,
        "printer-address": receiptPrinter.address
    };

    let printCommands = {
        drawer: true
    };

    if(Meteor.isCordova) {
        //alert("Printing order receipt");
        EscPos.printerCommand(
            printCommands,
            printerInfo,
            function() {
                // Materialize.toast("Receipt printed successfully!", 2000, "rounded green");
            },
            function() {
                // Materialize.toast("Receipt could not be printed!", 4000, "rounded red");
            }
        );
    }
};

Maestro.Order.OpenDrawerToWireless = function(receiptPrinter){
    let printer = {
        name: receiptPrinter.name,
        connection: receiptPrinter.connection,
        address: receiptPrinter.address
    };

    let receiptDetails = new Maestro.Print.Job();


    receiptDetails.cashdraw();

    let receiptPrintObject = {
        "one": "{data first}"
    };

    receiptPrintObject.printjob = receiptDetails.commands();

    // console.log('comands :: ', receiptDetails.commands());
    // console.log('printing to address ::', printer.address);

    // let printCommands = {
    //     print: receiptDetails,
    //     drawer: kickoutCashDrawer
    // };

    HTTP.call(
        'POST',
        'http://' + printer.address,
        {
            data: receiptPrintObject
        },
        function(printError, printResult) {
            // console.log('Print Error :: ', printError);
            // console.log('Print Result :: ', printResult);
        }
    );
};

Maestro.Order.PrintNewOrderReceipt = function(template){
    let orderId = template.newOrderId.get() || template.editOrderId.get();

    // console.log('ids: ', template.newOrderId.get(), template.editOrderId.get());
    
    // console.log(template.printReceiptFlag.get());

    if(!!orderId && template.printReceiptFlag.get()){
        let order = Orders.findOne({_id: orderId});
        // console.log('order: ', order)
        let isCashPayment = (order.payment.method == Maestro.Payment.MethodsEnum.cash.key);

        Maestro.Order.PrintOrderReceipt(order, isCashPayment);

        template.printReceiptFlag.set(false);
    } else if(!!orderId) {
        Maestro.Order.OpenDrawer();
    }
};



Maestro.Order.EmailReceipt= function(order){
    if(Meteor.isServer){
        Maestro.Contact.Customer.Receipt.Send(order);
    }
};

getOrderItems = function(template){
    let orderItems = _.map(Maestro.POS.OrderItems.getAllItems(template), function (item, index) {
        return {
            itemNumber: item.itemNumber,
            product: _.pick(item.product, '_id', 'name', 'sizes'),
            size: item.size,
            seatNumber: item.seatNumber,
            sentToKitchen: item.sentToKitchen || false,
            notes: item.notes,
            isRedeemItem: item.isRedeemItem,
            isManualRedeem: item.isManualRedeem,
            variablePrice: item.variablePrice,
            unitBasedPrice: item.unitBasedPrice,
            unitBasedPriceQuantity: item.unitBasedPriceQuantity,
            unitPrice: item.unitPrice,
            unitLabel: item.unitLabel,
            addOns: _.map(item.addOns, function(addon, index){
                return {
                    _id: addon._id,
                    name: addon.name,
                    price: addon.price
                };
            }), 
            quantity: item.quantity,
            total: Maestro.POS.Tools.getItemTotal(item)
        };
    });

    return orderItems;
};

Maestro.Order.CreateOrder = function(template){
    //check location and business

    //TODO check device permissions

    let orderItems = getOrderItems(template);
    
    //// customer
    var customerId = template.orderCustomer.get() && template.orderCustomer.get()["_id"] || null;

    ////totals
    var orderSubtotals = template.orderTotals.all();
    var subtotals = {
        subtotal: orderSubtotals["subtotal"],
        discount: orderSubtotals["discount"],
        adjustments: orderSubtotals["adjustments"],
        tax: orderSubtotals["tax"],
        taxComponents: orderSubtotals["taxBreakdown"], 
        total: orderSubtotals["total"]
    };

    ////payment details
    var paymentMethod = template.paymentMethod.get();
    var paymentDetails = {
        method: paymentMethod,
        amount: orderSubtotals.total
    };

    if(paymentMethod === Maestro.Payment.MethodsEnum.cash.key) { //is this cash method of payment
        // paymentDetails.amount = orderSubtotals["cash-total"];
        paymentDetails.rounding = orderSubtotals["cash-rounding"];
        paymentDetails.cashGiven = template.cashAmountGiven.get();
        if(template.cashAmountGiven.get()){
            if (Maestro.POS.Loyalty.anyOrderGiftCards(template.existingAmountLoyalty.get())){
                paymentDetails.change = template.cashAmountGiven.get() - Maestro.Payment.CashRounding(template.paymentDueAmount.get());
            } else {
                paymentDetails.change = template.cashAmountGiven.get() - template.orderTotals.get("cash-total");
            }
        } else {
            paymentDetails.change = 0.00;
        }
    }

    if (template.paymentDueAmount.get() === null){
        if(paymentMethod === Maestro.Payment.MethodsEnum.cash.key){
            paymentDetails.received = orderSubtotals["cash-total"];
        } else {
            paymentDetails.received = paymentDetails.amount;
        }
    } else {
        paymentDetails.received = template.paymentDueAmount.get(); 
    }

    let refDate = new Date();

    let timeBucket = {
        year: refDate.getFullYear(),
        month: refDate.getMonth(),
        day: refDate.getDate(),
        hour: refDate.getHours(),
    };

    let table = template.selectedTable.get();

    var order = {
        businessId: Maestro.Client.businessId(),
        locationId: Maestro.Client.locationId(),
        tableId: table ? table._id : null,
        createdAt: new Date(),
        timeBucket: timeBucket,
        status:'Created',
        customerId: customerId,
        items: orderItems,
        subtotals: subtotals,
        payment: paymentDetails,
        dailyOrderNumber: Maestro.Order.GetNextOrderNumber(Maestro.Client.locationId()),
        uniqueOrderNumber: Maestro.Order.GetNextUniqueOrderNumber(),
        orderInformation: template.orderInformation
    };

    let waiter = UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE);

    if(!!waiter){
        order.waiterId = waiter._id;
    }

    let receiptOptions = {
        print: template.printReceiptFlag.get(),
        email: template.emailReceiptFlag.get()
    };

    // console.log('order object: ', order);

    check(order, Maestro.Schemas.Order);

    //TODO check user permissions

    //TODO check device permissions
    var orderId = Orders.insert(order);
    
    if(!!orderId){
        // Materialize.toast("Processed", 1000, 'rounded green');
        template.newOrderId.set(orderId);
        FlowRouter.go('/orders/openOrders/select/'+ orderId);
        // Maestro.Order.PrintNewOrderReceipt(template);
    } else {
        Materialize.toast("Error submitting order!", 4000, 'rounded red');
    }

    Maestro.POS.clearOrder(template);
};


Maestro.Order.UpdateOrder = function(template){
    let editOrderId = template.editOrderId.get();
    //check location and business

    //TODO check device permissions
    
    let orderItems = getOrderItems(template);
    
    //// customer
    var customerId = template.orderCustomer.get() && template.orderCustomer.get()["_id"] || null;

    ////totals
    var orderSubtotals = template.orderTotals.all();
    var subtotals = {
        subtotal: orderSubtotals["subtotal"],
        discount: orderSubtotals["discount"],
        adjustments: orderSubtotals["adjustments"],
        tax: orderSubtotals["tax"],
        taxComponents: orderSubtotals["taxBreakdown"], 
        total: orderSubtotals["total"]
    };

    ////payment details
    var paymentMethod = template.paymentMethod.get();
    var paymentDetails = {
        method: paymentMethod,
        amount: orderSubtotals.total
    };

    if(paymentMethod === Maestro.Payment.MethodsEnum.cash.key) { //is this cash method of payment
        // paymentDetails.amount = orderSubtotals["cash-total"];
        paymentDetails.rounding = orderSubtotals["cash-rounding"];
        paymentDetails.cashGiven = template.cashAmountGiven.get();
        if(template.cashAmountGiven.get()){
            if (Maestro.POS.Loyalty.anyOrderGiftCards(template.existingAmountLoyalty.get())){
                paymentDetails.change = template.cashAmountGiven.get() - Maestro.Payment.CashRounding(template.paymentDueAmount.get());
            } else {
                paymentDetails.change = template.cashAmountGiven.get() - template.orderTotals.get("cash-total");
            }
        } else {
            paymentDetails.change = 0.00;
        }
    }

    if (template.paymentDueAmount.get() === null){
        if(paymentMethod === Maestro.Payment.MethodsEnum.cash.key){
            paymentDetails.received = orderSubtotals["cash-total"];
        } else {
            paymentDetails.received = paymentDetails.amount;
        }
    } else {
        paymentDetails.received = template.paymentDueAmount.get(); 
    }

    var order = {
        businessId: Maestro.Client.businessId(),
        locationId: Maestro.Client.locationId(),
        customerId: customerId,
        items: orderItems,
        subtotals: subtotals,
        payment: paymentDetails,
        orderInformation: template.orderInformation,
    };

    let waiter = UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE);

    if(!!waiter){
        order.waiterId = waiter._id;
    }     

    // console.log('order object: ', order);

    check(order, Maestro.Schemas.Order);

    //TODO check user permissions

    //TODO check device permissions
    var orderId = Orders.update({_id: editOrderId},{$set: order});
    
    if(!!orderId){
        Materialize.toast("Updated", 1000, 'rounded green');
        FlowRouter.go('/orders/openOrders/select/'+ editOrderId);
    } else {
        Materialize.toast("Error submitting order!", 4000, 'rounded red');
    }

    Maestro.POS.clearOrder(template);
};

Maestro.Order.CompleteSplitOrder = function(template){
    let seatGroups = template.seatGrouping.get();
    let originalOrder = template.editOrder.get();
    let listOfOrderIds = [];

    _.each(seatGroups, function(seatGroup){
        if(!!seatGroup.splitOrderId){
            Maestro.Order.Update(seatGroup.splitOrderId, {status: "Completed"});
            listOfOrderIds.push(seatGroup.splitOrderId);
        }
    });

    Maestro.Order.Update(originalOrder._id, {status: "Split", splitOrders: listOfOrderIds});

    Materialize.toast("Completed", 1000, 'rounded green');
    template.checkoutMode.set(null);
    template.editOrder.set(null);
    template.inOrderEditMode.set(null);
    FlowRouter.go('/orders');

    Maestro.POS.clearOrder(template);
};

Maestro.Order.CheckoutSeatsSeparately = function(template){
    Maestro.POS.OrderItems.deleteIncompleteSplitOrders(template);
    let listOfOrderIds = [];

    let seatGroups = template.seatGrouping.get();
    _.each(seatGroups, function(seatGroup){
        let seat = seatGroup.seatNumber;
        template.checkoutSeatSelected.set(seat);
        Maestro.POS.OrderItems.isolateSeatItemsForCheckout(template);
        Tracker.flush();
        let orderId = Maestro.Order.CheckoutSeat(template);
        listOfOrderIds.push(orderId);
    });

    let originalOrder = template.editOrder.get();
    Maestro.Order.Update(originalOrder._id, {status: "Split", splitOrders: listOfOrderIds});

    _.each(seatGroups, function(seatGroup){
        if(!!seatGroup.splitOrderId){
            Maestro.Order.Update(seatGroup.splitOrderId, {status: "Created"});
        }
    });

    Materialize.toast("Orders Split", 1000, 'rounded green');
    template.checkoutMode.set(null);
    template.editOrder.set(null);
    template.inOrderEditMode.set(null);
    FlowRouter.go('/orders/history/select/'+ originalOrder._id);

    Maestro.POS.clearOrder(template);
};

Maestro.Order.CheckoutSeat = function(template){

    let originalOrderId = template.editOrderId.get();
    let originalOrder = template.editOrder.get();

    let orderItems = getOrderItems(template);
    
    //// customer
    var customerId = template.orderCustomer.get() && template.orderCustomer.get()["_id"] || null;

    ////totals
    var orderSubtotals = template.orderTotals.all();
    var subtotals = {
        subtotal: orderSubtotals["subtotal"],
        discount: orderSubtotals["discount"],
        adjustments: orderSubtotals["adjustments"],
        tax: orderSubtotals["tax"],
        taxComponents: orderSubtotals["taxBreakdown"], 
        total: orderSubtotals["total"]
    };

    ////payment details
    var paymentMethod = template.paymentMethod.get();
    var paymentDetails = {
        method: paymentMethod,
        amount: orderSubtotals.total
    };

    if(paymentMethod === Maestro.Payment.MethodsEnum.cash.key) { //is this cash method of payment
        paymentDetails.rounding = orderSubtotals["cash-rounding"];
        paymentDetails.cashGiven = template.cashAmountGiven.get();
        if(template.cashAmountGiven.get()){
            if (Maestro.POS.Loyalty.anyOrderGiftCards(template.existingAmountLoyalty.get())){
                paymentDetails.change = template.cashAmountGiven.get() - Maestro.Payment.CashRounding(template.paymentDueAmount.get());
            } else {
                paymentDetails.change = template.cashAmountGiven.get() - template.orderTotals.get("cash-total");
            }
        } else {
            paymentDetails.change = 0.00;
        }
    }

    if (template.paymentDueAmount.get() === null){
        if(paymentMethod === Maestro.Payment.MethodsEnum.cash.key){
            paymentDetails.received = orderSubtotals["cash-total"];
        } else {
            paymentDetails.received = paymentDetails.amount;
        }
    } else {
        paymentDetails.received = template.paymentDueAmount.get(); 
    }   

    paymentDetails.tips = template.tipGiven.get();

    let table = template.selectedTable.get();

    var order = _.omit(originalOrder, "_id");

    order.tableId = table ? table._id : null;
    order.status = 'Split';
    order.customerId = customerId;
    order.items = orderItems;
    order.subtotals = subtotals;
    order.payment = paymentDetails;
    order.originalOrderId = originalOrderId;
    order.orderInformation = template.orderInformation;

    let waiter = UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE);

    if(!!waiter){
        order.waiterId = waiter._id;
    }

    order.createdAt.setMilliseconds(order.createdAt.getMilliseconds() + 1);

    var buyLoyaltyDetails = convertOrderLoyaltyItemsToBuyItems(template);

    var updateExistingPrograms = {
        quantityBased: null,
        amountBased: null
    };

    prepareLoyaltyItemsForPurchase (template, order, updateExistingPrograms, buyLoyaltyDetails );

    let receiptOptions = {
        print: template.printReceiptFlag.get(),
        email: template.emailReceiptFlag.get()
    };

    // console.log("order: ", order);

    // Meteor.call("submitOrder", order, customerId, buyLoyaltyDetails, updateExistingPrograms, receiptOptions, function (error, result) {
    //     if(error) {
    //         Materialize.toast("Error submitting order!", 4000);
    //     } else {
    //         Materialize.toast("Order successfully submitted", 4000);
    //         template.newOrderId.set(result);
    //         Maestro.Order.PrintNewOrderReceipt(template);
    //     }
    // });

    // console.log('order object: ', order);

    check(order, Maestro.Schemas.Order);

    //TODO check user permissions

    //TODO check device permissions
    // let orderId = Orders.update({_id: checkoutOrderId},{$set: order});
    let orderId = Orders.insert(order);


    let checkOutSeat = template.checkoutSeatSelected.get();
    let seatGrouping = template.seatGrouping.get();
    seatGrouping = _.map(seatGrouping, function(seatGroup){
        if(seatGroup.seatNumber == checkOutSeat){
            seatGroup.splitOrderId = orderId;
            return seatGroup;
        } else {
            return seatGroup;
        }
    });
    // console.log('seatGrouping :', seatGrouping);
    template.seatGrouping.set(seatGrouping);
    template.checkoutSeatSelected.set();

    Maestro.LoyaltyCards.CheckoutLoyaltyCards (customerId, orderId, order.businessId, updateExistingPrograms, buyLoyaltyDetails);

    if (receiptOptions.email && customerId) {
        Meteor.call('emailReceipt', Orders.findOne({_id: orderId}), function(error, result){
            if(error){
                Materialize.toast('Error Sending Email Receipt', 2000);
            } else {
                Materialize.toast('Receipt Emailed to Custoemr', 2000);
            }
        });
    }
    
    if(!!orderId){
        // Materialize.toast("Processed", 1000, 'rounded green');
        Maestro.Order.PrintNewOrderReceipt(template);
    } else {
        Materialize.toast("Error submitting order!", 4000, 'rounded red');
    }

    return orderId;

};

Maestro.Order.CheckoutOrder = function(template){

    let checkoutOrderId = template.editOrderId.get();
    
    let orderItems = getOrderItems(template);
    
    //// customer
    var customerId = template.orderCustomer.get() && template.orderCustomer.get()["_id"] || null;

    ////totals
    var orderSubtotals = template.orderTotals.all();
    var subtotals = {
        subtotal: orderSubtotals["subtotal"],
        discount: orderSubtotals["discount"],
        adjustments: orderSubtotals["adjustments"],
        tax: orderSubtotals["tax"],
        taxComponents: orderSubtotals["taxBreakdown"], 
        total: orderSubtotals["total"]
    };

    ////payment details
    var paymentMethod = template.paymentMethod.get();
    var paymentDetails = {
        method: paymentMethod,
        amount: orderSubtotals.total
    };

    if(paymentMethod === Maestro.Payment.MethodsEnum.cash.key) { //is this cash method of payment
        // paymentDetails.amount = orderSubtotals["cash-total"];
        paymentDetails.rounding = orderSubtotals["cash-rounding"];
        paymentDetails.cashGiven = template.cashAmountGiven.get();
        if(template.cashAmountGiven.get()){
            if (Maestro.POS.Loyalty.anyOrderGiftCards(template.existingAmountLoyalty.get())){
                paymentDetails.change = template.cashAmountGiven.get() - Maestro.Payment.CashRounding(template.paymentDueAmount.get());
            } else {
                paymentDetails.change = template.cashAmountGiven.get() - template.orderTotals.get("cash-total");
            }
        } else {
            paymentDetails.change = 0.00;
        }
    }

    if (template.paymentDueAmount.get() === null){
        if(paymentMethod === Maestro.Payment.MethodsEnum.cash.key){
            paymentDetails.received = orderSubtotals["cash-total"];
        } else {
            paymentDetails.received = paymentDetails.amount;
        }
    } else {
        paymentDetails.received = template.paymentDueAmount.get(); b 
    }

    paymentDetails.tips = template.tipGiven.get();

    let refDate = new Date();

    let timeBucket = {
        year: refDate.getFullYear(),
        month: refDate.getMonth(),
        day: refDate.getDate(),
        hour: refDate.getHours(),
    };

    let table = template.selectedTable.get();

    var order = {
        businessId: Maestro.Client.businessId(),
        locationId: Maestro.Client.locationId(),
        status:'Completed',
        customerId: customerId,
        items: orderItems,
        subtotals: subtotals,
        payment: paymentDetails,
        orderInformation: template.orderInformation,
    };

    let waiter = UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE);

    if(!!waiter){
        order.waiterId = waiter._id;
    }
    
    var buyLoyaltyDetails = convertOrderLoyaltyItemsToBuyItems(template);

    var updateExistingPrograms = {
        quantityBased: null,
        amountBased: null
    };

    prepareLoyaltyItemsForPurchase (template, order, updateExistingPrograms, buyLoyaltyDetails );

    let receiptOptions = {
        print: template.printReceiptFlag.get(),
        email: template.emailReceiptFlag.get()
    };

    // console.log(updateExistingPrograms.updateTallyPrograms);
    // console.log('quantity card redeem info: ', order.payment.quantityCards);
    // console.log("buyLoyaltyDetails: ", buyLoyaltyDetails);
    // console.log("updateExistingPrograms: ", updateExistingPrograms);
    // console.log("order: ", order);

    // console.log('order object: ', order);

    check(order, Maestro.Schemas.Order);

    //TODO check user permissions

    //TODO check device permissions
    let orderId = Orders.update({_id: checkoutOrderId},{$set: order});

    Maestro.LoyaltyCards.CheckoutLoyaltyCards (customerId, orderId, order.businessId, updateExistingPrograms, buyLoyaltyDetails);

    if (receiptOptions.email && customerId) {
        Meteor.call('emailReceipt', Orders.findOne({_id: orderId}), function(error, result){
            if(error){
                Materialize.toast('Error Sending Email Receipt', 2000);
            } else {
                Materialize.toast('Receipt Emailed to Custoemr', 2000);
            }
        });

        // if(Meteor.isServer){
        //     Maestro.Contact.Customer.Receipt.Send(Orders.findOne({_id: orderId}));
        // }
    }
    
    if(!!orderId){
        // Materialize.toast("Processed", 1000, 'rounded green');
        template.newOrderId.set(checkoutOrderId);
        Maestro.Order.PrintNewOrderReceipt(template);
        template.checkoutMode.set(null);
        template.editOrder.set(null);
        template.inOrderEditMode.set(null);
        FlowRouter.go('/orders');
    } else {
        Materialize.toast("Error submitting order!", 4000, 'rounded red');
    }

    Maestro.POS.clearOrder(template);

    showPriorOrderSummaryCheck(template);
};

Maestro.Order.DirectCheckoutOrder = function(template){
    // Tracker.flush();
    //TODO check device permissions
    
    let orderItems = getOrderItems(template);
    
    //// customer
    var customerId = template.orderCustomer.get() && template.orderCustomer.get()["_id"] || null;

    ////totals
    var orderSubtotals = template.orderTotals.all();
    var subtotals = {
        subtotal: orderSubtotals["subtotal"],
        discount: orderSubtotals["discount"],
        adjustments: orderSubtotals["adjustments"],
        tax: orderSubtotals["tax"],
        taxComponents: orderSubtotals["taxBreakdown"], 
        total: orderSubtotals["total"]
    };

    ////payment details
    var paymentMethod = template.paymentMethod.get();
    var paymentDetails = {
        method: paymentMethod,
        amount: orderSubtotals.total
    };

    if(paymentMethod === Maestro.Payment.MethodsEnum.cash.key) { //is this cash method of payment
        // paymentDetails.amount = orderSubtotals["cash-total"];
        paymentDetails.rounding = orderSubtotals["cash-rounding"];
        paymentDetails.cashGiven = template.cashAmountGiven.get();
        if(template.cashAmountGiven.get()){
            if (Maestro.POS.Loyalty.anyOrderGiftCards(template.existingAmountLoyalty.get())){
                paymentDetails.change = template.cashAmountGiven.get() - Maestro.Payment.CashRounding(template.paymentDueAmount.get());
            } else {
                paymentDetails.change = template.cashAmountGiven.get() - template.orderTotals.get("cash-total");
            }
        } else {
            paymentDetails.change = 0.00;
        } 
    }

    // console.log(template.paymentDueAmount.get(), paymentMethod, orderSubtotals["cash-total"], paymentDetails.amount );
    if (template.paymentDueAmount.get() === null){
        if(paymentMethod === Maestro.Payment.MethodsEnum.cash.key){
            paymentDetails.received = orderSubtotals["cash-total"];
        } else {
            paymentDetails.received = paymentDetails.amount;
        }
    } else {
        paymentDetails.received = template.paymentDueAmount.get(); 
    }

    paymentDetails.tips = template.tipGiven.get();

    let refDate = new Date();

    let timeBucket = {
        year: refDate.getFullYear(),
        month: refDate.getMonth(),
        day: refDate.getDate(),
        hour: refDate.getHours(),
    };

    let table = template.selectedTable.get();

    var order = {
        businessId: Maestro.Client.businessId(),
        locationId: Maestro.Client.locationId(),
        tableId: table ? table._id : null,
        createdAt: new Date(),
        timeBucket: timeBucket,
        status:'Completed',
        customerId: customerId,
        items: orderItems,
        subtotals: subtotals,
        payment: paymentDetails,
        dailyOrderNumber: Maestro.Order.GetNextOrderNumber(Maestro.Client.locationId()),
        uniqueOrderNumber: Maestro.Order.GetNextUniqueOrderNumber(),
        orderInformation: template.orderInformation,
    };

    let waiter = UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE);

    if(!!waiter){
        order.waiterId = waiter._id;
    }

    var buyLoyaltyDetails = convertOrderLoyaltyItemsToBuyItems(template);

    var updateExistingPrograms = {
        quantityBased: null,
        amountBased: null
    };

    prepareLoyaltyItemsForPurchase (template, order, updateExistingPrograms, buyLoyaltyDetails );

    // console.log('daily #: ',  Maestro.Order.GetNextOrderNumber(Maestro.Client.locationId()));
    // console.log('unique #: ', Maestro.Order.GetNextUniqueOrderNumber());    

    // console.log(updateExistingPrograms.updateTallyPrograms);

    // console.log('quantity card redeem info: ', order.payment.quantityCards);

    // console.log("buyLoyaltyDetails: ", buyLoyaltyDetails);
    // console.log("updateExistingPrograms: ", updateExistingPrograms);

    let receiptOptions = {
        print: template.printReceiptFlag.get(),
        email: template.emailReceiptFlag.get()
    };

    // console.log("order: ", order);

    // console.log('direct checkout order object: ', order);

    check(order, Maestro.Schemas.Order);

    //TODO check user permissions

    //TODO check device permissions
    let orderId = Orders.insert(order);

    Maestro.LoyaltyCards.CheckoutLoyaltyCards (customerId, orderId, order.businessId, updateExistingPrograms, buyLoyaltyDetails);

    if (receiptOptions.email && customerId) {
        Meteor.call('emailReceipt', Orders.findOne({_id: orderId}), function(error, result){
            if(error){
                Materialize.toast('Error Sending Email Receipt', 2000);
            } else {
                Materialize.toast('Receipt Emailed to Custoemr', 2000);
            }
        });
    }
    
    if(!!orderId){
        // Materialize.toast("Processed", 1000, 'rounded green');
        template.newOrderId.set(orderId);
        Maestro.Order.PrintNewOrderReceipt(template);
        template.checkoutMode.set(null);
        template.editOrder.set(null);
        template.inOrderEditMode.set(null);
        FlowRouter.go('/orders');
    } else {
        Materialize.toast("Error submitting order!", 4000, 'rounded red');
    }

    Maestro.POS.clearOrder(template);

    showPriorOrderSummaryCheck(template);
}; 

Maestro.Order.CancelOrder= function(orderId){
    var cancelled; 
    try{
        cancelled = Orders.update(orderId, {$set: {status: "Cancelled"} });
    } catch(e){
        // console.log("Error cancelling order: "+ e);
    }

    let orderObj = Orders.findOne({_id: orderId});

    Maestro.LoyaltyCards.CancelOrderLoyalty (orderId);
};

