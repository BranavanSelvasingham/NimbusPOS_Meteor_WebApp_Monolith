Maestro.Atlas.Aggregate = {};

Maestro.Atlas.Aggregate.TotalSales = function(orderSet){
    if(!orderSet){return 0;}

	let totalSales = _.reduce(orderSet, function(memo, group){
        return memo + group.total - group.giftCardTotal;
    }, 0);

    return totalSales;
};

Maestro.Atlas.Aggregate.TotalOrderCount = function(orderSet){
    if(!orderSet){return 0;}

    let totalCount= _.reduce(orderSet, function(memo, group){
        return memo + group.count;
    }, 0);

    return totalCount;
};

Maestro.Atlas.Aggregate.TotalNetSales = function(orderSet){
    if(!orderSet){return 0;}

    let totalNetSales = _.reduce(orderSet, function(memo, group){
        return memo + group.total - group.tax - group.giftCardTotal;
    }, 0);

    return totalNetSales;
};

Maestro.Atlas.Aggregate.TotalTaxes = function(orderSet){
    if(!orderSet){return 0;}

    let totalTaxes = _.reduce(orderSet, function(memo, group){
        return memo + group.tax;
    }, 0);

    return totalTaxes;
};

Maestro.Atlas.Aggregate.GSTTaxes = function(orderSet){
    if(!orderSet){return 0;}

    let totalGST = _.reduce(orderSet, function(memo, group){
        return memo + group.gst;
    }, 0);

    return totalGST;
};

Maestro.Atlas.Aggregate.HSTTaxes = function(orderSet){
    if(!orderSet){return 0;}

    let totalHST = _.reduce(orderSet, function(memo, group){
        return memo + group.hst;
    }, 0);

    return totalHST;
};

Maestro.Atlas.Aggregate.PSTTaxes = function(orderSet){
    if(!orderSet){return 0;}

    let totalPST = _.reduce(orderSet, function(memo, group){
        return memo + group.pst;
    }, 0);

    return totalPST;
};

Maestro.Atlas.Aggregate.TotalGiftCardRedeemed = function(orderSet){
    if(!orderSet){return 0;}

    let totalRedeemed = _.reduce(orderSet, function(memo, group){
        return memo + group.giftCardTotal;
    }, 0.00);

    return totalRedeemed;
};

var thisIsProduct = function(itemId){
    if(!!Products.findOne({_id: itemId})){
        return true;
    }
    return false;
};

var thisIsLoyalty = function(itemId){
    if(!!LoyaltyPrograms.findOne({_id: itemId})){
        return true;
    }
    return false;
};

var thisIsProductRedeem = function(itemId){
    if(itemId.startsWith("Redeem-")){
        let trueIdIndex = itemId.lastIndexOf("-");
        let trueId = itemId.substr(trueIdIndex + 1);
        if(!!Products.findOne({_id: trueId})){
            return true;
        }
    }
    return false;
};

var getRedeemProductInfo = function(itemId){
    if(itemId.startsWith("Redeem-")){
        let trueIdIndex = itemId.lastIndexOf("-");
        let trueId = itemId.substr(trueIdIndex + 1);
        if(!!Products.findOne({_id: trueId})){
            return Products.findOne({_id: trueId});
        }
    }
    return {};
};


Maestro.Atlas.Aggregate.ParseItemsTable = function(itemSet){
    if(!itemSet) {return [];}

    let itemsTable = _.map(itemSet, function(item){
        let itemId = item._id.productId;
        if(thisIsProduct(itemId)){
            let productRef = Products.findOne({_id: itemId});
            return {
                isProduct: true,
                itemId: itemId,
                name: productRef.name,
                category: productRef.categories[0] || "Uncategorized",
                total: item.amount,
                quantity: item.count  
            };
        } else if (thisIsProductRedeem(itemId)){
            let productRef = getRedeemProductInfo(itemId);
            return {
                isRedeem: true,
                itemId: productRef._id,
                name: productRef.name + " Redeemed",
                total: item.amount,
                quantity: item.count
            };
        } else if (thisIsLoyalty(itemId)){
            let loyaltyRef = LoyaltyPrograms.findOne({_id: itemId});
            return {
                isLoyaltyProgram: true,
                itemId: itemId,
                name: loyaltyRef.name,
                total: item.amount,
                quantity: item.count
            }
        } else {
            return {};
        }
    });

    let productsTable = _.filter(itemsTable, function(item){
        return item.isProduct === true;
    });

    let productRedeemTable = _.filter(itemsTable, function(item){
        return item.isRedeem === true;
    });

    if(productRedeemTable.length > 0){
        _.each(productRedeemTable, function(redeemItem){
            let productIndex = _.indexOf(_.pluck(productsTable,"itemId"), redeemItem.itemId);

            productsTable[productIndex].total += redeemItem.total;
        });
    }

    let loyaltyProgramTable = _.filter(itemsTable, function(item){
        return item.isLoyaltyProgram === true;
    });

    productsTable = _.sortBy(productsTable, "total");
    productsTable = productsTable.reverse();

    productRedeemTable = _.sortBy(productRedeemTable, "total");

    loyaltyProgramTable = _.sortBy(loyaltyProgramTable, "total");
    loyaltyProgramTable = loyaltyProgramTable.reverse();

    let productCategoryGroup = _.groupBy(productsTable, 'category');
    let categoryTable = [];


    _.each(productCategoryGroup, function(catSet){
        categoryTable.push({
            categoryName: catSet[0].category,
            categoryTotal: _.reduce(catSet, function(memo, item){return memo + item.total;}, 0.00),
            quantity: _.reduce(catSet, function(memo, item){return memo + item.quantity;}, 0)
        });
    });

    categoryTable = _.sortBy(categoryTable, "categoryTotal");
    categoryTable = categoryTable.reverse();

    return {
        products: productsTable, //after redemptions
        productRedeems: productRedeemTable,
        loyaltyPrograms: loyaltyProgramTable,
        categories: categoryTable
    };

};

Maestro.Atlas.Aggregate.CustomersTable = function(customerSet){
    if(!customerSet){return;}

    let customersTable = [];

    _.each(customerSet, function(customer){
        let refCustomer = Customers.findOne({_id: customer._id.customerId});
        if(!!refCustomer){
            customersTable.push({
                customerId: customer._id.customerId,
                name: refCustomer.name,
                quantity: customer.count,
                total: customer.total - customer.tax - customer.giftCardTotal
            });
        }
    });

    customersTable = _.sortBy(customersTable, "total");
    customersTable = customersTable.reverse();

    return {
        top30: _.first(customersTable, 30)
    };
};