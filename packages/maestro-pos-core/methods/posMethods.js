// let _pullCustomerLoyalty = function(customerId, program){
//     var pulled;
//     try {
//         pulled = Customers.update(customerId, {$pull: {loyaltyPrograms: program}});
//         console.log("pulled: " + pulled);
//     } catch (e){
//         console.log("error pulling: " + e);
//     }
// };

// let _addToSetCustomerLoyalty = function(customerId, program){
//     var added;
//     try {
//         added = Customers.update(customerId, {$addToSet: {loyaltyPrograms: program}});
//         console.log("added: " + added);
//     } catch(e){
//         console.log("Error adding: " + e);
//     }
// };

Meteor.methods({
    emailReceipt: function(order){
        if(Meteor.isServer){
            Maestro.Contact.Customer.Receipt.Send(order);
        }
    },

    // checkCustomerProgramExpiry: function(customerId){
    //     let allCustomerLoyaltyPrograms = Customers.findOne({_id: customerId}).loyaltyPrograms;

    //     // var customerLoyaltyPrograms = allCustomerLoyaltyPrograms;
    //     var customerLoyaltyPrograms = _.reject(allCustomerLoyaltyPrograms, function(program){return program.expired;});

    //     var _isProgramQuantityBased = function(program){
    //         if (program.programType.quantity > 0){
    //             return true;
    //         } else { return false;}
    //     };

    //     var _isProgramAmountBased = function(program){
    //         if (program.programType.creditAmount > 0){
    //             return true;
    //         } else { return false;}
    //     };

    //     if (customerLoyaltyPrograms){
    //         var boughtOn;
    //         var programId;
    //         for (i=0; i< customerLoyaltyPrograms.length; i++){

    //             //** temporary appending for old programs that do not have this attribute
    //             customerLoyaltyPrograms[i].creditPercent = customerLoyaltyPrograms[i].creditPercent || 0;
    //             //**

    //             programId = customerLoyaltyPrograms[i].programId;
    //             boughtOn = new Date(customerLoyaltyPrograms[i].boughtOn);

    //             let purchasedOn= new Date();
    //             purchasedOn.setHours(0);
    //             purchasedOn.setMinutes(0);
    //             purchasedOn.setSeconds(0);
    //             purchasedOn.setMilliseconds(1);

    //             let todayDate = new Date();
    //             todayDate.setHours(23);
    //             todayDate.setMinutes(59);
    //             todayDate.setSeconds(59);
    //             todayDate.setMilliseconds(999);

    //             let loyaltyProgram = LoyaltyPrograms.findOne({_id: programId});

    //             if(loyaltyProgram.expiryDays){
    //                 let remainingDays = loyaltyProgram.expiryDays - ((todayDate.valueOf() - purchasedOn.valueOf())/(1000*60*60*24)).toFixed(0);
    //                 if (remainingDays < 0 ){

    //                     _pullCustomerLoyalty(customerId, customerLoyaltyPrograms[i]);

    //                     customerLoyaltyPrograms[i].expired = true;

    //                     _addToSetCustomerLoyalty(customerId, customerLoyaltyPrograms[i]);

    //                 }
    //             } else if (loyaltyProgram.expiryDate){
    //                 if (todayDate>loyaltyProgram.expiryDate){

    //                     _pullCustomerLoyalty(customerId, customerLoyaltyPrograms[i]);

    //                     customerLoyaltyPrograms[i].expired = true;

    //                     _addToSetCustomerLoyalty(customerId, customerLoyaltyPrograms[i]);

    //                 }
    //             }

    //             if(_isProgramQuantityBased(loyaltyProgram)){
    //                 if (customerLoyaltyPrograms[i].remainingQuantity <= 0){

    //                     _pullCustomerLoyalty(customerId, customerLoyaltyPrograms[i]);

    //                     customerLoyaltyPrograms[i].expired = true;

    //                     _addToSetCustomerLoyalty(customerId, customerLoyaltyPrograms[i]);
    //                 }
    //             } else if (_isProgramAmountBased(loyaltyProgram)){
    //                 if (customerLoyaltyPrograms[i].remainingAmount <= 0.01){

    //                     _pullCustomerLoyalty(customerId, customerLoyaltyPrograms[i]);

    //                     customerLoyaltyPrograms[i].expired = true;

    //                     _addToSetCustomerLoyalty(customerId, customerLoyaltyPrograms[i]);
    //                 }
    //             }
    //         }
    //     }
    // },

    // submitOrder: function (order, customerId, buyLoyaltyDetails, updateExistingPrograms, receiptOptions) {
    //     check(order, Maestro.Schemas.Order);

    //     //TODO check user permissions

    //     //TODO check device permissions

    //     var orderId = Orders.insert(order);

    //     if(customerId){
    //         var businessId = order.businessId
    //         var currentCustomer = Customers.findOne({_id: customerId});
    //         var currentLoyaltyDetails = currentCustomer.loyaltyPrograms;
    //         var updateExistingLoyaltyQuantities = updateExistingPrograms.quantityBased;
    //         var updateExistingGiftCards = updateExistingPrograms.amountBased;
    //         //update quantities of existing quantity based programs
    //         if (orderId && currentLoyaltyDetails){
    //             for(i=0; i < currentLoyaltyDetails.length; i++){
    //                 if(updateExistingLoyaltyQuantities){
    //                     for (j=0; j< updateExistingLoyaltyQuantities.length; j++){
    //                         if(currentLoyaltyDetails[i].programId == updateExistingLoyaltyQuantities[j].programId){

    //                             _pullCustomerLoyalty (customerId, currentLoyaltyDetails[i]);

    //                             let updateProgram = {
    //                                 programId: currentLoyaltyDetails[i].programId,
    //                                 remainingQuantity: updateExistingLoyaltyQuantities[j].remainingQuantity,
    //                                 remainingAmount: currentLoyaltyDetails[i].remainingAmount || 0,
    //                                 creditPercent: currentLoyaltyDetails[i].creditPercent || 0,
    //                                 expired: false,
    //                                 boughtOn: currentLoyaltyDetails[i].boughtOn
    //                             };

    //                             _addToSetCustomerLoyalty(customerId, updateProgram);
    //                         }
    //                     }
    //                 }

    //                 if(updateExistingGiftCards){
    //                     for (j=0; j< updateExistingGiftCards.length; j++){
    //                         if(currentLoyaltyDetails[i].programId == updateExistingGiftCards[j].programId){

    //                             _pullCustomerLoyalty(customerId, currentLoyaltyDetails[i]);

    //                             let updateProgram = {
    //                                 programId: currentLoyaltyDetails[i].programId,
    //                                 remainingQuantity: currentLoyaltyDetails[i].remainingQuantity || 0,
    //                                 remainingAmount: updateExistingGiftCards[j].remainingAmount,
    //                                 creditPercent: currentLoyaltyDetails[i].creditPercent || 0,
    //                                 expired: false,
    //                                 boughtOn: currentLoyaltyDetails[i].boughtOn
    //                             };

    //                             _addToSetCustomerLoyalty(customerId, updateProgram);

    //                         }
    //                     }
    //                 }
    //             }
    //         }
            

    //         currentCustomer = Customers.findOne({_id: customerId});
    //         currentLoyaltyDetails = currentCustomer.loyaltyPrograms;

    //         //pull and increment balance values if same program is being purchased with remaining amounts/qty
    //         if (orderId && currentLoyaltyDetails){
    //             for(i=0; i< buyLoyaltyDetails.length; i++){
    //                 for(j = 0; j<currentLoyaltyDetails.length; j++){
    //                     if(buyLoyaltyDetails[i].programId == currentLoyaltyDetails[j].programId){
    //                         buyLoyaltyDetails[i].remainingQuantity += currentLoyaltyDetails[j].remainingQuantity;
    //                         buyLoyaltyDetails[i].remainingAmount += currentLoyaltyDetails[j].remainingAmount;

    //                         _pullCustomerLoyalty(customerId, currentLoyaltyDetails[j]);

    //                         console.log('pulled: ', currentLoyaltyDetails[j]);
    //                     }
    //                 }
    //             }
    //         }



    //         //update with newly purchased loyalty programs
    //         if (orderId && customerId && buyLoyaltyDetails){
    //             for (i = 0; i < buyLoyaltyDetails.length; i++){
    //                 console.log('added: ', buyLoyaltyDetails[i]);
    //                 _addToSetCustomerLoyalty(customerId, buyLoyaltyDetails[i]);
    //             }
    //         }

    //         //pull any expired/depleted programs
    //         currentCustomer = Customers.findOne({_id: customerId});
    //         currentLoyaltyDetails = currentCustomer.loyaltyPrograms;
    //         var genericProgram;

    //         if (orderId && currentLoyaltyDetails){
    //             for(i=0; i<currentLoyaltyDetails.length; i++){
    //                 genericProgram = LoyaltyPrograms.findOne({_id: currentLoyaltyDetails[i].programId});
    //                 if(genericProgram.programType.type == "Quantity" && currentLoyaltyDetails[i].remainingQuantity <= 0){

    //                     _pullCustomerLoyalty(customerId, currentLoyaltyDetails[i]);

    //                     currentLoyaltyDetails[i].expired = true;

    //                     _addToSetCustomerLoyalty(customerId, currentLoyaltyDetails[i]);

    //                 }

    //                 // if Amount
    //                 if(genericProgram.programType.type == "Amount" && currentLoyaltyDetails[i].remainingAmount <= 0){

    //                     _pullCustomerLoyalty(customerId, currentLoyaltyDetails[i]);

    //                     currentLoyaltyDetails[i].expired = true;

    //                     _addToSetCustomerLoyalty(customerId, currentLoyaltyDetails[i]);

    //                 }

    //                 // if expired (days or date) should be removed at the beginning of the order process not at the end.
    //             }
    //         }
    //     }

    //     // if(receiptOptions.print){
    //     //     _printOrderReceipt(Orders.findOne({_id: orderId}));
    //     // }

    //     if (receiptOptions.email && customerId) {
    //         if(Meteor.isServer){
    //             Maestro.Contact.Customer.Receipt.Send(Orders.findOne({_id: orderId}));
    //         }
    //     }

    //     return orderId;

    // },

    // cancelOrder: function(orderId){
    //     var cancelled; 
    //     try{
    //         cancelled = Orders.update(orderId, {$set: {status: "Cancelled"} });
    //     } catch(e){
    //         console.log("Error cancelling order: "+ e);
    //     }

    //     let orderObj = Orders.findOne({_id: orderId});

    //     let allOrderItems = orderObj.items;

    //     let giftCardRedeem = orderObj.payment.giftCards || [];
    //     let quantityCardRedeem = orderObj.payment.quantityCards || [];

    //     var allLoyaltyPurchaseItems = [];

    //     var _isLoyaltyProgramPurchase = function (programId){
    //         if(LoyaltyPrograms.findOne({_id: programId})){
    //             return true;
    //         } else {return false;}
    //     };

    //     var _isProgramQuantityBased = function(program){
    //         if (program.programType.type == "Quantity"){
    //             return true;
    //         } else { return false;}
    //     };

    //     var _isProgramAmountBased = function(program){
    //         if (program.programType.creditAmount == "Amount"){
    //             return true;
    //         } else { return false;}
    //     };

    //     //preparing for any take back of purchased loyalty programs
    //     for (item = 0; item < allOrderItems.length; item ++){
    //         var itemId = allOrderItems[item].product._id;
    //         if (_isLoyaltyProgramPurchase(itemId)){
    //             var loyaltyProgramObj = LoyaltyPrograms.findOne({_id: itemId});
    //             if (_isProgramQuantityBased(loyaltyProgramObj)){
    //                 quantityCardRedeem.push({
    //                     programId: loyaltyProgramObj._id,
    //                     redeemedQuantity: -loyaltyProgramObj.programType.quantity
    //                 });
    //             } else if (_isProgramAmountBased(loyaltyProgramObj)){
    //                 giftCardRedeem.push({
    //                     programId: loyaltyProgramObj._id,
    //                     redeemedAmount: -loyaltyProgramObj.programType.creditAmount
    //                 });
    //             }
    //         }
    //     }

    //     console.log('gift card redeem info: ', giftCardRedeem);
    //     console.log('quantity card redeem info: ', quantityCardRedeem);
    //     console.log('allLoyaltyPurchaseItems: ', allLoyaltyPurchaseItems);

    //     let customerId = orderObj.customerId;

    //     var customerPrograms; 
        
    //     if (customerId){
    //         customerPrograms = Customers.findOne({_id: customerId}).loyaltyPrograms;
    //     }

    //     console.log('current customer programs: ', customerPrograms);

    //     if(customerPrograms){
    //         //credit back gift cards
    //         for (card = 0; card < giftCardRedeem.length; card ++){
    //             var programIndex = _.indexOf(customerPrograms, _.find(customerPrograms, function(program){return program.programId == giftCardRedeem[card].programId;}));
    //             customerPrograms[programIndex].remainingAmount += giftCardRedeem[card].redeemedAmount;
    //             customerPrograms[programIndex].expired = false;
    //             if (customerPrograms[programIndex].remainingAmount < 0){
    //                 // customerPrograms[programIndex].remainingAmount = 0;
    //                 customerPrograms.splice(programIndex,1);
    //             }
                
    //         }

    //         //credit back quantity cards
    //         for (card = 0; card < quantityCardRedeem.length; card ++){
    //             var programIndex = _.indexOf(customerPrograms, _.find(customerPrograms, function(program){return program.programId == quantityCardRedeem[card].programId;}));
    //             customerPrograms[programIndex].remainingQuantity += quantityCardRedeem[card].redeemedQuantity;
    //             customerPrograms[programIndex].expired = false;
    //             if (customerPrograms[programIndex].remainingQuantity < 0){
    //                 // customerPrograms[programIndex].remainingQuantity = 0;
    //                 customerPrograms.splice(programIndex,1);
    //             }
                
    //         }

    //         //take out purchased loyalty programs
    //         // for (card = 0; card < allLoyaltyPurchaseItems.length; card ++){
    //         //     var programIndex = _.indexOf(customerPrograms, _.find(customerPrograms, function(program){return program.programId == allLoyaltyPurchaseItems[card].programId;}));
    //         //     customerPrograms.splice(programIndex, 1);
    //         // }

    //         var credited;
    //         console.log('updated customer programs: ', customerPrograms);
    //         try{
    //             credited = Customers.update(customerId, {$set: {loyaltyPrograms: customerPrograms} });
    //         } catch(e){
    //             console.log("Error updating program in customer: "+ e);
    //         }
    //     }

    // },

});

