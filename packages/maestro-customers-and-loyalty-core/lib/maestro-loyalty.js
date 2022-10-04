Maestro.Loyalty = {};

Maestro.Loyalty.GetLoyaltyPrograms = function(filter = {}, sort = {}){
    return LoyaltyPrograms.find(filter, sort).fetch();
};

Maestro.Loyalty.GetQuantityBasedLoyaltyPrograms = function(){
    let filter = {'programType.type': 'Quantity'};
    let sort = {sort: {name: 1}};
    return Maestro.Loyalty.GetLoyaltyPrograms(filter, sort);
};

Maestro.Loyalty.GetAmountBasedLoyaltyPrograms = function(){
    let filter = {'programType.type': 'Amount'};
    let sort = {sort: {name: 1}};
    return Maestro.Loyalty.GetLoyaltyPrograms(filter, sort);
};

Maestro.Loyalty.GetPercentageBasedLoyaltyPrograms = function(){
    let filter = {'programType.type': 'Percentage'};
    let sort = {sort: {name: 1}};
    return Maestro.Loyalty.GetLoyaltyPrograms(filter, sort);
};

Maestro.Loyalty.GetTallyBasedLoyaltyPrograms = function(){
    let filter = {'programType.type': 'Tally'};
    let sort = {sort: {name: 1}};
    return Maestro.Loyalty.GetLoyaltyPrograms(filter, sort);
};

Maestro.Loyalty.GetActiveLoyaltyPrograms = function(){ //non-tally programs
    return Maestro.Loyalty.GetLoyaltyPrograms({'status': 'Active'});
};

Maestro.Loyalty.GetActiveTallyPrograms = function(){
    return LoyaltyPrograms.find({'programType.type': 'Tally', 'status': 'Active'}).fetch();
};

Maestro.Loyalty.CreateNewLoyaltyProgram = function (newLoyaltyProgram) {
    check(newLoyaltyProgram, Maestro.Schemas.LoyaltyProgram);

    var programId;

    try {
        programId = LoyaltyPrograms.insert(newLoyaltyProgram);
    } catch (e) {
        console.log("Error creating program: " + e);
    }

    if(newLoyaltyProgram.programType.type == 'Tally'){
        if(!!programId){
            let customersObj = Customers.find({}).fetch();

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

};

Maestro.Loyalty.EditLoyaltyProgram = function (programId, loyaltyEditDetails) {
    var programsUpdated;

    try {
        programsUpdated = LoyaltyPrograms.update(programId, {$set: loyaltyEditDetails});
    } catch (e) {
        console.log("Error creating program: " + e)
    }
};

Maestro.Loyalty.GetProgramType = function(programId){
    return LoyaltyPrograms.findOne({_id: programId}).programType.type;
};

Maestro.Loyalty.GetProgramName = function(programId){
    return LoyaltyPrograms.findOne({_id: programId}).name;
};

Maestro.Loyalty.IsProgramQuantityBased = function(programId){
    if(Maestro.Loyalty.GetProgramType(programId) == "Quantity"){
        return true;
    }
    return false;
};

Maestro.Loyalty.IsProgramAmountBased = function(programId){
    if(Maestro.Loyalty.GetProgramType(programId) == "Amount"){
        return true;
    }
    return false;
};

Maestro.Loyalty.IsProgramPercentageBased = function(programId){
    if(Maestro.Loyalty.GetProgramType(programId) == "Percentage"){
        return true;
    }
    return false;
};

Maestro.Loyalty.DeactivateProgram = function(programId){

    LoyaltyPrograms.update({_id: programId}, {$set: {'name': 'testing'}});
};

Maestro.Loyalty.ActivateProgram = function(programId){
    LoyaltyPrograms.update({_id: programId}, {$set: {status: 'Active'}});
};
