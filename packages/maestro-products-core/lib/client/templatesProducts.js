Template.registerHelper("colorBackgroundClass", function (colorCode) {
	let allowedColors = Maestro.Products.Categories.Colors;
	if (_.find(allowedColors, function(color){return color.key == colorCode;})){
    	return "background-color:#" + colorCode;
    }
    return "background-color:#bdbdbd";
});

Template.registerHelper("getCategoryColor", function(categoryName){
	let category = ProductCategories.findOne({name: categoryName});
	if(category){
		let allowedColors = Maestro.Products.Categories.Colors;
		if (_.find(allowedColors, function(color){return color.key == category.color;})){
			return "background-color:#" + category.color;
		} 
	}
	return "background-color:#bdbdbd";
});

Template.registerHelper("getProductBackgroundColor", function(product){
	if (product){
		if (product.categories){
			let primaryCategory = product.categories[0];
			let category = ProductCategories.findOne({name: primaryCategory});
			if(category){
				let allowedColors = Maestro.Products.Categories.Colors;
				if (_.find(allowedColors, function(color){return color.key == category.color;})){
					return "background-color:#" + category.color;
				} 
			}
		}
	}
	return null;
});

Template.registerHelper("getProductTextColor", function(product){
	if (product){
		if (product.categories){
			let primaryCategory = product.categories[0];
			let category = ProductCategories.findOne({name: primaryCategory});
			if(category){
				let allowedColors = Maestro.Products.Categories.Colors;
				if (_.find(allowedColors, function(color){return color.key == category.color;})){
					return "color:#" + category.color;
				} 
			}
		}
	}
	return null;
});

Template.registerHelper("getTileBackgroundColor", function(product){
	if (product){
		if (product.categories){
			let primaryCategory = product.categories[0];
			let category = ProductCategories.findOne({name: primaryCategory});
			if(category){
				let allowedColors = Maestro.Products.Categories.Colors;
				if (_.find(allowedColors, function(color){return color.key == category.color;})){
					return "background-color:#" + category.color;
				} 
			}
		}
	}
	return "background-color:#bdbdbd";
});

Template.registerHelper("getSizeTileBackgroundColor", function(productId){
	product = Products.findOne({_id: productId});
	if (product){
		if (product.categories){
			let primaryCategory = product.categories[0];
			let category = ProductCategories.findOne({name: primaryCategory});
			if(category){
				let allowedColors = Maestro.Products.Categories.Colors;
				if (_.find(allowedColors, function(color){return color.key == category.color;})){
					return "background-color:#" + category.color;
				} 
			}
		}
	}
	return "background-color:#bdbdbd";
});

Template.registerHelper("getProductsAndGroups", function() {
	return Maestro.Client.getProductsAndGroups();
});

Template.registerHelper("getProductsInGroup", function(groupName){
	return Maestro.Client.getProductsInGroup(groupName);
});

Template.registerHelper("getProductOrGroup", function(itemId){
	return Maestro.Client.getProductOrGroup(itemId);
});

Template.registerHelper("isThisAGroupItem", function(groupFlag){
    if (groupFlag === true){
        return true;
    } else {
        return false;
    }
});