Maestro.LoyaltyCards.Migrations = {};

Maestro.LoyaltyCards.Migrations.migrateBusiness = function(businessId){
	let allCustomers = Customers.find().fetch();
	
	// _.each(LoyaltyCards.find({}).fetch(), function(card){
	// 	LoyaltyCards.remove({_id: card._id});
	// 	console.log('removed');
	// });

	_.each(allCustomers, function(customer){
		_.each(customer.loyaltyPrograms || [], function(program){
			let existingCard = LoyaltyCards.findOne({businessId: businessId, programId: program.programId, customerId: customer._id});
			if(!!existingCard){
				LoyaltyCards.update({_id: existingCard._id}, {$set: 
					{
						businessId: businessId,
					    customerId: customer._id,
					    programId: program.programId,
					    programType: Maestro.Loyalty.GetProgramType(program.programId),
					    remainingQuantity: program.remainingQuantity,
					    remainingAmount: program.remainingAmount,
					    creditPercent: program.creditPercent,
					    boughtOn: program.boughtOn,
					    expired: program.expired,
					}
				});
				console.log('updated');
			} else {
				LoyaltyCards.insert({
					businessId: businessId,
				    customerId: customer._id,
				    programId: program.programId,
				    programType: Maestro.Loyalty.GetProgramType(program.programId),
				    remainingQuantity: program.remainingQuantity,
				    remainingAmount: program.remainingAmount,
				    creditPercent: program.creditPercent,
				    boughtOn: program.boughtOn,
				    expired: program.expired,
				});
				console.log('inserted');
			}
		});

		// _.each(customer.tallyPrograms || [], function(program){
		// 	let existingCard = LoyaltyCards.findOne({businessId: businessId, programId: program.programId, customerId: customer._id});
		// 	if(!!existingCard){
		// 		LoyaltyCards.update({_id: existingCard._id}, {$set: 
		// 			{
		// 				businessId: businessId,
		// 			    customerId: customer._id,
		// 			    programId: program.programId,
		// 			    programType: Maestro.Loyalty.GetProgramType(program.programId),
		// 			    tally: program.tally,
		// 	            boughtOn: new Date(),
		// 	            updatedOn: new Date(),
		// 			}
		// 		});
		// 		console.log('updated');
		// 	} else {
		// 		LoyaltyCards.insert({
		// 			businessId: businessId,
		// 		    customerId: customer._id,
		// 		    programId: program.programId,
		// 		    programType: Maestro.Loyalty.GetProgramType(program.programId),
		// 		   	tally: program.tally,
		//             boughtOn: new Date(),
		//             updatedOn: new Date(),
		// 		});
		// 		console.log('inserted');
		// 	}
		// });
	});
};