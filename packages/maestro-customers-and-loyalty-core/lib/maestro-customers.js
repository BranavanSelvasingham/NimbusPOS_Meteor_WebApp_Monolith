Maestro.Customers = {};

Maestro.Customers.Tools = {};

Maestro.Customers.Tools.FormatPhoneNumber = function(unformattedPhone){
    let formattedPhone = "";

    for (i=0; i < unformattedPhone.length; i++){
        if (unformattedPhone[i] > -1){
            formattedPhone += unformattedPhone[i];
        }
    }

    return Number(formattedPhone);
};


Maestro.Customers.CustomerNameExists = function (customerName, baseCustomerId = null) {
    var customers = Customers.find({_id: {$ne: baseCustomerId}, name: customerName});
    if(customers.count() > 0){return true;}
    return false;
};

Maestro.Customers.CustomerEmailExists= function (customerEmail, baseCustomerId = null) {
    var customers = Customers.find({_id: {$ne: baseCustomerId}, email: customerEmail});
    if(customers.count() > 0){return true;}
    return false;
};

Maestro.Customers.CustomerPhoneExists= function (customerPhone, baseCustomerId) {
    var customers = Customers.find({phone: customerPhone});
    if(customers.count() > 0){return true;}
    return false;
};

Maestro.Customers.FindCustomerByEmail = function(email){
    return Customers.findOne({email: email});
};

Maestro.Customers.FindCustomerByEmail = function(name){
    return Customers.findOne({name: name});
};

Maestro.Customers.SubmitCustomerCreateInfo = function(name, email, unformattedPhone){
    customerName = Maestro.UtilityMethods.ConvertStringCaps(name);

    if(!name) { 
        Materialize.toast('Enter customer name', 2000, 'rounded red');
        return ;
    }

    if(Maestro.Customers.CustomerEmailExists(email)){
        Materialize.toast('Email already exists in system', 2000, 'rounded red');
        return ;
    }

    if(Maestro.Customers.CustomerNameExists(customerName) && !email){
        Materialize.toast('Identical Customer Name Exists. Ask for Email.', 2000, 'rounded red');
        return ;
    }

    let businessId = Maestro.Business.getBusinessId();

    let customerInfo = {
        name: customerName,
        email: email,
        businessId: businessId
    };

    let formattedPhone = Maestro.Customers.Tools.FormatPhoneNumber(unformattedPhone);

    if(formattedPhone > 0){
        customerInfo.phone = formattedPhone;
    }

    return Maestro.Customers.CreateCustomer(customerInfo);
};

Maestro.Customers.CreateCustomer = function (customerInfo) {
    check(customerInfo, Maestro.Schemas.Customer);

    try {
        customerId = Customers.insert(customerInfo);
    } catch (e) {
        console.log("Error creating customer: ", e);
    }

    return customerId;
};

Maestro.Customers.SubmitCustomerEditInfo = function(customerId, name, email, unformattedPhone){
    customerName = Maestro.UtilityMethods.ConvertStringCaps(name);

    if(!name) { 
        Materialize.toast('Enter customer name', 2000, 'rounded red');
        return ;
    }

    if(Maestro.Customers.CustomerEmailExists(email, customerId)){        
        Materialize.toast('Email already exists in system', 2000, 'rounded red');
        return ;
    }

    if(Maestro.Customers.CustomerNameExists(customerName, customerId) && !email){
        Materialize.toast('Identical Customer Name Exists. Ask for Email.', 2000, 'rounded red');
        return ;
    }

    let businessId = Maestro.Business.getBusinessId();

    let customerInfo = {
        name: customerName,
        email: email,
        businessId: businessId
    };

    let formattedPhone = Maestro.Customers.Tools.FormatPhoneNumber(unformattedPhone);

    if(formattedPhone > 0){
        customerInfo.phone = formattedPhone;
    }

    return Maestro.Customers.EditCustomer(customerId, customerInfo);

};

Maestro.Customers.AddProgramToCustomer = function(customerId, program){
    Maestro.LoyaltyCards.AddProgramToCustomer(customerId, program); 
};

Maestro.Customers.EditCustomer = function (customerId, customerDetails) {
    return Customers.update(customerId, {$set: customerDetails});
};

Maestro.Customers.DeleteCustomer = function (customerId) {
    var updates;
    try {
        updates = Customers.remove(customerId);
        console.log('removed: ', updates);
    } catch (e) {
        console.log('error: ', e);
    }
};

Maestro.Customers.SearchCustomerNames = function (searchTerm, showAll, optimize) {
    var searchSplit = searchTerm.split(":");
    let businessId = Maestro.Business.getBusinessId();

    let fieldsOptimize = {};

    if(optimize){
        fieldsOptimize.name = 1;
    }

    if (searchTerm == "" || !searchTerm) {
        if(showAll){
            return Customers.find({businessId: businessId}, {sort: {name: 1}, fields: fieldsOptimize}).fetch();
        }
        return[];
    } else if (searchSplit.length > 1 && searchSplit[0] == "Alphabet") {
        var allCustomers = Customers.find({businessId: businessId}, {sort: {name: 1}, fields: fieldsOptimize}).fetch();
        
        return _.filter(allCustomers, function (customer) {
            return (customer.name[0] == searchSplit[1]) || (customer.name[0] == searchSplit[1].toLowerCase())
        });
    } else {
        // return Maestro.UtilityMethods.RegExSearch(searchTerm, Customers, this.userId);

        let filterCriteria = {
            businessId: businessId,
            name: {
                $regex: searchTerm,
                $options: 'i'
            }
        };

        return Customers.find(filterCriteria, {sort: {name: 1}, fields: fieldsOptimize}).fetch();
    }
};

Maestro.Customers.SearchCustomerMatch = function (matchField, matchTerm, showAll = false, optimize = false) {
    let fieldsOptimize = {};

    let totalCustomers = Customers.find().count();
    if(totalCustomers > 100 && (matchTerm == "" || String(matchTerm).length < 3)){
        return [];
    } 

    if(optimize){
        fieldsOptimize.name = 1;
    }

    if(showAll == true){
        return Customers.find({}, {sort: {name: 1}, fields: fieldsOptimize}).fetch();
    }

    let matchObject = {};

    if(matchField == "email" || matchField == "name"){
        matchObject[matchField] = {
            $regex: matchTerm, 
            $options: 'i'
        };
    } else {
        matchObject[matchField] = matchTerm;
    }
 
    if(!!matchTerm){
        return Customers.find(matchObject, {sort: {name: 1}, fields: fieldsOptimize}).fetch();
    }

    return [];
};

Maestro.Customers.UpdateExistingPrograms = function(template, updateProgram, updateBalance, expired){
    Maestro.LoyaltyCards.UpdateExistingPrograms(template, updateProgram, updateBalance, expired);
};

Maestro.Customers.GetName = function(customerId){
    return Customers.findOne({_id: customerId}).name;
};

Maestro.Customers.UpdateCustomerNotes = function(customerId, notes){
    Customers.update({_id: customerId}, {$set: {notes: notes}});
};