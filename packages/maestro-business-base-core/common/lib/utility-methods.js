Maestro.UtilityMethods.RegExSearch = function (searchTerm, collection, userId) {
    // let user = Meteor.users.findOne({_id: userId});
    // let businessId = user.profile.businessId;
    let businessId = Maestro.Business.getBusinessId();

    let filterCriteria = {
        businessId: businessId,
        name: {
            $regex: searchTerm,
            $options: 'i'
        }
    };

    return collection.find(filterCriteria, {sort: {name: 1}}).fetch();
};

Maestro.UtilityMethods.ConvertStringCaps = function(convertString){
    let splitNames = convertString.split(" ");

    for (i=0; i< splitNames.length; i++){
        splitNames[i] = splitNames[i].substr(0,1).toUpperCase() + splitNames[i].substr(1);
    }

    return splitNames.join(" ");
};