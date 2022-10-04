Maestro.LoyaltyCards = {};

Maestro.LoyaltyCards.BuyCard = function(customerId, program){
	let existingCard = LoyaltyCards.findOne({customerId: customerId, programId: program.programId});
	if(!!existingCard){
		LoyaltyCards.update({_id: existingCard._id}, {$set: 
			{
			    remainingQuantity: existingCard.remainingQuantity + program.remainingQuantity,
			    remainingAmount: existingCard.remainingAmount + program.remainingAmount,
			    creditPercent: program.creditPercent,
			    boughtOn: program.boughtOn,
			    expired: program.expired,
                updatedOn: new Date()
			}
		});
		// console.log('updated');
	} else {
		LoyaltyCards.insert({
			businessId: Maestro.Business.getBusinessId(),
		    customerId: customerId,
            programType: Maestro.Loyalty.GetProgramType(program.programId),
		    programId: program.programId,
		    remainingQuantity: program.remainingQuantity,
		    remainingAmount: program.remainingAmount,
		    creditPercent: program.creditPercent,
		    boughtOn: program.boughtOn,
            updatedOn: program.boughtOn,
		    expired: program.expired,
		});
		// console.log('inserted');
	}
};

Maestro.LoyaltyCards.UpdateTallyPrograms = function(customerId, updateTallyPrograms){
    if(customerId && updateTallyPrograms){
        _.each(updateTallyPrograms, function(tallyProgram){
            Maestro.LoyaltyCards.UpdateTally(customerId, tallyProgram);
        });
    }

};

Maestro.LoyaltyCards.UpdateTally = function(customerId, program){
    let existingCard = LoyaltyCards.findOne({customerId: customerId, programId: program.programId});
    if(!!existingCard){
        LoyaltyCards.update({_id: existingCard._id}, {$set: 
            {
                tally: program.tally,
                updatedOn: new Date(),
            }
        });
        // console.log('updated');
    } else {
        LoyaltyCards.insert({
            businessId: Maestro.Business.getBusinessId(),
            customerId: customerId,
            programType: Maestro.Loyalty.GetProgramType(program.programId),
            programId: program.programId,
            tally: program.tally,
            boughtOn: new Date(),
            updatedOn: new Date(),
        });
        // console.log('inserted');
    }
};

Maestro.LoyaltyCards.UpdateCardAttr = function(cardId, updateAttr){
	LoyaltyCards.update({_id: cardId}, {$set: updateAttr});
};

Maestro.LoyaltyCards.RemoveCard = function(cardId = null, customerId, programId){
	if(!!cardId){
		LoyaltyCards.remove({_id: cardId});
	} else {
        let card = Maestro.LoyaltyCards.getCard(cardId, customerId, programId);
		LoyaltyCards.remove({_id: card._id});
	}
};

Maestro.LoyaltyCards.ExpireCard = function(cardId = null, customerId, programId){
	if(!!cardId){
		LoyaltyCards.update({_id: cardId}, {$set: {expired: true}});
	} else {
        let card = Maestro.LoyaltyCards.getCard(cardId, customerId, programId);
		LoyaltyCards.update({_id: card._id}, {$set: {expired: true}});
	}
};

Maestro.LoyaltyCards.ReactivateCard = function(cardId = null, customerId, programId){
	if(!!cardId){
		LoyaltyCards.update({_id: cardId}, {$set: {expired: false}});
	} else {
        let card = Maestro.LoyaltyCards.getCard(cardId, customerId, programId);
		LoyaltyCards.update({_id: card._id}, {$set: {expired: false}});
	}
};

Maestro.LoyaltyCards.UpdateCardBalance = function(card, updateBalance, expired){
	let loyaltyProgram = LoyaltyPrograms.findOne({_id: card.programId});

    if(loyaltyProgram.programType.type == "Quantity"){
        Maestro.LoyaltyCards.UpdateQuantityCardBalance(card._id, updateBalance);
    } else if(loyaltyProgram.programType.type == "Amount"){
        Maestro.LoyaltyCards.UpdateGiftCardBalance(card._id, updateBalance);
    } else if(loyaltyProgram.programType.type == "Tally"){
        Maestro.LoyaltyCards.UpdateTallyBalance(card._id, updateBalance);
    }

    if(expired === false){
        Maestro.LoyaltyCards.ReactivateCard(card._id);
    } else if (expired === true){
        Maestro.LoyaltyCards.ExpireCard(card._id);
    }

    // Materialize.toast("Updated", 1000, 'green');

};

Maestro.LoyaltyCards.UpdateQuantityCardBalance = function(cardId, quantityBalance){
    let updateAttr = {
        remainingQuantity: quantityBalance,
    };
    Maestro.LoyaltyCards.UpdateCardAttr(cardId, updateAttr);
};

Maestro.LoyaltyCards.UpdateGiftCardBalance = function(cardId, amountBalance){
    let updateAttr = {
        remainingAmount: amountBalance,
    };
    Maestro.LoyaltyCards.UpdateCardAttr(cardId, updateAttr);
};

Maestro.LoyaltyCards.UpdateTallyBalance = function(cardId, tallyBalance){
    let updateAttr = {
        tally: tallyBalance,
    };
    Maestro.LoyaltyCards.UpdateCardAttr(cardId, updateAttr);
};

Maestro.LoyaltyCards.getCustomerActiveCards = function(customerId){
	return LoyaltyCards.find({customerId: customerId, expired: {$ne: true}, programType: {$ne: 'Tally'}}).fetch();
};

Maestro.LoyaltyCards.getCustomerExpiredCards = function(customerId){
	return LoyaltyCards.find({customerId: customerId, expired: true, programType: {$ne: 'Tally'}}).fetch();
};

Maestro.LoyaltyCards.getAllCustomerCards = function(customerId){
	return LoyaltyCards.find({customerId: customerId, programType: {$ne: 'Tally'}}).fetch();
};

Maestro.LoyaltyCards.getCard = function(cardId = null, customerId, programId){
    if(!!cardId){
        return LoyaltyCards.findOne({_id: cardId});
    } else {
        // console.log(LoyaltyCards.findOne({customerId: customerId, programId: programId}));
        return LoyaltyCards.findOne({customerId: customerId, programId: programId});
    }
};

////Tally Cards
Maestro.LoyaltyCards.getActiveTallyCards = function(customerId){
    return LoyaltyCards.find({customerId: customerId, expired: {$ne: true}, programType: 'Tally'}).fetch();
};

Maestro.LoyaltyCards.getExpiredTallyCards = function(customerId){
    return LoyaltyCards.find({customerId: customerId, expired: true, programType: 'Tally'}).fetch();
};

Maestro.LoyaltyCards.getAllTallyCards = function(customerId){
    return LoyaltyCards.find({customerId: customerId, programType: 'Tally'}).fetch();
};
////

Maestro.LoyaltyCards.CheckCustomerProgramExpiry= function(customerId){
    var customerLoyaltyPrograms = Maestro.LoyaltyCards.getCustomerActiveCards(customerId);

    var _isProgramQuantityBased = function(program){
        if (program.programType.type =="Quantity"){
            return true;
        } else { return false;}
    };

    var _isProgramAmountBased = function(program){
        if (program.programType.type == "Amount"){
            return true;
        } else { return false;}
    };

    if (customerLoyaltyPrograms){
        var boughtOn;
        var programId;
        _.each(customerLoyaltyPrograms, function(card){

            //** temporary appending for old programs that do not have this attribute
            card.creditPercent = card.creditPercent || 0;
            //**

            programId = card.programId;

            let purchasedOn= new Date(card.boughtOn);
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
                	Maestro.LoyaltyCards.ExpireCard(card._id, customerId, card.programId);
                }
            } else if (loyaltyProgram.expiryDate){
                if (todayDate>loyaltyProgram.expiryDate){
                	Maestro.LoyaltyCards.ExpireCard(card._id, customerId, card.programId);
                }
            }

            if(_isProgramQuantityBased(loyaltyProgram)){
                if (card.remainingQuantity <= 0){
                	Maestro.LoyaltyCards.ExpireCard(card._id, customerId, card.programId);
                    Maestro.LoyaltyCards.UpdateCardBalance(card, 0);
                }
            } else if (_isProgramAmountBased(loyaltyProgram)){
                if (card.remainingAmount <= 0.01){
                	Maestro.LoyaltyCards.ExpireCard(card._id, customerId, card.programId);
                    Maestro.LoyaltyCards.UpdateCardBalance(card, 0);
                }
            }
        });
    }
};

Maestro.LoyaltyCards.CheckoutLoyaltyCards = function(customerId, orderId, businessId, updateExistingPrograms, buyLoyaltyDetails){
    // console.log('updateExistingPrograms', updateExistingPrograms);
    if(customerId && orderId){

        let updateExistingLoyaltyQuantities = updateExistingPrograms.quantityBased;
        let updateExistingGiftCards = updateExistingPrograms.amountBased;
        let updateTallyPrograms = updateExistingPrograms.updateTallyPrograms;

        //update quantities of existing quantity based programs
        if(updateExistingLoyaltyQuantities){
        	_.each(updateExistingLoyaltyQuantities, function(quantityCard){
        		Maestro.LoyaltyCards.UpdateQuantityCardBalance(quantityCard._id, quantityCard.remainingQuantity);
        	});
        }

        if(updateExistingGiftCards){
            _.each(updateExistingGiftCards, function(amountCard){
            	Maestro.LoyaltyCards.UpdateGiftCardBalance(amountCard._id, amountCard.remainingAmount);
            });
        }

        if(buyLoyaltyDetails){
        	_.each(buyLoyaltyDetails, function(buyCard){
        		Maestro.LoyaltyCards.BuyCard(customerId, buyCard);
        	});
        }
        
        //pull any expired/depleted programs
        Maestro.LoyaltyCards.CheckCustomerProgramExpiry(customerId);

        Maestro.LoyaltyCards.UpdateTallyPrograms(customerId, updateTallyPrograms);
    }
};

Maestro.LoyaltyCards.IncrementCard = function(cardId, customerId, programId, IncrementBalance){
    let card = Maestro.LoyaltyCards.getCard(cardId, customerId, programId);
    if(card.programType == "Amount"){
        card.remainingAmount += IncrementBalance;
        Maestro.LoyaltyCards.UpdateGiftCardBalance(card._id, card.remainingAmount);
    } else if(card.programType == "Quantity"){
        card.remainingQuantity += IncrementBalance;
        Maestro.LoyaltyCards.UpdateQuantityCardBalance(card._id, card.remainingQuantity);
    }
};


Maestro.LoyaltyCards.CancelOrderLoyalty = function(orderId){
    let orderObj = Orders.findOne({_id: orderId});

    let allOrderItems = orderObj.items;

    let giftCardRedeem = orderObj.payment.giftCards || [];
    let quantityCardRedeem = orderObj.payment.quantityCards || [];
    let percentageCardRedeem = [];

    var allLoyaltyPurchaseItems = [];

    var _isLoyaltyProgramPurchase = function (programId){
        if(LoyaltyPrograms.findOne({_id: programId})){
            return true;
        } else {return false;}
    };

    let customerId = orderObj.customerId;

    if(!!customerId){
        //preparing for any take back of purchased loyalty programs
        _.each(allOrderItems, function(item){
            if (_isLoyaltyProgramPurchase(item.product._id)){
                let programId = item.product._id;
                let loyaltyProgramObj = LoyaltyPrograms.findOne({_id: programId});
                if(Maestro.Loyalty.IsProgramQuantityBased(programId)){
                    quantityCardRedeem.push({
                        programId: loyaltyProgramObj._id,
                        redeemedQuantity: -loyaltyProgramObj.programType.quantity*item.quantity
                    });
                } else if (Maestro.Loyalty.IsProgramAmountBased(programId)){
                    giftCardRedeem.push({
                        programId: loyaltyProgramObj._id,
                        redeemedAmount: -loyaltyProgramObj.programType.creditAmount*item.quantity
                    });
                } else if (Maestro.Loyalty.IsProgramPercentageBased(programId)){
                    percentageCardRedeem.push({
                        programId: loyaltyProgramObj._id
                    });
                }
            }
        });

        _.each(giftCardRedeem, function(giftCard){
            Maestro.LoyaltyCards.IncrementCard(giftCard.cardId, customerId, giftCard.programId, giftCard.redeemedAmount);
            Maestro.LoyaltyCards.ReactivateCard(giftCard.cardId, customerId, giftCard.programId);
        });

        _.each(quantityCardRedeem, function(quantityCard){
            Maestro.LoyaltyCards.IncrementCard(quantityCard.cardId, customerId, quantityCard.programId, quantityCard.redeemedQuantity);
            Maestro.LoyaltyCards.ReactivateCard(quantityCard.cardId, customerId, quantityCard.programId);
        });

        _.each(percentageCardRedeem, function(percentageCard){
            Maestro.LoyaltyCards.ExpireCard(percentageCard.cardId, customerId, percentageCard.programId);
        });
    }

    Maestro.LoyaltyCards.CheckCustomerProgramExpiry(customerId);

};

//loyaltyProgram
Maestro.LoyaltyCards.getProgramActiveCards = function(programId){
    let sort = {sort: {updatedOn: -1}};
    return LoyaltyCards.find({programId: programId, expired: {$ne: true}}, sort).fetch();
};

Maestro.LoyaltyCards.getProgramExpiredCards = function(programId){
    let sort = {sort: {updatedOn: -1}};
    return LoyaltyCards.find({programId: programId, expired: true}, sort).fetch();
};

Maestro.LoyaltyCards.getAllProgramCards = function(programId){
    let sort = {sort: {updatedOn: -1}};
    return LoyaltyCards.find({programId: programId}, sort).fetch();
};

///
Maestro.LoyaltyCards.Summary = {};

Maestro.LoyaltyCards.Summary.GetAllLoyaltyAndTallyCards = function(){
    let sort = {sort: {boughtOn: -1}};
    return LoyaltyCards.find({}, sort).fetch();
};