Maestro.Atlas.Tally = {};
Maestro.Atlas.Tally.Daily = {};
Maestro.Atlas.Tally.StartToEndDate= {};

Maestro.Atlas.Tally.GetOrders = function(tallyDate, endDate){
	var currentDate = new Date(tallyDate);
	var nextDay;

	if(!!endDate){
		nextDay = new Date(endDate);
	} else {
		nextDay = new Date(currentDate);
		nextDay.setDate(currentDate.getDate()+1);
	}

	var ordersObj = Orders.find({
		locationId: Maestro.Business.getLocationId(),
		status: "Completed",
		createdAt : {$gt: currentDate, $lt: nextDay}
	}).fetch();

	return ordersObj;
};

var roundToTwoDecimals = function(number){
    return Math.round(number*100)/100;
};

var GiftCardRedemptions = function(orderSet){
	if(!!orderSet){
		let totalRedemptions_Cash = _.reduce(orderSet, function(memo, order){
			if(order.payment.method == "cash"){
				let redeemCash = _.reduce(order.payment.giftCards, function(memo, card){
					return memo + card.redeemedAmount;
				}, 0);
				return memo + redeemCash;
			} else {
				return memo + 0.00;
			}
			
		}, 0);
		
		let totalRedemptions_Card = _.reduce(orderSet, function(memo, order){
			if(order.payment.method == "card"){
				let redeemCard = _.reduce(order.payment.giftCards, function(memo, card){
					return memo + card.redeemedAmount;
				}, 0);
				return memo + redeemCard;
			} else {
				return memo + 0.00;
			}
			
		}, 0);

		let countRedemptions = _.reduce(orderSet, function(memo, order){
			if (order.payment.giftCards){
				if(order.payment.giftCards.length>0){
					return memo + 1;
				} 
			}
			return memo + 0;
		}, 0);

		return {
			total: roundToTwoDecimals(totalRedemptions_Cash + totalRedemptions_Card), 
			cash: roundToTwoDecimals(totalRedemptions_Cash), 
			card: roundToTwoDecimals(totalRedemptions_Card), 
			count: countRedemptions
		};
	}
};

var TipsGiven = function(orderSet){
	if(!!orderSet){
		let totalTips_Cash = _.reduce(orderSet, function(memo, order){
			if(order.payment.method == "cash"){
				return memo + order.payment.tips;
			} else {
				return memo + 0.00;
			}
			
		}, 0);
		
		let totalTips_Card = _.reduce(orderSet, function(memo, order){
			if(order.payment.method == "card"){
				return memo + order.payment.tips;
			} else {
				return memo + 0.00;
			}
			
		}, 0);

		return {
			total: roundToTwoDecimals(totalTips_Cash + totalTips_Card), 
			cash: roundToTwoDecimals(totalTips_Cash), 
			card: roundToTwoDecimals(totalTips_Card), 
		};
	}
};

Maestro.Atlas.Tally.TotalOrderSales = function(tallyDate, endDate){
	let ordersToday = Maestro.Atlas.Tally.GetOrders(tallyDate, endDate);

	let giftCardRedemptions = GiftCardRedemptions(ordersToday);

	if(!!ordersToday){
		let totalSales = _.reduce(ordersToday, function(memo, order){
			return memo + order.subtotals.total;
		}, 0);
		return totalSales - giftCardRedemptions.total;
	}

	return 0;
};

var totalNetSales = function(orderSet){
	if(!!orderSet){
		let totalSales = _.reduce(orderSet, function(memo, order){
			return memo + order.subtotals.subtotal - order.subtotals.discount - order.subtotals.adjustments;
		}, 0);

		return totalSales;
	}

	return 0;
};

Maestro.Atlas.Tally.NetSales = function(tallyDate, endDate){
	let ordersToday = Maestro.Atlas.Tally.GetOrders(tallyDate, endDate);
	let giftCardRedemptions = GiftCardRedemptions(ordersToday);

	if(!!ordersToday){
		return totalNetSales(ordersToday) - giftCardRedemptions.total;
	}

	return 0;
};

var totalTaxes = function(orderSet){
	if(!!orderSet){
		let totalOrderTaxes = _.reduce(orderSet, function(memo, order){
			return order.subtotals.tax + memo;
		},0);
		return totalOrderTaxes;
	}

	return 0;
};

var totalTaxComponent = function(orderSet, taxLabel){
	if(!!orderSet){
		let totalSales = _.reduce(orderSet, function(memo, order){
			if(!!order.subtotals.taxComponents){
				return memo + order.subtotals.taxComponents[taxLabel];
			} else {
				return 0.00 + memo;
			}
		}, 0);
		return totalSales;
	}

	return 0;
};

Maestro.Atlas.Tally.TaxComponentTotal = function(component, tallyDate, endDate){
	let ordersToday = Maestro.Atlas.Tally.GetOrders(tallyDate, endDate);

	if(component == "TOTAL" || component == "total"){
		return totalTaxes(ordersToday);
	} else {
		return totalTaxComponent(ordersToday, component);
	}
};

Maestro.Atlas.Tally.TotalOrderCount = function(tallyDate, endDate){
	let ordersToday = Maestro.Atlas.Tally.GetOrders(tallyDate, endDate);

	return ordersToday.length || 0;
};

Maestro.Atlas.Tally.Daily.Orders = function(tallyDate){ // location independent.. should be merged with .GetOrders fn()
	var currentDate = new Date(tallyDate);
	var nextDay = new Date(currentDate);
	nextDay.setDate(currentDate.getDate()+1);

	var ordersObj = Orders.find({createdAt : {$gt: currentDate, $lt: nextDay}}).fetch();

	return ordersObj.length;
};

Maestro.Atlas.Tally.Daily.Sales = function(tallyDate){ // location independent.. should be merged with .GetOrders fn()

	var currentDate = new Date(tallyDate);
	var nextDay = new Date(currentDate);
	nextDay.setDate(currentDate.getDate()+1);

	var ordersObj = Orders.find({createdAt : {$gt: currentDate, $lt: nextDay}}).fetch();
	var salesTally = 0;

	for (i = 0; i< ordersObj.length; i++){
		salesTally += ordersObj[i].subtotals.total;
	}

	return salesTally.toFixed(2);
};

Maestro.Atlas.Tally.Daily.CashSales = function(tallyDate){
	let ordersToday = Maestro.Atlas.Tally.GetOrders(tallyDate);
	let giftCardRedemptions = GiftCardRedemptions(ordersToday);

	let cashOrders = _.filter(ordersToday, function(order){
		return order.payment.method == "cash";
	});

	let cashOrdersTotal = totalNetSales(cashOrders);

	let cashOrdersTaxes = _.reduce(cashOrders, function(memo, order){
		return order.subtotals.tax + memo;
	},0);

	let cashOrdersGSTTaxes = totalTaxComponent(cashOrders, 'gst');

	let cashOrdersHSTTaxes = totalTaxComponent(cashOrders, 'hst');

	let cashOrdersPSTTaxes = totalTaxComponent(cashOrders, 'pst');

	let cashTransactions = cashOrders.length;

	return {
		grandTotal: cashOrdersTotal + cashOrdersTaxes - giftCardRedemptions.cash, 
		total: cashOrdersTotal - giftCardRedemptions.cash, 
		taxes: cashOrdersTaxes, 
		transactions: cashTransactions, 
		gstTax: cashOrdersGSTTaxes, 
		hstTax: cashOrdersHSTTaxes,
		pstTax: cashOrdersPSTTaxes,
	};
};

Maestro.Atlas.Tally.Daily.CreditDebitSales = function(tallyDate){
	let ordersToday = Maestro.Atlas.Tally.GetOrders(tallyDate);
	let giftCardRedemptions = GiftCardRedemptions(ordersToday);
	
	let cardOrders = _.filter(ordersToday, function(order){
		return order.payment.method == "card";
	});

	let cardOrdersTotal = totalNetSales(cardOrders)

	let cardOrdersTaxes = _.reduce(cardOrders, function(memo, order){
		return order.subtotals.tax + memo;
	},0);

	let cardOrdersGSTTaxes = totalTaxComponent(cardOrders, 'gst');

	let cardOrdersHSTTaxes = totalTaxComponent(cardOrders, 'hst');

	let cardOrdersPSTTaxes = totalTaxComponent(cardOrders, 'pst');

	let cardTransactions = cardOrders.length;

	return {
		grandTotal: cardOrdersTotal + cardOrdersTaxes - giftCardRedemptions.card, 
		total: cardOrdersTotal - giftCardRedemptions.card, 
		taxes: cardOrdersTaxes, 
		transactions: cardTransactions, 
		gstTax: cardOrdersGSTTaxes, 
		hstTax: cardOrdersHSTTaxes,
		pstTax: cardOrdersPSTTaxes,
	};
};

Maestro.Atlas.Tally.Daily.GiftCardRedemptions = function(tallyDate){
	let ordersToday = Maestro.Atlas.Tally.GetOrders(tallyDate);

	return GiftCardRedemptions(ordersToday);
};

Maestro.Atlas.Tally.Daily.TipsGiven = function(tallyDate){
	let ordersToday = Maestro.Atlas.Tally.GetOrders(tallyDate);

	return TipsGiven(ordersToday);
};

Maestro.Atlas.Tally.Daily.LoyaltyProgramSales = function(tallyDate){

};

Maestro.Atlas.Tally.StartToEndDate.Orders = function(startDate, endDate){
	var currentDate = new Date(startDate);
	var nextDay = new Date(endDate);

	var ordersObj = Orders.find({createdAt : {$gt: currentDate, $lt: nextDay}}).fetch();

	return ordersObj.length;
};

Maestro.Atlas.Tally.StartToEndDate.Sales = function(startDate, endDate){

	var currentDate = new Date(startDate);
	var nextDay = new Date(endDate);

	var ordersObj = Orders.find({createdAt : {$gt: currentDate, $lt: nextDay}}).fetch();
	var salesTally = 0;

	for (i = 0; i< ordersObj.length; i++){
		salesTally += ordersObj[i].subtotals.total;
	}

	return salesTally.toFixed(2);
};

Maestro.Atlas.Tally.StartToEndDate.ProductsTable = function(startDate, endDate){
	var startDate = new Date(startDate);
    var endDate = new Date(endDate);
    var ordersObj = Maestro.Atlas.Tally.GetOrders(startDate, endDate);
    var currentPeriodProducts = [];
    var productIndex;
    var productExist;

    for (i=0; i< ordersObj.length; i++){
        for (j = 0; j < ordersObj[i].items.length; j++){

        	if(ordersObj[i].items[j].product._id.startsWith("Redeem-")){
	    		let trueIdIndex = ordersObj[i].items[j].product._id.lastIndexOf("-");
	    		let trueId = ordersObj[i].items[j].product._id.substr(trueIdIndex+1);

	    		let trueNameIndex = 9;
	    		let trueName = ordersObj[i].items[j].product.name.substr(trueNameIndex);

	    		ordersObj[i].items[j].product.name = trueName;
	    		ordersObj[i].items[j].product._id = trueId;
	    		ordersObj[i].items[j].quantity = 0;      		
        	}

            productExist = _.findWhere(currentPeriodProducts, {product:ordersObj[i].items[j].product.name});

            if (productExist){
                productIndex = _.indexOf(currentPeriodProducts, productExist);
                currentPeriodProducts[productIndex].productTotal += ordersObj[i].items[j].total;
                currentPeriodProducts[productIndex].productQuantity += ordersObj[i].items[j].quantity;
            } else {
                currentPeriodProducts.push({
                    product: ordersObj[i].items[j].product.name,
                    productId: ordersObj[i].items[j].product._id,
                    productTotal: ordersObj[i].items[j].total,
                    productQuantity: ordersObj[i].items[j].quantity
                });
            }
        }
    }

    currentPeriodProducts = _.sortBy(currentPeriodProducts,"productTotal");
    currentPeriodProducts = currentPeriodProducts.reverse();

    return currentPeriodProducts;
};

Maestro.Atlas.Tally.StartToEndDate.CategoryTable = function(startDate, endDate){
	var currentPeriodProductsSet = Maestro.Atlas.Tally.StartToEndDate.ProductsTable(startDate, endDate);

	// var currentPeriodCategorySet = [{
	// 	categoryName: "Uncategorized",
	// 	categoryTotal: 0.00,
	// 	categoryQuantity: 0
	// }];

	var currentPeriodCategorySet = [];

	var categoryExist;
	var productObject;
	var categoryName;

	var allCategories = ProductCategories.find({}).fetch();

	// for (cat = 0; cat < allCategories.length; cat++){
	// 	currentPeriodCategorySet.push({
	// 		categoryName: allCategories[cat].name,
	// 		categoryTotal: 0.00,
	// 		categoryQuantity: 0
	// 	});
	// }

	for (prod = 0; prod < currentPeriodProductsSet.length; prod ++){
		
		if(currentPeriodProductsSet[prod].productId){
			productObject = Products.findOne({_id: currentPeriodProductsSet[prod].productId});
		} 

		if(!productObject){
			loyaltyObject = LoyaltyPrograms.findOne({_id: currentPeriodProductsSet[prod].productId});
			if(!!loyaltyObject){
				categoryName = "Loyalty Programs";
			} else {
				categoryName = "Uncategorized";
			}
		} else {
			if(productObject.categories){
				if(productObject.categories.length>0){
					categoryName = productObject.categories[0];
				} else {
					categoryName = "Uncategorized";
				}
			} else {
				categoryName = "Uncategorized";
			}
		}

		categoryExist = _.findWhere(currentPeriodCategorySet, {categoryName: categoryName });

		if (categoryExist){
			categoryIndex = _.indexOf(currentPeriodCategorySet, categoryExist);
			currentPeriodCategorySet[categoryIndex].categoryTotal += currentPeriodProductsSet[prod].productTotal;
			currentPeriodCategorySet[categoryIndex].categoryQuantity += currentPeriodProductsSet[prod].productQuantity;
		} else {
			currentPeriodCategorySet.push({
				categoryName: categoryName,
				categoryTotal: currentPeriodProductsSet[prod].productTotal,
				categoryQuantity: currentPeriodProductsSet[prod].productQuantity
			});
		}

	}

	currentPeriodCategorySet = _.sortBy(currentPeriodCategorySet, "categoryTotal");
	currentPeriodCategorySet = currentPeriodCategorySet.reverse();

	return currentPeriodCategorySet;
};
