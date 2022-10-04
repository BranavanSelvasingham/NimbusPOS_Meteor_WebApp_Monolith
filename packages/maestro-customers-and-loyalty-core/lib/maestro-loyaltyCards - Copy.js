Maestro.LoyaltyCards = {};

let _pullCustomerLoyalty = function(customerId, program){
    var pulled;
    try {
        pulled = Customers.update(customerId, {$pull: {loyaltyPrograms: program}});
        // console.log("pulled: " + pulled);
    } catch (e){
        // console.log("error pulling: " + e);
    }
};

let _addToSetCustomerLoyalty = function(customerId, program){
    var added;
    try {
        added = Customers.update(customerId, {$addToSet: {loyaltyPrograms: program}});
        // console.log("added: " + added);
    } catch(e){
        // console.log("Error adding: " + e);
    }
};

Maestro.LoyaltyCards.getCustomerActiveCards = function(customerId){
	let customerObj = Customers.findOne({_id: customerId});

    let allExistingPrograms = customerObj.loyaltyPrograms;

    return _.reject(allExistingPrograms, function(program){return program.expired;});
};

Maestro.LoyaltyCards.AddProgramToCustomer = function(customerId, program){
    _addToSetCustomerLoyalty(customerId, program);
};

Maestro.LoyaltyCards.UpdateExistingPrograms = function(template, updateProgram, updateBalance, expired){
    let loyaltyProgram = LoyaltyPrograms.findOne({_id: updateProgram.programId});

    let programIndex;
    let customerId = template.selectedCustomer.get()._id;
    let allCustomerPrograms = Customers.findOne({_id: customerId}).loyaltyPrograms;

    _.each(allCustomerPrograms, function(program, index){
        if(_.isEqual(program, updateProgram)){programIndex = index;}
    });

    if(programIndex > -1){
        if(loyaltyProgram.programType.type == "Quantity"){
            allCustomerPrograms[programIndex].remainingQuantity = updateBalance;
        } else if(loyaltyProgram.programType.type == "Amount"){
            allCustomerPrograms[programIndex].remainingAmount = updateBalance;
        }

        if(expired === false){
            allCustomerPrograms[programIndex].expired = false;
        } else if (expired === true){
            allCustomerPrograms[programIndex].expired = true;
        }
    }

    let updated = Customers.update({_id: customerId}, {$set: {loyaltyPrograms: allCustomerPrograms}});
    if(updated){Materialize.toast("Updated", 1000, 'green');}
};

Maestro.LoyaltyCards.Tools = {};

Maestro.LoyaltyCards.Tools.UpdateExpiryStatus = function(customerId, customerLoyaltyPrograms){
	_pullCustomerLoyalty(customerId, customerLoyaltyPrograms[i]);

    customerLoyaltyPrograms[i].expired = true;

    _addToSetCustomerLoyalty(customerId, customerLoyaltyPrograms[i]);
};

Maestro.LoyaltyCards.Tools.UpdateExistingQuantityCards = function(customerId, currentLoyaltyDetails, updateExistingLoyaltyQuantities){
	_pullCustomerLoyalty (customerId, currentLoyaltyDetails[i]);

    let updateProgram = {
        programId: currentLoyaltyDetails[i].programId,
        remainingQuantity: updateExistingLoyaltyQuantities[j].remainingQuantity,
        remainingAmount: currentLoyaltyDetails[i].remainingAmount || 0,
        creditPercent: currentLoyaltyDetails[i].creditPercent || 0,
        expired: false,
        boughtOn: currentLoyaltyDetails[i].boughtOn
    };

    _addToSetCustomerLoyalty(customerId, updateProgram);
};

Maestro.LoyaltyCards.Tools.UpdateExistingGiftCards = function(customerId, currentLoyaltyDetails, updateExistingGiftCards){
	_pullCustomerLoyalty(customerId, currentLoyaltyDetails[i]);

    let updateProgram = {
        programId: currentLoyaltyDetails[i].programId,
        remainingQuantity: currentLoyaltyDetails[i].remainingQuantity || 0,
        remainingAmount: updateExistingGiftCards[j].remainingAmount,
        creditPercent: currentLoyaltyDetails[i].creditPercent || 0,
        expired: false,
        boughtOn: currentLoyaltyDetails[i].boughtOn
    };

    _addToSetCustomerLoyalty(customerId, updateProgram);
};

Maestro.LoyaltyCards.CheckCustomerProgramExpiry= function(customerId){
    let allCustomerLoyaltyPrograms = Customers.findOne({_id: customerId}).loyaltyPrograms;

    // var customerLoyaltyPrograms = allCustomerLoyaltyPrograms;
    var customerLoyaltyPrograms = _.reject(allCustomerLoyaltyPrograms, function(program){return program.expired;});

    var _isProgramQuantityBased = function(program){
        if (program.programType.quantity > 0){
            return true;
        } else { return false;}
    };

    var _isProgramAmountBased = function(program){
        if (program.programType.creditAmount > 0){
            return true;
        } else { return false;}
    };

    if (customerLoyaltyPrograms){
        var boughtOn;
        var programId;
        for (i=0; i< customerLoyaltyPrograms.length; i++){

            //** temporary appending for old programs that do not have this attribute
            customerLoyaltyPrograms[i].creditPercent = customerLoyaltyPrograms[i].creditPercent || 0;
            //**

            programId = customerLoyaltyPrograms[i].programId;
            boughtOn = new Date(customerLoyaltyPrograms[i].boughtOn);

            let purchasedOn= new Date();
            purchasedOn.setHours(0);
            purchasedOn.setMinutes(0);
            purchasedOn.setSeconds(0);
            purchasedOn.setMilliseconds(1);

            let todayDate = new Date();
            todayDate.setHours(23);
            todayDate.setMinutes(59);
            todayDate.setSeconds(59);
            todayDate.setMilliseconds(999);

            let loyaltyProgram = LoyaltyPrograms.findOne({_id: programId});

            if(loyaltyProgram.expiryDays){
                let remainingDays = loyaltyProgram.expiryDays - ((todayDate.valueOf() - purchasedOn.valueOf())/(1000*60*60*24)).toFixed(0);
                if (remainingDays < 0 ){

                	Maestro.LoyaltyCards.Tools.UpdateExpiryStatus (customerId, customerLoyaltyPrograms);

                }
            } else if (loyaltyProgram.expiryDate){
                if (todayDate>loyaltyProgram.expiryDate){

                	Maestro.LoyaltyCards.Tools.UpdateExpiryStatus (customerId, customerLoyaltyPrograms);

                }
            }

            if(_isProgramQuantityBased(loyaltyProgram)){
                if (customerLoyaltyPrograms[i].remainingQuantity <= 0){

                	Maestro.LoyaltyCards.Tools.UpdateExpiryStatus (customerId, customerLoyaltyPrograms);
                }
            } else if (_isProgramAmountBased(loyaltyProgram)){
                if (customerLoyaltyPrograms[i].remainingAmount <= 0.01){

                	Maestro.LoyaltyCards.Tools.UpdateExpiryStatus (customerId, customerLoyaltyPrograms);
                }
            }
        }
    }
};

Maestro.LoyaltyCards.CheckoutLoyaltyCards = function(customerId, orderId, businessId, updateExistingPrograms, buyLoyaltyDetails){
    if(customerId){
        let currentCustomer = Customers.findOne({_id: customerId});
        let currentLoyaltyDetails = currentCustomer.loyaltyPrograms;
        let updateExistingLoyaltyQuantities = updateExistingPrograms.quantityBased;
        let updateExistingGiftCards = updateExistingPrograms.amountBased;
        let updateTallyPrograms = updateExistingPrograms.updateTallyPrograms;
        //update quantities of existing quantity based programs
        if (orderId && currentLoyaltyDetails){
            for(i=0; i < currentLoyaltyDetails.length; i++){
                if(updateExistingLoyaltyQuantities){
                    for (j=0; j< updateExistingLoyaltyQuantities.length; j++){
                        if(currentLoyaltyDetails[i].programId == updateExistingLoyaltyQuantities[j].programId){

                        	Maestro.LoyaltyCards.Tools.UpdateExistingQuantityCards(customerId, currentLoyaltyDetails, updateExistingLoyaltyQuantities);
                        }
                    }
                }

                if(updateExistingGiftCards){
                    for (j=0; j< updateExistingGiftCards.length; j++){
                        if(currentLoyaltyDetails[i].programId == updateExistingGiftCards[j].programId){

                        	Maestro.LoyaltyCards.Tools.UpdateExistingGiftCards(customerId, currentLoyaltyDetails, updateExistingGiftCards);
                        }
                    }
                }
            }
        }
        
        currentCustomer = Customers.findOne({_id: customerId});
        currentLoyaltyDetails = currentCustomer.loyaltyPrograms;

        //pull and increment balance values if same program is being purchased with remaining amounts/qty
        if (orderId && currentLoyaltyDetails){
            for(i=0; i< buyLoyaltyDetails.length; i++){
                for(j = 0; j<currentLoyaltyDetails.length; j++){
                    if(buyLoyaltyDetails[i].programId == currentLoyaltyDetails[j].programId){
                        buyLoyaltyDetails[i].remainingQuantity += currentLoyaltyDetails[j].remainingQuantity;
                        buyLoyaltyDetails[i].remainingAmount += currentLoyaltyDetails[j].remainingAmount;

                        _pullCustomerLoyalty(customerId, currentLoyaltyDetails[j]);

                        // console.log('pulled: ', currentLoyaltyDetails[j]);
                    }
                }
            }
        }

        //update with newly purchased loyalty programs
        if (orderId && customerId && buyLoyaltyDetails){
            for (i = 0; i < buyLoyaltyDetails.length; i++){
                // console.log('added: ', buyLoyaltyDetails[i]);
                _addToSetCustomerLoyalty(customerId, buyLoyaltyDetails[i]);
            }
        }

        //pull any expired/depleted programs
        Maestro.LoyaltyCards.CheckCustomerProgramExpiry(customerId);

        //update tally programs
        // currentCustomer = Customers.findOne({_id: customerId});

        if(orderId && updateTallyPrograms ){
            // Customers.update({_id: currentCustomer._id}, {$set: {'tallyPrograms': updateTallyPrograms}});
            Customers.update({_id: customerId}, {$set: {'tallyPrograms': updateTallyPrograms}});
        }
    }
};

//pull any expired/depleted programs

// currentCustomer = Customers.findOne({_id: customerId});
// currentLoyaltyDetails = currentCustomer.loyaltyPrograms;
// var genericProgram;

// if (orderId && currentLoyaltyDetails){
//     for(i=0; i<currentLoyaltyDetails.length; i++){
//         genericProgram = LoyaltyPrograms.findOne({_id: currentLoyaltyDetails[i].programId});
//         if(genericProgram.programType.type == "Quantity" && currentLoyaltyDetails[i].remainingQuantity <= 0){

//         	Maestro.LoyaltyCards.Tools.UpdateExpiryStatus (customerId, currentLoyaltyDetails);
//         }

//         // if Amount
//         if(genericProgram.programType.type == "Amount" && currentLoyaltyDetails[i].remainingAmount <= 0){

//         	Maestro.LoyaltyCards.Tools.UpdateExpiryStatus (customerId, currentLoyaltyDetails);
//         }

//         // if expired (days or date) should be removed at the beginning of the order process not at the end.
//     }
// }