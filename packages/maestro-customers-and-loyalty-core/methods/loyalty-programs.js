let _pullCustomerLoyalty = function(customerId, program){
    var pulled;
    try {
        pulled = Customers.update(customerId, {$pull: {loyaltyPrograms: program}});
        console.log("pulled: " + pulled);
    } catch (e){
        console.log("error pulling: " + e);
    }
};

let _addToSetCustomerLoyalty = function(customerId, program){
    var added;
    try {
        added = Customers.update(customerId, {$addToSet: {loyaltyPrograms: program}});
        console.log("added: " + added);
    } catch(e){
        console.log("Error adding: " + e);
    }
};

Meteor.methods({
    createNewLoyaltyProgram: function (newLoyaltyProgram) {
        check(newLoyaltyProgram, Maestro.Schemas.LoyaltyProgram);

        var programId;

        try {
            programId = LoyaltyPrograms.insert(newLoyaltyProgram);
        } catch (e) {
            console.log("Error creating program: " + e);
        }

        if(newLoyaltyProgram.programType.type == 'Tally'){
            if(!!programId){
                let customersObj = Customers.find({businessId: newLoyaltyProgram.businessId}).fetch();

                _.each(customersObj, function(customer){
                    let tallyPrograms = customer.tallyPrograms || [];
                    tallyPrograms.push(
                            {
                                programId: programId,
                                tally: 0
                            }
                        );
                    Customers.update(customer._id, {$set: {'tallyPrograms': tallyPrograms}});
                });
            }
        }

    },

    editLoyaltyProgram: function (programId, loyaltyEditDetails) {
        var programsUpdated;

        try {
            programsUpdated = LoyaltyPrograms.update({_id: programId}, {$set: loyaltyEditDetails});
        } catch (e) {
            console.log("Error updating program: " + e)
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
// }
});