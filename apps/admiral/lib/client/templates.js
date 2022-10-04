BlazeLayout.setRoot('body');

Template.registerHelper("locations", function() {
    return Locations.find({});
});

Template.registerHelper("currency", function(number) {
    let amount = Number(number);

    check(amount, Number);

    return "$ " + Maestro.Numbers.Accounting.toFixed(amount, 2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
});

Template.registerHelper("sizeName", function (sizeCode) {
    return Maestro.Client.getProductSizeName(sizeCode);
});

Template.registerHelper("negate", function (value) {
    return !value;
});

Template.registerHelper("colorTextClass", function (color) {
    return "flat-color-text-" + color;
});

Template.registerHelper("cashRoundedAmount", Maestro.Payment.CashRounding);

Template.registerHelper("isPos", function() {
    return Maestro.Client.isCordova;
});

Template.registerHelper("isDesktop", function() {
    return !Maestro.Client.isCordova;
});

Template.registerHelper("isUserLoggedIn", function(){
	return !!Meteor.userId();
});

Template.registerHelper("waitForDeviceApproval", function(){
    let businessId = Maestro.Business.getBusinessId();
    let localAppId = UserSession.get(Maestro.UserSessionConstants.LOCAL_APP_ID);
    let business = Businesses.findOne({_id: businessId});

    let currentAppObj = {appId: localAppId};

    if (!!business && !!localAppId){
        if(business.devices){
            let allAppIds = _.pluck(business.devices, 'appId');
            let containsIndex = _.indexOf(allAppIds, localAppId);
            if (containsIndex > -1){
                if(business.devices[containsIndex].posEnabled == true){
                    Maestro.Client.goToUserHome();
                    console.log('allowing entry to home screen');
                }
            }
        }
    } 
});

Template.registerHelper("waitForSessionStart", function(){
    let businessId = Maestro.Business.getBusinessId();
    let business = Businesses.findOne({_id: businessId});

    if (!!business){
        UserSession.set(Maestro.UserSessionConstants.BUSINESS_NAME, business.name);
        // window.setTimeout(function(){Maestro.Client.goToUserHome();}, 1000);
    } 
    // else {
    // 	Maestro.Client.goToUserHome();
    // }
    
    window.setTimeout(function(){Maestro.Client.goToUserHome();}, 1000);
});



// Template.registerHelper("colorBackgroundClass", function (color) {
//     return "flat-color-" + color;
// });

// Template.registerHelper("colorBackgroundClass", function (colorCode) {
// 	let allowedColors = Maestro.Products.Categories.Colors;
// 	if (_.find(allowedColors, function(color){return color.key == colorCode;})){
//     	return "background-color:#" + colorCode;
//     }
//     return "background-color:#bdbdbd";
// });

// Template.registerHelper("getCategoryColor", function(categoryName){
// 	let category = ProductCategories.findOne({name: categoryName});
// 	if(category){
// 		let allowedColors = Maestro.Products.Categories.Colors;
// 		if (_.find(allowedColors, function(color){return color.key == category.color;})){
// 			return "background-color:#" + category.color;
// 		} 
// 	}
// 	return "background-color:#bdbdbd";
// });

// Template.registerHelper("getProductBackgroundColor", function(product){
// 	if (product){
// 		if (product.categories){
// 			let primaryCategory = product.categories[0];
// 			let category = ProductCategories.findOne({name: primaryCategory});
// 			if(category){
// 				let allowedColors = Maestro.Products.Categories.Colors;
// 				if (_.find(allowedColors, function(color){return color.key == category.color;})){
// 					return "background-color:#" + category.color;
// 				} 
// 			}
// 		}
// 	}
// 	return null;
// });

// Template.registerHelper("getProductTextColor", function(product){
// 	if (product){
// 		if (product.categories){
// 			let primaryCategory = product.categories[0];
// 			let category = ProductCategories.findOne({name: primaryCategory});
// 			if(category){
// 				let allowedColors = Maestro.Products.Categories.Colors;
// 				if (_.find(allowedColors, function(color){return color.key == category.color;})){
// 					return "color:#" + category.color;
// 				} 
// 			}
// 		}
// 	}
// 	return null;
// });

// Template.registerHelper("getTileBackgroundColor", function(product){
// 	if (product){
// 		if (product.categories){
// 			let primaryCategory = product.categories[0];
// 			let category = ProductCategories.findOne({name: primaryCategory});
// 			if(category){
// 				let allowedColors = Maestro.Products.Categories.Colors;
// 				if (_.find(allowedColors, function(color){return color.key == category.color;})){
// 					return "background-color:#" + category.color;
// 				} 
// 			}
// 		}
// 	}
// 	return "background-color:#bdbdbd";
// });



// Template.registerHelper("getProductsAndGroups", function() {
// 	return Maestro.Client.getProductsAndGroups();
// });

// Template.registerHelper("getProductsInGroup", function(groupName){
// 	return Maestro.Client.getProductsInGroup(groupName);
// });

// Template.registerHelper("getProductOrGroup", function(itemId){
// 	return Maestro.Client.getProductOrGroup(itemId);
// });

// Template.registerHelper("isThisAGroupItem", function(groupFlag){
//     if (groupFlag === true){
//         return true;
//     } else {
//         return false;
//     }
// });