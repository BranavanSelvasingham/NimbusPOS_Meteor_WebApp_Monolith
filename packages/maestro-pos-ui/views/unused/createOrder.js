Maestro.Templates.CreateOrder = "CreateOrder";

// let PRODUCTS = "Products";
let CUSTOMERS = "Customers";
let CUSTOMER_CRITERIA = ["NAME", "EMAIL", "PHONE"];

// let searchableLists = [PRODUCTS, CUSTOMERS];

let searchableLists = [CUSTOMERS];

var subtotalDefaults = {
    subtotal: 0.00,
    discount: 0.00,
    adjustments: 0.00,
    tax: 0.00,
    taxBreakdown: {},
    total: 0.00
};

var giftCardsBalances = [];

initializeOrder = function(template) {
    template.ordersSelectedCategoryFilter = new ReactiveVar();
    template.ordersSelectedCategoryFilter.set({primary: 'All'});

    template.customerSearchCriteria = new ReactiveDict();
    _.each(CUSTOMER_CRITERIA, function (field) {
        template.customerSearchCriteria.set(field, "");
    });

    template.ordersSelectedAlphabetFilter = new ReactiveVar();
    template.ordersSelectedAlphabetFilter.set('All');

    //initialize order instance
    template.orderItems = new ReactiveDict();

    template.orderTotals = new ReactiveDict();

    template.paymentMethod = new ReactiveVar();
    template.paymentMethod.set("cash");

    template.paymentDueAmount = new ReactiveVar();
    template.paymentDueAmount.set(null);

    template.adjustmentAmount = new ReactiveVar();
    template.adjustmentAmount.set(0);

    template.cashAmountGiven = new ReactiveVar();
    template.cashAmountGiven.set(0);

    giftCardsBalances = [];

    template.orderCustomer = new ReactiveVar();
    template.orderCustomer.set(null);

    template.previousOrderCustomer = new ReactiveVar();
    template.previousOrderCustomer.set(null);

    template.orderLoyaltyType = new ReactiveVar();
    template.orderLoyaltyType.set('All');

    template.orderLoyaltyItems = new ReactiveVar();
    template.orderLoyaltyItems.set([]);

    template.appliedCustomerLoyaltyPrograms = new ReactiveVar();
    template.appliedCustomerLoyaltyPrograms.set();

    template.existingCustomerLoyaltyPrograms = new ReactiveVar();
    template.existingCustomerLoyaltyPrograms.set();

    template.existingQuantityLoyalty = new ReactiveVar();
    template.existingQuantityLoyalty.set();  

    template.existingAmountLoyalty = new ReactiveVar();
    template.existingAmountLoyalty.set();

    template.existingPercentageLoyalty = new ReactiveVar();
    template.existingPercentageLoyalty.set(); 

    template.existingTallyPrograms = new ReactiveVar();
    template.existingTallyPrograms.set();

    template.addLoyaltyCreditItems = new ReactiveDict();

    //initialize order totals
    updateOrderTotals(template);

    //initialize searchable product and customer lists
    template.searchCriteria = new ReactiveDict();
    _.each(searchableLists, function (searchableItem) {
        template.searchCriteria.set(searchableItem, "");
    });


    template.lists = new ReactiveDict();
    _.each(searchableLists, function (searchableItem) {
        template.lists.set(searchableItem, []);
        search(searchableItem, template);
    });

    template.selectedCandidateGroup = new ReactiveVar();
    template.selectedCandidateGroup.set(null);

    //remember last selection - item
    template.candidateOrderItem = new ReactiveVar();
    template.candidateOrderItem.set(null);

    //remember last selection - item
    template.selectedOrderItem = new ReactiveVar();
    template.selectedOrderItem.set(null);

    //remember last selection - product
    template.selectedProduct = new ReactiveVar();
    template.selectedProduct.set(null);

    template.orderItemLoyaltyPrograms = new ReactiveDict();

    template.enableProductSearch = new ReactiveVar();
    template.enableProductSearch.set(false);

    template.emailReceiptFlag = new ReactiveVar();
    template.emailReceiptFlag.set(false);

    template.printReceiptFlag = new ReactiveVar();
    template.printReceiptFlag.set(false);

    template.showPaymentInfoFor = new ReactiveVar();
    template.showPaymentInfoFor.set('cash');

    template.newOrderId = new ReactiveVar();

    template.expandedProduct = new ReactiveVar();

    template.itemIdCounter = new ReactiveVar();
    template.itemIdCounter.set(1);

    template.thisOrderItem = new ReactiveVar();
    template.thisOrderItem.set();

    template.customerTabMode = new ReactiveVar();
    template.customerTabMode.set('search'); //search, create, edit
};

clearOrder = function(template){

    template.orderItems.clear();

    template.paymentMethod.set("cash");

    template.paymentDueAmount.set(null);

    template.adjustmentAmount.set(0);

    template.cashAmountGiven.set(0);

    template.orderCustomer.set();

    template.ordersSelectedAlphabetFilter.set('All');

    template.orderLoyaltyType.set('All');

    template.orderLoyaltyItems.set([]);

    template.appliedCustomerLoyaltyPrograms.set();

    template.existingCustomerLoyaltyPrograms.set();

    template.existingQuantityLoyalty.set(); 
    template.existingAmountLoyalty.set();
    template.existingPercentageLoyalty.set(); 
    template.existingTallyPrograms.set();

    template.addLoyaltyCreditItems.clear();

    // console.log('clearing data');

    //initialize order totals
    subtotalDefaults = {
        subtotal: 0.00,
        discount: 0.00,
        adjustments: 0.00,
        tax: 0.00,
        total: 0.00
    };

    giftCardsBalances = [];

    // template.customerSearchCriteria.clear();
    _.each(CUSTOMER_CRITERIA, function (field) {
        template.customerSearchCriteria.set(field, "");
    });

    //initialize searchable product and customer lists
    template.searchCriteria.clear();
    _.each(searchableLists, function (searchableItem) {
        template.searchCriteria.set(searchableItem, "");
    });

    clearCustomerSearchCriteria(template);

    // template.lists.clear();
    // _.each(searchableLists, function (searchableItem) {
    //     template.lists.set(searchableItem, []);
    //     search(searchableItem, template);
    // });

    template.selectedCandidateGroup.set(null);

    //remember last selection - item
    template.candidateOrderItem.set(null);

    //remember last selection - item
    template.selectedOrderItem.set(null);

    //remember last selection - product
    template.selectedProduct.set(null);

    template.orderItemLoyaltyPrograms.clear();

    template.emailReceiptFlag.set(false);

    // template.printReceiptFlag.set(false);

    template.showPaymentInfoFor.set('cash');

    template.newOrderId.set();

    template.expandedProduct.set(); 

    template.itemIdCounter.set(1);

    template.thisOrderItem.set();

    document.getElementById('customer-search').value="";
    $('ul.tabs').tabs('select_tab', 'searchCustomer');

    template.customerTabMode.set('search');
};

clearCustomerInfo = function(template){
    template.orderCustomer.set();

    // template.orderLoyaltyItems.set([]);

    template.appliedCustomerLoyaltyPrograms.set();

    template.existingCustomerLoyaltyPrograms.set();

    template.existingQuantityLoyalty.set(); 
    template.existingAmountLoyalty.set();
    template.existingPercentageLoyalty.set();
    template.existingTallyPrograms.set(); 

    template.addLoyaltyCreditItems.clear();

    deleteAllExistingRedeemItems(template);

    giftCardsBalances = [];

    template.paymentDueAmount.set(null);

    template.cashAmountGiven.set(0);

    template.emailReceiptFlag.set(false);

    template.printReceiptFlag.set(false);

    document.getElementById('customer-search').value="";

    template.customerTabMode.set('search');
};

reApplyLoyaltyPrograms = function(template){
    deleteAllExistingRedeemItems(template);

    // template.orderLoyaltyItems.set([]);

    template.existingQuantityLoyalty.set(); 
    template.existingAmountLoyalty.set();
    template.existingPercentageLoyalty.set();
    template.existingTallyPrograms.set(); 

    template.addLoyaltyCreditItems.clear();

    giftCardsBalances = [];

    template.paymentDueAmount.set(null);

    template.cashAmountGiven.set(0);

    getLoyaltyPrograms(template);
};

var search = function(type, template) {
    template.autorun(function () {
        let searchTerm = template.searchCriteria.get(type);
        Meteor.call("search" + type, searchTerm, function (error, result) {
            template.lists.set(type, result);
        });
    });
};

var updateOrderTotals = function(template) {
    template.autorun(function (){
        if(template.orderItems && template.orderTotals) {
            let subtotals = subtotalDefaults;

            if(template.orderItems.all()) {
                subtotals = _.extend(subtotalDefaults, calculateOrderTotals(template, template.orderItems.all()));
            }

            var cashTotal = Maestro.Payment.CashRounding(subtotals.total);
            var cashRounding = Number(Maestro.Payment.RoundMoney(cashTotal - subtotals.total));

            template.orderTotals.set("subtotal", subtotals.subtotal);
            template.orderTotals.set("discount", subtotals.discount);
            template.orderTotals.set("adjustments", subtotals.adjustments);
            template.orderTotals.set("tax", subtotals.tax);
            template.orderTotals.set("taxBreakdown", subtotals.taxBreakdown);
            template.orderTotals.set("total", subtotals.total);
            template.orderTotals.set("cash-total", cashTotal);
            template.orderTotals.set("cash-rounding", cashRounding);
        }
    });
};

var calculateOrderTotals = function (template, orderItemsHash) {
    let subtotals = subtotalDefaults;

    if(orderItemsHash) {
        let allItems = _.values(orderItemsHash);
        let taxableItems = getTaxableItems(allItems);
        subtotals = calculateSubtotals(template, taxableItems, allItems);
    }
    return subtotals;
};

var getTaxableItems = function(orderItemsList) {
    return _.filter(orderItemsList, isProductTaxable);
};

var isProductTaxable = function(orderItem) {
    let taxRule = orderItem.product.taxRule;
    if(taxRule == "TAXED"){ return true;} // temporary measure to deal with old tax classification
    return Maestro.Tax.Types.get(taxRule, "taxable", false);
};

var isProductRetailTaxed = function(orderItem) {
    let taxRule = orderItem.product.taxRule;
    // console.log('taxRule: ' + taxRule);
    return (Maestro.Tax.Types.get(taxRule, "rule", false) == "retailTax") || (taxRule == "TAXED");  //taxRule = TAXED check is to allow for older categorization of taxation
};

var isProductPreparedMeal = function(orderItem) {
    let taxRule = orderItem.product.taxRule;
    return Maestro.Tax.Types.get(taxRule, "rule", false) == "preparedMeal";
};

var isProductWholesalePastry = function(orderItem) {
    let taxRule = orderItem.product.taxRule;
    return Maestro.Tax.Types.get(taxRule, "rule", false) == "wholesalePastry";
};

var calculateSubtotals = function(template, orderItemsTaxable, orderItemsAll) {  
    var discount = 0.00;
    var highestPercent = 0;
    let subtotalAll = Maestro.Payment.RoundedNumber(_.reduce(orderItemsAll, addToSubtotal, 0.00), 2);

    //if any credit percentage based loyalties then get highest percentage
    let creditPercentPrograms = template.existingPercentageLoyalty.get();
    if (creditPercentPrograms){
        for (y = 0; y< creditPercentPrograms.length; y++){
            // console.log('subtotal calc:', creditPercentPrograms[y]);
            if(creditPercentPrograms[y].appliesTo == "Entire-Purchase"){
                if (highestPercent<creditPercentPrograms[y].creditPercent){
                    highestPercent = creditPercentPrograms[y].creditPercent;
                }
            }
        }
        discount = subtotalAll*(highestPercent/100);
    } 
    
    // let subtotalTaxable = Maestro.Payment.RoundedNumber(_.reduce(orderItemsTaxable, addToSubtotal, 0.00), 2);

    let discountPercent = highestPercent;

    let adjustment = template.adjustmentAmount.get();
    let adjustmentAmount = adjustment/100 * subtotalAll; 

    let taxes = determineTax(template, orderItemsTaxable, discountPercent, adjustment);
    // console.log('taxes: ', taxes);
    let grandTotal = Maestro.Payment.RoundedNumber(subtotalAll - discount - adjustmentAmount + taxes.total, 2);
    if(grandTotal<0.00){grandTotal = 0.00;}
    // let tax = Maestro.Payment.RoundedNumber(determineTax(subtotalTaxable, subtotalTaxable*(1-highestPercent/100)), 2);

    return {
        subtotal: subtotalAll,
        discount: discount,
        adjustments: adjustmentAmount,
        tax: taxes.total,
        taxBreakdown: taxes.breakdown,
        total: grandTotal
    };
};

var addToSubtotal = function(subtotal, orderItem) {
    // return subtotal + (orderItem.quantity * orderItem.size.price);
    return subtotal + getItemTotal(orderItem);
};

var addToQuantity = function(quantity, orderItem){
    return quantity + orderItem.quantity;
};

var determineTax = function (template, orderItemsTaxable, discountPercent, adjustment) {
    let retailTax = 13.00;
    let gstTaxRate = 5.00;
    let gstTax = 0.00;
    let hstTax = 0.00;

    var totalTax = 0.00;

    let subtotalAllTaxable = Maestro.Payment.RoundedNumber(_.reduce(orderItemsTaxable, addToSubtotal, 0.00), 2);

    let retailTaxItems = _.filter(orderItemsTaxable, isProductRetailTaxed) || [];
    let retailSubtotal = Maestro.Payment.RoundedNumber(_.reduce(retailTaxItems, addToSubtotal, 0.00), 2);    
    // console.log('retail tax items: ', retailTaxItems);

    let preparedMealItems = _.filter(orderItemsTaxable, isProductPreparedMeal) || [];
    let preparedMealSubtotal = Maestro.Payment.RoundedNumber(_.reduce(preparedMealItems, addToSubtotal, 0.00), 2);
    // console.log('prepared meal items: ', preparedMealItems);

    let wholesalePastryItems = _.filter(orderItemsTaxable, isProductWholesalePastry) || [];
    let wholesalePastrySubtotal = Maestro.Payment.RoundedNumber(_.reduce(wholesalePastryItems, addToSubtotal, 0.00), 2);
    let wholesalePastryQuantity = _.reduce(wholesalePastryItems, addToQuantity, 0);
    // console.log('wholesale pastry items: ', wholesalePastryItems);

    totalTax += retailSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( retailTax / 100);

    if (subtotalAllTaxable < 4.00){
        //prepared meals and wholesale pastry are taxed at 5%
        taxAdd = preparedMealSubtotal * (1.00 - (discountPercent/100)) * (1.00 - (adjustment/100)) * ( gstTaxRate / 100);
        gstTax += taxAdd;
        totalTax += taxAdd;

        if(wholesalePastryQuantity < 6){
            taxAdd = wholesalePastrySubtotal * (1.00 - (discountPercent/100)) *(1.00 - (adjustment/100))* ( gstTaxRate / 100);
            gstTax += taxAdd;
            totalTax += taxAdd;
        }
    } else {

        totalTax += preparedMealSubtotal * (1.00 - (discountPercent/100)) * (1.00 - (adjustment/100)) * ( retailTax / 100);

        if(wholesalePastryQuantity < 6){
            totalTax += wholesalePastrySubtotal * (1.00 - (discountPercent/100)) *(1.00 - (adjustment/100))* ( retailTax / 100);
        }
    }

    hstTax = totalTax - gstTax;

    return {
        total: Maestro.Payment.RoundedNumber(totalTax,2),
        breakdown: {
            gst: Maestro.Payment.RoundedNumber(gstTax,2),
            hst: Maestro.Payment.RoundedNumber(hstTax,2)
        }
    };
};

createOrderItem = function (selectedProduct, selectedSize, selectedQuantity, selectedAddOns, template) {
    return {
        itemNumber: template.itemIdCounter.get(),
        product: selectedProduct,
        size: selectedSize,
        addOns: selectedAddOns || [],
        quantity: (selectedQuantity || 1)
    };
};

getItemTotal = function (orderItem) {
    let itemTotal = orderItem.size.price * orderItem.quantity;
    let addOnTotal = _.reduce(_.pluck(orderItem.addOns, 'price'), function(memo, num){return memo + num;}, 0) * orderItem.quantity;
    return itemTotal + addOnTotal;
};

getAddOnKey = function(addOnSet){
    var addOnKey = "";
    let allProductAddOns = _.pluck(ProductAddons.find({status:'Active'}).fetch(), '_id'); 
    var indexSet = [];

    let givenAddOnSet = _.pluck(addOnSet, '_id');

    if (givenAddOnSet.length){
        for (i = 0; i < givenAddOnSet.length; i++){
            indexSet[i]= _.indexOf(allProductAddOns, givenAddOnSet[i]);
        }
        let sortedIndex = _.sortBy(indexSet, function(num){return num;});

        for (j = 0; j < sortedIndex.length; j++){
            addOnKey += "-"+sortedIndex[j].toString();
        }

        return "-addon"+addOnKey;
    } else {
        return "";
    }

};

fullItemKey = function(orderItem){
    let selectedSizeCode = orderItem.size.code;
    let selectedProductId = orderItem.product._id;
    let selectedAddOns = orderItem.addOns;

    let key = selectedSizeCode + "-" + selectedProductId + getAddOnKey(selectedAddOns);

    return key;
};

selectProduct = function (selectedProduct, selectedSizeCode, selectedQuantity, selectedAddOns, template) {
    if(selectedProduct) {
        template.selectedProduct.set(selectedProduct);
    }

    if (selectedSizeCode) {
        let selectedProductId = selectedProduct._id;
        let selectedSize = _.find(selectedProduct.sizes, function (size) {
            return size.code === selectedSizeCode;
        });

        if (selectedSize) { //removed $0 price check to allow for $0 items to be added to cart
            let addItem = true;
            let key = selectedSizeCode + "-" + selectedProductId + getAddOnKey(selectedAddOns);
            let orderItem = template.orderItems.get(key);

            if (orderItem) {
                if(selectedQuantity === 0) {
                    addItem = false;
                } else {
                    orderItem.quantity += selectedQuantity || 1;
                    // orderItem.quantity = selectedQuantity || orderItem.quantity + 1;
                }
            } else {
                orderItem = createOrderItem(selectedProduct, selectedSize, selectedQuantity, selectedAddOns, template);
            }

            // set/update order-item
            if(addItem) {
                orderItem.currentKey = fullItemKey(orderItem);
                template.orderItems.set(key, orderItem);
                template.itemIdCounter.set(template.itemIdCounter.get() + 1);
                template.selectedOrderItem.set(orderItem);
            } else {
                removeProductItem(key, template);
                template.selectedOrderItem.set(null);
            }
        }
    }
};

removeProductItem = function (key, template) {
    //remove item by key
    template.orderItems.delete(key);
};

removeLoyaltyItem = function(programId, template){
    var selectedLoyaltyItems = template.orderLoyaltyItems.get();
    if(selectedLoyaltyItems){
        for (i=0; i < selectedLoyaltyItems.length; i++) {
            if (selectedLoyaltyItems[i]._id == programId){
                selectedLoyaltyItems.splice(i,1);
            }
        }
        template.orderLoyaltyItems.set(selectedLoyaltyItems);
    }
};


// setProductSearchCriteria = function (searchTerm, template) {
//     template.searchCriteria.set(PRODUCTS, searchTerm);
// };

setCustomerSearchCriteria = function (searchTerm, template) {
    template.searchCriteria.set(CUSTOMERS, searchTerm);
};

// setProductCategorySearchCriteria = function(searchTerm, template){
//     template.searchCriteria.set(PRODUCTS, "");
//     template.searchCriteria.set(PRODUCTS, "Category:"+searchTerm);
// };

setCustomerAlphabetSearchCriteria = function(searchTerm, template){
    template.searchCriteria.set(CUSTOMERS, "");
    template.searchCriteria.set(CUSTOMERS, "Alphabet:"+searchTerm);
};

// clearProductSearchCriteria = function (template) {
//     template.searchCriteria.set(PRODUCTS, "");
// };

clearCustomerSearchCriteria = function (template) {
    template.searchCriteria.set(CUSTOMERS, "");
    template.customerSearchCriteria.set("NAME", "");
    document.getElementById('customer-search').value="";
};

setLoyaltyProgramApplyStatus = function(program, flag, template){
    // console.log('existing 1: ', template.existingCustomerLoyaltyPrograms.get());
    var thisProgram = program;
    var allExistingPrograms = template.existingCustomerLoyaltyPrograms.get() || [];
    
    // console.log(allExistingPrograms);

    var programIndex = _.indexOf(allExistingPrograms, thisProgram);
    allExistingPrograms[programIndex].apply = flag;
    template.existingCustomerLoyaltyPrograms.set(allExistingPrograms);

    var allAppliedPrograms = template.appliedCustomerLoyaltyPrograms.get() || [];

    if(flag){
        allAppliedPrograms.push(allExistingPrograms[programIndex]);
    } else if (!flag){
        allAppliedPrograms = _.without(allAppliedPrograms, allExistingPrograms[programIndex]);
    }

    template.appliedCustomerLoyaltyPrograms.set(allAppliedPrograms);
    reApplyLoyaltyPrograms(template);

    if(flag){
        autoRedeemSingleItemProgram(thisProgram.programId, template);
    }

    // console.log('all existing: ', template.existingCustomerLoyaltyPrograms.get());
    // console.log('applied: ', template.appliedCustomerLoyaltyPrograms.get());

};

setPrePurchaseLoyaltyApplyStatus = function(loyaltyProgram, flag, template){
    var thisLoyaltyProgram = loyaltyProgram;
    var allOrderLoyaltyItems = template.orderLoyaltyItems.get();

    let programIndex = _.indexOf(allOrderLoyaltyItems, thisLoyaltyProgram);

    allOrderLoyaltyItems[programIndex].apply = flag;
    allOrderLoyaltyItems[programIndex].prePurchase = flag;

    template.orderLoyaltyItems.set(allOrderLoyaltyItems);

    var allAppliedPrograms = template.appliedCustomerLoyaltyPrograms.get() || [];

    let prePurchaseLoyaltyProgram = {
        programId: allOrderLoyaltyItems[programIndex]._id,
        remainingQuantity: allOrderLoyaltyItems[programIndex].programType.quantity,
        remainingAmount: allOrderLoyaltyItems[programIndex].programType.creditAmount,
        creditPercent: allOrderLoyaltyItems[programIndex].programType.creditPercentage,
        expired: false,
        boughtOn: new Date(),
        apply: true,
        prePurchase: true 
    };

    if(flag){
        allAppliedPrograms.push(prePurchaseLoyaltyProgram);
    } else if (!flag){
        allAppliedPrograms = _.reject(allAppliedPrograms, function(prog){
            return prog.prePurchase == true && prog.programId == thisLoyaltyProgram._id;
        });
        // allAppliedPrograms = _.without(allAppliedPrograms, _.findWhere(allAppliedPrograms, {programId: thisLoyaltyProgram._id}));
    }

    template.appliedCustomerLoyaltyPrograms.set(allAppliedPrograms);

    reApplyLoyaltyPrograms(template);

    // console.log('all loyalty order items: ', template.orderLoyaltyItems.get());
    // console.log('applied: ', template.appliedCustomerLoyaltyPrograms.get());

    purgeExistingPrograms(template);//this is a temporary fix till the loyalty system is re-written

    if(flag){
        autoRedeemSingleItemProgram(thisLoyaltyProgram._id, template);
    }
};

isThisLoyalty = function(id){
    if(LoyaltyPrograms.findOne({_id:id})){
        return true;
    } else {
        return false;
    }
};

getExistingCustomerLoyaltyPrograms = function(customer, template){
    // Meteor.call("checkCustomerProgramExpiry", customer._id);
    Maestro.LoyaltyCards.CheckCustomerProgramExpiry(customer._id);

    let customerObj = Customers.findOne({_id: customer._id});

    let allExistingPrograms = customerObj.loyaltyPrograms;

    let existingPrograms = _.reject(allExistingPrograms, function(program){return program.expired;});

    existingPrograms = _.map(existingPrograms, function(program){
        // program.apply = true;
        program.apply = false;
        return program;
    });

    let activeTallyPrograms = Maestro.Loyalty.GetActiveTallyPrograms();

    if(existingPrograms.length || activeTallyPrograms.length){
        // console.log("existing programs found: ", existingPrograms);
        // template.appliedCustomerLoyaltyPrograms.set(existingPrograms);
        // refreshAppliedPrograms(existingPrograms, template);
        template.existingCustomerLoyaltyPrograms.set(existingPrograms);
        getLoyaltyPrograms(template);
    }
};

refreshAppliedPrograms = function(existing, template){
    let applied = existing;
    applied.concat(template.appliedCustomerLoyaltyPrograms.get());
    template.appliedCustomerLoyaltyPrograms.set(applied);
};

purgeExistingPrograms = function(template){
    template.existingCustomerLoyaltyPrograms.set(_.reject(template.existingCustomerLoyaltyPrograms.get(), function(prog){
        return prog.prePurchase == true;
    }));
};

getLoyaltyPrograms = function(template){
    var existingLoyaltyPrograms = template.appliedCustomerLoyaltyPrograms.get();

    if(existingLoyaltyPrograms){
        var loyaltyCreditProductSet = [];

        for (i=0; i<existingLoyaltyPrograms.length; i++){
            loyaltyCreditProductSet = [];
            if(existingLoyaltyPrograms[i].remainingQuantity>0){
                // console.log('has remaining qty');
                loyaltyCreditProductSet = template.existingQuantityLoyalty.get() || [];
                let programDetails = LoyaltyPrograms.findOne({_id:existingLoyaltyPrograms[i].programId});
                if(programDetails.products.length){
                    // console.log('looking for products');
                    loyaltyCreditProductSet.push({
                        programId: existingLoyaltyPrograms[i].programId,
                        remainingQuantity: existingLoyaltyPrograms[i].remainingQuantity,
                        productSet: programDetails.products,
                        prePurchase: existingLoyaltyPrograms[i].prePurchase
                    });
                }
                if(programDetails.categories.length){
                    // console.log('looking for categories');
                    let programCategoryProductSet = [];
                    for (ctg = 0; ctg < programDetails.categories.length; ctg ++){
                        let categoryProductSet = Products.find({categories: programDetails.categories[ctg].name}).fetch();
                        for (ctgProd = 0; ctgProd < categoryProductSet.length; ctgProd ++){
                            programCategoryProductSet.push({
                                productId: categoryProductSet[ctgProd]._id,
                                sizeCodes: _.pluck(Maestro.Products.Sizes,'code')
                            });
                        }
                    }                        
                    loyaltyCreditProductSet.push({
                        programId: existingLoyaltyPrograms[i].programId,
                        remainingQuantity: existingLoyaltyPrograms[i].remainingQuantity,
                        productSet: programCategoryProductSet,
                        prePurchase: existingLoyaltyPrograms[i].prePurchase
                    });
                }
                template.existingQuantityLoyalty.set(loyaltyCreditProductSet);
                // console.log("loyalty credit product set:", loyaltyCreditProductSet);

            } else if (existingLoyaltyPrograms[i].remainingAmount > 0){
                // console.log('has remaining amount');
                loyaltyCreditProductSet = template.existingAmountLoyalty.get() || [];
                loyaltyCreditProductSet.push({
                    programId: existingLoyaltyPrograms[i].programId,
                    remainingAmount: existingLoyaltyPrograms[i].remainingAmount,
                    prePurchase: existingLoyaltyPrograms[i].prePurchase
                });
                template.existingAmountLoyalty.set(loyaltyCreditProductSet);
                // console.log("loyalty amount set:", loyaltyCreditProductSet);

            } else if (existingLoyaltyPrograms[i].creditPercent >0){
                // console.log('has credit percent');
                loyaltyCreditProductSet = template.existingPercentageLoyalty.get() || [];
                let programDetails = LoyaltyPrograms.findOne({_id:existingLoyaltyPrograms[i].programId});
                
                let programSummary =  {
                    programId: existingLoyaltyPrograms[i].programId,
                    creditPercent: existingLoyaltyPrograms[i].creditPercent,
                    prePurchase: existingLoyaltyPrograms[i].prePurchase
                };

                if (programDetails.categories.length){
                    let programCategoryProductSet = [];
                    for (ctg = 0; ctg < programDetails.categories.length; ctg ++){
                        let categoryProductSet = Products.find({categories: programDetails.categories[ctg].name}).fetch();
                        for (ctgProd = 0; ctgProd < categoryProductSet.length; ctgProd ++){
                            programCategoryProductSet.push({
                                productId: categoryProductSet[ctgProd]._id,
                                sizeCodes: _.pluck(Maestro.Products.Sizes,'code')
                            });
                        }
                    }

                    programSummary.productSet = programCategoryProductSet; 
                }

                programSummary.appliesTo = programDetails.appliesTo; 

                loyaltyCreditProductSet.push(programSummary);

                // console.log('program details: ', programDetails);

                template.existingPercentageLoyalty.set(loyaltyCreditProductSet);
                // console.log("loyalty credit percent set:", loyaltyCreditProductSet);
            }
        }        
        // console.log("loyalty credit product set:", template.existingQuantityLoyalty.get());
        // console.log("loyalty amount set:", template.existingAmountLoyalty.get());
        // console.log("loyalty credit percent set:", template.existingPercentageLoyalty.get());
    }

    getTallyPrograms(template);

    checkOrderForLoyaltyCreditItems(template);
};

getTallyPrograms = function(template){
    let activeTallyPrograms = Maestro.Loyalty.GetActiveTallyPrograms();
    let customerObj = template.orderCustomer.get();
    // console.log('getting tally programs'); 

    if(activeTallyPrograms.length && !!customerObj){
        let customerTallyPrograms = [];

        _.each(activeTallyPrograms, function(program){
            

            let existingCustomerTally = customerObj.tallyPrograms;

            let thisTallyObj = _.find(existingCustomerTally, function(tallyObj){
                return tallyObj.programId == program._id;
            });

            customerTallyPrograms.push({
                programId: program._id,
                customerTally: thisTallyObj.tally,
                tallyThreshold: program.programType.tally,
                productSet: program.products
            });
        });
        // console.log(customerTallyPrograms);
        template.existingTallyPrograms.set(customerTallyPrograms);

        return true;
    }

    return false;
};

applyAnyLoyaltyCredits = function(selectedProduct, selectedSizeCode, selectedQuantity, template){
    // console.log('checking applicable loyalty credits');
    var currentPrograms = template.existingQuantityLoyalty.get();
    // console.log(currentPrograms);
    if(currentPrograms){
        for (i=0; i<currentPrograms.length; i++){
            let currentProgramProducts = currentPrograms[i].productSet || [];
            for (j=0; j<currentProgramProducts.length; j++){
                let programProduct = currentProgramProducts[j];
                if (selectedProduct._id == programProduct.productId){
                    // console.log("product match");
                    // console.log(programProduct.sizeCodes, selectedSizeCode);
                    if(_.contains(programProduct.sizeCodes, selectedSizeCode)){
                        // console.log("size code applies to program");
                        let orderItemKey = selectedSizeCode + "-" + selectedProduct._id;
                        let orderItem = template.orderItems.get(orderItemKey);
                        let loyaltyOrderItemKey = "Redeem-"+selectedSizeCode+"-"+selectedProduct._id;
                        let loyaltyOrderItem = template.orderItems.get(loyaltyOrderItemKey);

                        // console.log(orderItem, loyaltyOrderItem);

                        if(loyaltyOrderItem){
                            if (orderItem.quantity > loyaltyOrderItem.quantity){
                                let addQuantity = orderItem.quantity - loyaltyOrderItem.quantity;
                                if((addQuantity <= currentPrograms[i].remainingQuantity) && (currentPrograms[i].remainingQuantity > 0)){
                                    currentPrograms[i].remainingQuantity -= addQuantity;
                                    addRedeemProduct(selectedProduct, selectedSizeCode, addQuantity, template);
                                } else if ((addQuantity > currentPrograms[i].remainingQuantity) && (currentPrograms[i].remainingQuantity > 0)){
                                    currentPrograms[i].remainingQuantity = 0;
                                    addRedeemProduct(selectedProduct, selectedSizeCode, currentPrograms[i].remainingQuantity, template);
                                } 
                            } else if (orderItem.quantity < loyaltyOrderItem.quantity){
                                let reduceQuantity = loyaltyOrderItem.quantity - orderItem.quantity;
                                currentPrograms[i].remainingQuantity += reduceQuantity;
                                addRedeemProduct(selectedProduct, selectedSizeCode, -1*reduceQuantity, template);
                            }
                        }else {
                            currentPrograms[i].remainingQuantity -= selectedQuantity;
                            addRedeemProduct(selectedProduct, selectedSizeCode, selectedQuantity, template);
                        }
                    }
                }
            }
        }    
        // console.log("current programs: ", currentPrograms);
        template.existingQuantityLoyalty.set(currentPrograms);
    }

    //amount based gift cards
    let orderSubtotals = (calculateOrderTotals(template, template.orderItems.all()));
    var paymentDueAmount = orderSubtotals.total;
    let giftCards = template.existingAmountLoyalty.get();

    giftCardsBalances = _.pluck(giftCards, 'remainingAmount');
    
    if(giftCardsBalances){
        // console.log('giftcards: ', giftCardsBalances);
        for (card = 0; card < giftCardsBalances.length; card++){
            if(giftCards[card].prePurchase==true){
                let cardPrice = LoyaltyPrograms.findOne({_id: giftCards[card].programId}).price;
                // console.log('card price: ', cardPrice);
                if((paymentDueAmount - cardPrice) <= giftCardsBalances[card]){
                    giftCardsBalances[card] = giftCardsBalances[card] - (paymentDueAmount - cardPrice);
                    paymentDueAmount = 0 + cardPrice;
                } else {
                    paymentDueAmount = paymentDueAmount - giftCardsBalances[card] + cardPrice;
                    giftCardsBalances[card] = 0;                 
                }
                // console.log('payment due: ', paymentDueAmount);
            } else {
                if(paymentDueAmount <= giftCardsBalances[card]){
                    giftCardsBalances[card] -=paymentDueAmount;
                    paymentDueAmount = 0;
                } else {
                    paymentDueAmount -= giftCardsBalances[card];
                    giftCardsBalances[card] = 0;                 
                }
            }
        }
        
    } 

    template.paymentDueAmount.set(paymentDueAmount);

    let percentagePrograms = template.existingPercentageLoyalty.get();
    
    if(percentagePrograms){
        for (i=0; i<percentagePrograms.length; i++){
            let currentProgramProducts = percentagePrograms[i].productSet || [];
            for (j=0; j<currentProgramProducts.length; j++){
                let programProduct = currentProgramProducts[j];
                if (selectedProduct._id == programProduct.productId){
                    // console.log("product match");
                    // console.log(programProduct.sizeCodes, selectedSizeCode);
                    if(_.contains(programProduct.sizeCodes, selectedSizeCode)){
                        // console.log("size code applies to program");
                        let orderItemKey = selectedSizeCode + "-" + selectedProduct._id;
                        let orderItem = template.orderItems.get(orderItemKey);
                        let loyaltyOrderItemKey = "Redeem-"+selectedSizeCode+"-"+selectedProduct._id;
                        let loyaltyOrderItem = template.orderItems.get(loyaltyOrderItemKey);

                        // console.log(orderItem, loyaltyOrderItem);
                        let discountPercent = percentagePrograms[i].creditPercent/100;

                        if(loyaltyOrderItem){
                            if (orderItem.quantity > loyaltyOrderItem.quantity){
                                let addQuantity = orderItem.quantity - loyaltyOrderItem.quantity;
                                addRedeemProduct(selectedProduct, selectedSizeCode, addQuantity, template, discountPercent);
                            } else if (orderItem.quantity < loyaltyOrderItem.quantity){
                                let reduceQuantity = loyaltyOrderItem.quantity - orderItem.quantity;
                                addRedeemProduct(selectedProduct, selectedSizeCode, -1*reduceQuantity, template, discountPercent);
                            }
                        }else {
                            addRedeemProduct(selectedProduct, selectedSizeCode, selectedQuantity, template, discountPercent);
                        }
                    }
                }
            }
        }    
    }

   
    if(getTallyPrograms(template)){
        let tallyPrograms = template.existingTallyPrograms.get();
        for (i=0; i<tallyPrograms.length; i++){
            let currentProgramProducts = tallyPrograms[i].productSet || [];
            for (j=0; j<currentProgramProducts.length; j++){
                let programProduct = currentProgramProducts[j];
                if (selectedProduct._id == programProduct.productId){
                    // console.log("product match");
                    // console.log(programProduct.sizeCodes, selectedSizeCode);
                    if(_.contains(programProduct.sizeCodes, selectedSizeCode)){
                        // console.log("size code applies to program");
                        let orderItemKey = selectedSizeCode + "-" + selectedProduct._id;
                        let orderItem = template.orderItems.get(orderItemKey);
                        let loyaltyOrderItemKey = "Redeem-"+selectedSizeCode+"-"+selectedProduct._id;
                        let loyaltyOrderItem = template.orderItems.get(loyaltyOrderItemKey);

                        // console.log(orderItem, loyaltyOrderItem);

                        if(loyaltyOrderItem){
                            if(orderItem.quantity < (1 + tallyPrograms[i].tallyThreshold - tallyPrograms[i].customerTally)){
                                addRedeemProduct(selectedProduct, selectedSizeCode, 0, template);
                            }
                            // if (orderItem.quantity > loyaltyOrderItem.quantity){
                                // tallyPrograms[i].customerTally += orderItem.quantity;
                                // if(tallyPrograms[i].customerTally > tallyPrograms[i].tallyThreshold){
                                //     addRedeemProduct(selectedProduct, selectedSizeCode, 1, template);
                                // }

                                //-- can only do one redeem per purchase
                            // } else if (orderItem.quantity < loyaltyOrderItem.quantity){
                                // tallyPrograms[i].customerTally = tallyPrograms[i].tallyThreshold;
                                // addRedeemProduct(selectedProduct, selectedSizeCode, 0, template);
                            // }
                        }else {
                            tallyPrograms[i].customerTally += orderItem.quantity;
                            
                            if(tallyPrograms[i].customerTally > tallyPrograms[i].tallyThreshold){
                                addRedeemProduct(selectedProduct, selectedSizeCode, 1, template);
                                tallyPrograms[i].customerTally = 0;
                            }
                        }
                    }
                }
                // console.log(tallyPrograms[i].customerTally, tallyPrograms[i].tallyThreshold);
            }
        }
        template.existingTallyPrograms.set(tallyPrograms);
    }

    // console.log(tallyPrograms);

    //percentage based discount loyalty cards are calculated with ordertotals calculation and it takes highest % discount

};

deleteIfAnyRedeemProduct = function(productId, template){
    let key = 'Redeem-'+productId;
    let existingItem = template.orderItems.get(key);
    if (existingItem){
        template.orderItems.delete(key);
    }
};

deleteAllExistingRedeemItems = function(template){
    let allOrderItems = _.keys(template.orderItems.all());
    if (allOrderItems){
        for (i = 0; i < allOrderItems.length; i++){
            if (isThisLoyaltyRedeemItem(allOrderItems[i])){
                template.orderItems.delete(allOrderItems[i]);
            }
        }
    }
};

addRedeemProduct = function(selectedProduct, selectedSizeCode, selectedQuantity, template, discountPercent){ //discount percent in decimal
    var redeemProduct = selectedProduct;
    var selectedSize = _.find(redeemProduct.sizes, function (size) {
        return size.code === selectedSizeCode;
    });

    if(!discountPercent){
        selectedSize.price = selectedSize.price*(-1);
    } else {
        selectedSize.price = selectedSize.price*(-1)*discountPercent;
    }

    redeemProduct.sizes = [selectedSize];
    redeemProduct.name = "Redeem - " + redeemProduct.name;
    redeemProduct._id = "Redeem-"+selectedSizeCode+"-"+redeemProduct._id;


    if (selectedSize && selectedSize.price) {
        let addItem = true;
        let key = redeemProduct._id;
        let orderItem = template.orderItems.get(key);

        if (orderItem) {
            if(selectedQuantity === 0) {
                addItem = false;
            } else {
                orderItem["quantity"] += selectedQuantity;
            }
        } else {
            orderItem = createOrderItem(redeemProduct, selectedSize, selectedQuantity, [], template);
        }

        // set/update order-item
        if(addItem) {
            orderItem.currentKey = fullItemKey(orderItem);
            template.orderItems.set(key, orderItem);
            template.itemIdCounter.set(template.itemIdCounter.get() + 1);
            // console.log('added redeem order item');
            // console.log(key, orderItem);
        } else {
            removeProductItem(key, template);
        }
    }
};

checkOrderForLoyaltyCreditItems = function(template){
    let orderItems = _.values(template.orderItems.all());
    if(orderItems){
        var selectedProduct;
        var selectedSizeCode;
        var selectedQuantity;
        for (itemNum=0; itemNum<orderItems.length; itemNum++){
            selectedProduct = orderItems[itemNum].product;
            selectedSizeCode = orderItems[itemNum].size.code;
            selectedQuantity = orderItems[itemNum].quantity;
            applyAnyLoyaltyCredits(selectedProduct, selectedSizeCode, selectedQuantity, template);
        }
    }
};

isThisLoyaltyRedeemItem = function(productId){
    if(productId.substring(0,6)=="Redeem"){
        return true;
    } else {
        return false;
    }
};

anyOrderGiftCards = function(giftCards){
    if (giftCards){
        return true;
    } else {
        return false;
    }
};

autoRedeemSingleItemProgram = function(programId, template){
    let redeemProgram = LoyaltyPrograms.findOne({_id: programId}) || {};
    if(redeemProgram.products.length == 1){
        if(redeemProgram.products[0].sizeCodes.length == 1){
            //AUTO REDEEM THAT PRODUCT UNLESS IT'S ALREADY ADDED

            let candidateProductId = redeemProgram.products[0].productId;
            // let candidateProduct = _.find(template.lists.get(PRODUCTS), function(prod){ return prod._id == candidateProductId});
            let candidateProduct = Products.findOne({_id: candidateProductId});
            let candidateSize = _.find(candidateProduct.sizes, function(size){
                return size.code == redeemProgram.products[0].sizeCodes[0];
            });
            let candidateKey = null;
            let existingOrderItem = null;

            // if(candidateProduct.sizes.length === 1) {
            //     candidateSize = candidateProduct.sizes[0];
            // }

            let candidateOrderItem = createOrderItem(candidateProduct, candidateSize, null, [], template);

            if(candidateSize) {
                candidateKey = candidateSize.code + "-" + candidateProduct._id;
            }

            if(candidateKey) {
                existingOrderItem = template.orderItems.get(candidateKey);
            }

            if(existingOrderItem) {
                // candidateOrderItem = existingOrderItem;
                // candidateOrderItem.quantity = 1;
                return;
            }
            // } else {
            //     let existingItems = [];

            //     _.each(template.orderItems.all(), function (orderItem, key) {
            //         if(key.endsWith("-" + candidateProduct._id)) {
            //             existingItems.push(orderItem);
            //         }
            //     });

            //     if(existingItems.length === 1) {
            //         candidateOrderItem = existingItems[0];
            //     }
            // }

            //add order item
            template.candidateOrderItem.set(candidateOrderItem);

            // let anyAddOns = candidateProduct.addOns || [];

            //open modal if more than one size
            // if (candidateProduct.sizes.length === 1 && anyAddOns.length===0) {
            // if (candidateProduct.sizes.length === 1) {
                // let candidateOrderItem = template.candidateOrderItem.get();
            // console.log('auto redeem: ', candidateOrderItem);
            if(candidateOrderItem && candidateOrderItem.size) {
                selectProduct(candidateOrderItem.product, candidateOrderItem.size.code, candidateOrderItem.quantity, null, template);
                checkOrderForLoyaltyCreditItems(template);
            }
                // template.expandedProduct.set();
            // } else {
            //     template.expandedProduct.set(candidateProduct);
                // if(candidateProduct.group){
                //     $('#select-product-options').openModal();
                // }
            // }
        }
    }
};

checkAutoRedeemForCustomer = function(customerObj, template){
    if(customerObj){
        if(customerObj.loyaltyPrograms){
            for(k=0; k< customerObj.loyaltyPrograms.length; k++){
                autoRedeemSingleItemProgram(customerObj.loyaltyPrograms[0].programId, template);
            }
        }
    }
};

incrementOrderLoyaltyBalance = function(candidateOrderItem, template){

};

orderHelpers = {
    getSortedFilteredProductsAndGroups: function (){
        let generalFindCriteria = {};
        let sortCriteria = 'categories';
        
        generalFindCriteria.status = "Active";
        
        let categoryFilter = Template.instance().ordersSelectedCategoryFilter.get();

        // return Maestro.Client.getProductsAndGroups(generalFindCriteria, 'categories', categoryFilter);
        return Maestro.Client.getProductsAndGroupsOptimize(generalFindCriteria, sortCriteria, categoryFilter);
    },

    getCustomers: function(){
        return Maestro.Customers.SearchCustomerNames(Template.instance().customerSearchCriteria.get("NAME"), false, true);
    },

    productSearchEnabled: function(){
        return Template.instance().enableProductSearch.get();
    },

    getCategoryColor: function(categoryName, colorCode){
        let allowedColors = Maestro.Products.Categories.Colors;
        let categoryFilter = Template.instance().ordersSelectedCategoryFilter.get();

        if (_.find(allowedColors, function(color){return color.key == colorCode;})){
            if (categoryName == categoryFilter.primary){
                return "background-color:#" + colorCode + ";" + ' min-height:60px;';
            } else {
                return "background-color:#" + colorCode + ";" + ' min-height:30px;';
            }
        } else {
            if (categoryName == categoryFilter.primary){
                return "background-color:#bdbdbd;" + ' min-height:60px;';
            } else {
                return "background-color:#bdbdbd;" + ' min-height:30px;';
            }
        }
    },

    // getCategoryColor: function(categoryName, colorCode){
    //     let allowedColors = Maestro.Products.Categories.Colors;
    //     let categoryFilter = Template.instance().ordersSelectedCategoryFilter.get();

    //     if (_.find(allowedColors, function(color){return color.key == colorCode;})){
    //         if (categoryName == categoryFilter.primary){
    //             return 'background-color:lightblue;';
    //         } else {
    //             return "background-color:#" + colorCode;
    //         }
    //     } else {
    //         if (categoryName == categoryFilter.primary){
    //             return 'background-color:lightblue;';
    //         } else {
    //             return "background-color:#bdbdbd";
    //         }
    //     }
    // },

    isCategorySelected: function(categoryName){
        let categoryFilter = Template.instance().ordersSelectedCategoryFilter.get();

        if (categoryName == categoryFilter.primary){
            return true;
        }
        return false;
    },

    isSecondaryCategorySelected: function(categoryName){
        let categoryFilter = Template.instance().ordersSelectedCategoryFilter.get();

        if (categoryName == categoryFilter.secondary){
            return true;
        }
        return false;
    },

    isThisSelectedGroup: function(name){
        let chosenGroup = Template.instance().selectedCandidateGroup.get();
        if (chosenGroup){
            let chosenGroupName = chosenGroup.name;
            if (name == chosenGroupName){
                return true;
            } else {
                return false;
            }
        } else {return false;}
    },

    anyAddOns: function(addOns){
        if(addOns){
            if(addOns.length){
                return true;
            } else {
                return false;
            }
        }
    },

    getAddOnInfo: function(addOnId){
        return ProductAddons.findOne({_id: addOnId});
    },

    sizeNotSelected: function(){
        let candidateOrderItem = Template.instance().candidateOrderItem.get();

        if(candidateOrderItem.size) {
            return false;
        } else {
            return true;
        }
    },

    getSelectedAddOns: function(){
        let candidateOrderItem = Template.instance().candidateOrderItem.get();

        return candidateOrderItem.addOns;
    },

    selectedProduct: function() {
        return Template.instance().selectedProduct.get();
    },

    isSelectedProduct: function(productId) {
        currentSelectedProduct= Template.instance().selectedProduct.get();
        if(currentSelectedProduct) {
            return currentSelectedProduct._id === productId;
        }
        return false;
    },

    isThisProductExpanded: function(product){
        let currentCandidate = Template.instance().expandedProduct.get();
        if(currentCandidate){
            return currentCandidate._id === product._id;
        }
        return false;
    },

    isSelectedCustomer: function(customerId){
        let chosenCustomer = Template.instance().orderCustomer.get();
        if (chosenCustomer){
            let chosenCustomerId = chosenCustomer._id;

            if (customerId == chosenCustomerId){
                return 'background-color:lightblue;'
            } else {
                return;
            }
        } else {return;}
    },

    loyaltyProgram: function(){
        let selectedProgramType = Template.instance().orderLoyaltyType.get();
        if (selectedProgramType == 'All'){
            return LoyaltyPrograms.find({status:'Active'}).fetch();
        } else {
            let filteredList = _.filter(LoyaltyPrograms.find({status:'Active'}).fetch(), function(program){
                return program.programType.type == selectedProgramType;
            });
            return filteredList;
        }
    },

    getExpiryDays: function(expiry){
        if (expiry){
            return "Expires " + expiry + " days after purchase";
        } 
    },

    getExpiryDate: function(expiry){
        if (expiry > new Date(1969, 12, 31)){
            return "Expires on "+expiry.toDateString()+".";
        }
    },

    getLoyaltyName: function(programId){
        let loyaltyProgram = LoyaltyPrograms.findOne({_id: programId});
        // console.log(LoyaltyPrograms.findOne({_id: programId}));
        return loyaltyProgram.name;
    },

    getLoyaltyBalance: function(remainingQuantity, remainingAmount){
        if(remainingAmount){
            return "Balance $"+ remainingAmount.toFixed(2);
        } else if (remainingQuantity){
            return "Balance of "+remainingQuantity+" items";
        }
    },

    getLoyaltyExpiration: function(programId, boughtOn){
        let purchasedOn= new Date(boughtOn);
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
                return "Program Expired";
            } else {
                return remainingDays + " days left till expiry";
            }
        } else if (loyaltyProgram.expiryDate){
            if (todayDate>loyaltyProgram.expiryDate){
                return "Program Expired";
            } else {
                return "Expires on " + loyaltyProgram.expiryDate.toDateString();
            }
        }
    },
    itemNotLoyalty: function(itemId){
        return !isThisLoyalty(itemId);
    },

    itemNotLoyaltyRedeem: function(productId){
        return !isThisLoyaltyRedeemItem(productId);
    },

    primaryCategories: function(){
        return Maestro.Client.getPrimaryCategories();
    },

    secondaryCategories: function(primaryCategory){
        return Maestro.Client.getSecondaryCategories(primaryCategory);
    },

    categories: function(){
        return ProductCategories.find({});
    },
    categoryColor: function () {
        var product = this;
        if(!_.isEmpty(product.categories)) {
            return Maestro.Client.getCategoryColor(product.categories[0]);
        }
        return "amethyst";
    },
    customers: function () {
        return Template.instance().lists.get(CUSTOMERS);
    },
    noItems: function () {
        return _.isEmpty(Template.instance().orderItems.all());
    },
    defaultSize: function () {
        return this.price > 0 && Maestro.Client.isProductSizePreferred(this.code);
    },
    itemsList: function () {
        console.log(_.values(Template.instance().orderItems.all()));
        return _.sortBy(_.values(Template.instance().orderItems.all()),'itemNumber');
    },
    itemTotal: function () {
        return getItemTotal(this);
    },
    orderSubtotal: function () {
        return Template.instance().orderTotals.get("subtotal");
    },
    orderDiscount: function () {
        return Template.instance().orderTotals.get("discount");
    },
    anyDiscounts: function(){
        let discount = Template.instance().orderTotals.get("discount");
        if (discount) {
            return true;
        } else {
            return false;
        }
    },
    anyGiftCards: function(){
        return anyOrderGiftCards(Template.instance().existingAmountLoyalty.get());
    },
    orderAdjustments: function () {
        return Template.instance().orderTotals.get("adjustments");
    },
    orderTax: function () {
        return Template.instance().orderTotals.get("tax");
    },
    orderTotal: function () {
        return Template.instance().orderTotals.get("total");
    },
    orderCashTotal: function () {
        return Template.instance().orderTotals.get("cash-total");
    },
    orderPaymentDue: function(){
        return Template.instance().paymentDueAmount.get();
    },
    orderCashPaymentDue: function(){
        return Maestro.Payment.CashRounding(Template.instance().paymentDueAmount.get());
    },
    cashAmountGiven: function(){
        return Template.instance().cashAmountGiven.get();
    },
    giftCardUsed: function(){
        return Template.instance().orderTotals.get("total") - Template.instance().paymentDueAmount.get();
    },
    cashChangeDue: function(){
        if(Template.instance().cashAmountGiven.get()){
            if (anyOrderGiftCards(Template.instance().existingAmountLoyalty.get())){
                return Template.instance().cashAmountGiven.get() - Maestro.Payment.CashRounding(Template.instance().paymentDueAmount.get());
            } else {
                return Template.instance().cashAmountGiven.get() - Template.instance().orderTotals.get("cash-total");
            }
        } else {
            return 0.00;
        }
    },
    orderCashRounding: function () {
        return Template.instance().orderTotals.get("cash-rounding");
    },
    paymentMethods: function () {
        // return [Maestro.Payment.Methods[0],Maestro.Payment.Methods[1]];
        return Maestro.Payment.Methods;
    },
    isSelectedPaymentMethod: function (currentMethod) {
        return currentMethod === Template.instance().paymentMethod.get();
    },
    selectedPaymentMethod: function () {
        return Template.instance().paymentMethod.get();
    },
    paymentConfirmed: function () {
        return !!Template.instance().paymentMethod.get();
    },
    isPaymentDisabled: function () {
        return !Template.instance().paymentMethod.get() ? "disabled" : "";
    },

    getPaymentMethodIcon: function(){
        if(Template.instance().paymentMethod.get() == "card"){
            return 'credit_card';
        } else if (Template.instance().paymentMethod.get() == "cash"){
            return 'local_atm';
        }
    },
    orderCustomer: function () {
        let orderCustomer = Template.instance().orderCustomer.get();
        if(orderCustomer){
            return Customers.findOne({_id: orderCustomer._id});
        }
    },
    processedOrderCustomer: function() {
        return Template.instance().previousOrderCustomer.get();
    },
    getActivePrograms: function(){
        return Template.instance().existingCustomerLoyaltyPrograms.get();
    },

    getCustomerActivePrograms: function(customerId){
        return _.reject(Customers.findOne({_id: customerId}).loyaltyPrograms, function(program){return program.expired;});
    },

    thisProgramIsApplied: function(applyFlag){
        return applyFlag;
    },

    loyaltyPrograms: function () {
        return LoyaltyPrograms.find({});
    },
    applicableLoyaltyPrograms: function () {
        var customer = this;
        // console.log("customer for loyalty!! ", customer);
    },

    getLoyaltyOrderItemProgram: function(programId){
        let allOrderLoyaltyItems = Template.instance().orderLoyaltyItems.get();
        return _.findWhere(allOrderLoyaltyItems, {_id: programId});
    },

    emailReceiptSelected: function(){
        return Template.instance().emailReceiptFlag.get();
    },

    printReceiptSelected: function(){
        // console.log(Template.instance().printReceiptFlag.get());
        return Template.instance().printReceiptFlag.get();
    },

    showCashPaymentInfo: function(){
        if(Template.instance().showPaymentInfoFor.get() == "cash"){
            return true;
        }
        return false;
    },

    showCardPaymentInfo: function(){
        if(Template.instance().showPaymentInfoFor.get() == "card"){
            return true;
        }
        return false;
    },

    showLoyaltyInfo: function(){
        if(Template.instance().showPaymentInfoFor.get() == "loyalty"){
            return true;
        }
        return false;
    },

    showAdjustmentAmountInfo: function(){
        if(Template.instance().showPaymentInfoFor.get() == "adjustment"){
            return true;
        }
        return false;
    },

    isAdjustmentSelected: function(percent){
        if(Template.instance().adjustmentAmount.get() == percent){
            return true;
        }
        return false;
    },

    getAdjustmentValue: function(){
        return Template.instance().adjustmentAmount.get();
    },

    showAdjustmentAmount: function(){
        let subtotal = Template.instance().orderTotals.get("subtotal");
        return Template.instance().adjustmentAmount.get()/100 * subtotal;
    },

    getOrderNumber: function(){
        let locationId = Maestro.Client.locationId();
        let dailyOrderNumber = Maestro.Order.GetNextOrderNumber(locationId);
        if (dailyOrderNumber < 10){
            return "#00"+String(dailyOrderNumber);
        } else if (dailyOrderNumber <100){
            return "#0"+String(dailyOrderNumber);
        } else {
            return "#"+String(dailyOrderNumber);
        }
    },

    getThisOrderItem: function(){
        return Template.instance().thisOrderItem.get();
    },

    isCustomerSearchTabMode: function(){
        if(Template.instance().customerTabMode.get() == "search"){
            return true;
        }
        return false;
    },

    isCustomerCreateTabMode: function(){
        if(Template.instance().customerTabMode.get() == "create"){
            return true;
        }
        return false;
    }
};

orderEvents = {
    'click .goToProgramsTab': function(event, template){
        $('ul.tabs').tabs('select_tab', 'order-loyalty');
    },

    'click .goToCustomersTab': function(event, template){
        $('ul.tabs').tabs('select_tab', 'order-customers');  
    },

    'click .goToCustomerSearchTab': function(event, template){
        $('ul.tabs').tabs('select_tab', 'searchCustomer');
        
        if(!template.orderCustomer.get()){
            document.getElementById('customer-search').focus();
            document.getElementById('customer-search').select();
        }

        template.customerTabMode.set('search');    
    },

    'click .goToCustomerCreateTab': function(event, template){
        $('ul.tabs').tabs('select_tab', 'newCustomerAdd');

        template.customerTabMode.set('create');
    },

    'click .goToCustomerEditTab': function(event, template){
        $('ul.tabs').tabs('select_tab', 'order-customers');  
        $('ul.tabs').tabs('select_tab', 'editCustomerDetails');

        template.customerTabMode.set('edit');
    },

    'click .selectLoyaltyType': function(event, template){
        let programType = $(event.target).data("programtype");
        Template.instance().orderLoyaltyType.set(programType);
    },

    'click .selectCategory': function(event, template){
        let categoryName = $(event.target).data('category');
        template.ordersSelectedCategoryFilter.set({primary: categoryName});
    },

    'click .selectSecondaryCategory': function(event, template){
        let secondaryCategoryName = $(event.target).data('secondcategory');
        var categoryFilter = template.ordersSelectedCategoryFilter.get();

        if(categoryFilter.secondary == secondaryCategoryName){
            delete categoryFilter.secondary;
        } else {
            categoryFilter.secondary = secondaryCategoryName;
        }

        template.ordersSelectedCategoryFilter.set(categoryFilter);

    },

    'click .selectLoyaltyProgram': function(event, template){
        event.preventDefault();
        let programId = $(event.target).data("programid");
        let loyaltyProgram = LoyaltyPrograms.findOne({_id:programId});
        let loyaltyProduct = loyaltyProgram.purchaseLoyalty;
        loyaltyProduct._id = programId;

        let candidateProduct = loyaltyProduct;
        let candidateSize = null;
        let candidateKey = null;
        let existingOrderItem = null;

        if(candidateProduct.sizes.length === 1) {
            candidateSize = candidateProduct.sizes[0];
        }

        let candidateOrderItem = createOrderItem(candidateProduct, candidateSize, null, [], template);

        if(candidateSize) {
            candidateKey = candidateSize.code + "-" + candidateProduct._id;
        }

        if(candidateKey) {
            existingOrderItem = template.orderItems.get(candidateKey);
        }

        if(existingOrderItem) {
            candidateOrderItem = existingOrderItem;
            candidateOrderItem.quantity = 1;
            // incrementOrderLoyaltyBalance(candidateOrderItem, template);
            Materialize.toast('Multiples of Loyalty Programs Currently Not Available', 3000);
            return;
        } else {
            let existingItems = [];

            _.each(template.orderItems.all(), function (orderItem, key) {
                if(key.endsWith("-" + candidateProduct._id)) {
                    existingItems.push(orderItem);
                }
            });

            if(existingItems.length === 1) {
                candidateOrderItem = existingItems[0];
            }
        }

        //add order item
        template.candidateOrderItem.set(candidateOrderItem);

        //add entire program to loyatly item
        var selectedLoyalty = template.orderLoyaltyItems.get();
        loyaltyProgram.apply = false;
        selectedLoyalty.push(loyaltyProgram);
        template.orderLoyaltyItems.set(selectedLoyalty);

        //open modal if more than one size
        if (candidateProduct.sizes.length === 1) {
            let candidateOrderItem = template.candidateOrderItem.get();
            if(candidateOrderItem && candidateOrderItem.size) {
                selectProduct(candidateOrderItem.product, candidateOrderItem.size.code, candidateOrderItem.quantity, null, template);
            }
        } 
        // else {
        //     $('#select-product-options').openModal();
        // }
    },

    'click i.delete-item': function (event, template) {
        event.preventDefault();
        let orderItem = this;
        let key = this.size.code + "-" + this.product._id + getAddOnKey(orderItem.addOns);

        removeProductItem(key, template);
        deleteIfAnyRedeemProduct(key, template);

        if(LoyaltyPrograms.findOne({_id: this.product._id})){
            let allOrderLoyaltyItems = Template.instance().orderLoyaltyItems.get();
            setPrePurchaseLoyaltyApplyStatus(_.findWhere(allOrderLoyaltyItems, {_id: this.product._id}), false, template);
            removeLoyaltyItem(this.product._id, template);
            checkOrderForLoyaltyCreditItems(template);
        }
    },

    'click .enableProductSearch': function(event, template){
        if (template.enableProductSearch.get()){
            template.enableProductSearch.set(false);

        } else {
            template.enableProductSearch.set(true);
        }
    },

    'keyup #product-search': function (event, template) {
        let searchTerm = $(event.currentTarget).val();
        setProductSearchCriteria(searchTerm, template);
    },

    'keyup #customer-search': function (event, template) {
        let searchTerm = $(event.currentTarget).val();
        if(searchTerm.length>1){
            template.customerSearchCriteria.set("NAME", searchTerm);
            setCustomerSearchCriteria(searchTerm, template);
        }
    },



    // 'click .categoryFilter': function(event, template) {
    //     let searchTerm = $(event.target).data("category");
    //     setProductCategorySearchCriteria(searchTerm, template);
    // },

    'click .alphabetFilter': function(event, template){
        let searchTerm = $(event.target).data("alphabet");
        template.customerSearchCriteria.set("NAME", "Alphabet:"+searchTerm);
        setCustomerAlphabetSearchCriteria(searchTerm, template);
    },

    // 'click .clear-product-search': function (event, template) {
    //     clearProductSearchCriteria(template);
    // },

    'click .clear-customer-search': function (event, template) {
        clearCustomerSearchCriteria(template);

    },
    'click .select-customer': function (event, template) {
        clearCustomerInfo(template);
        let customer = Customers.findOne({_id: this._id});
        template.orderCustomer.set(customer);
        getExistingCustomerLoyaltyPrograms(customer, template);
        // checkAutoRedeemForCustomer(this, template);
        // console.log(customer);
    },

    'click .doNotApplyThisProgram': function(event, template){
        setLoyaltyProgramApplyStatus(this, false, template);
    },

    'click .applyThisProgram': function(event, template){
        setLoyaltyProgramApplyStatus(this, true, template);
    },

    'click .applyThisProgramPrePurchase': function(event, template){
        setPrePurchaseLoyaltyApplyStatus(this, true, template);
    },

    'click .doNotApplyThisProgramPrePurchase': function(event, template){
        setPrePurchaseLoyaltyApplyStatus(this, false, template);
    },

    // 'click #add-Customer':function(event, target){
    //     $('#addNewCustomerModal').openModal();
    // },

    // 'click #cancel-create-customer':function(event, target){
    //     $('#addNewCustomerModal').closeModal();
    // },

    'click .select-payment-method': function (event, template) {
        template.paymentMethod.set($(event.target).data('paymentkey'));
    },

    'click .showCashPaymentInfo': function(event, template){
        template.showPaymentInfoFor.set('cash');
    },

    'click .showCardPaymentInfo': function(event, template){
        template.showPaymentInfoFor.set('card');
    },

    'click .showLoyaltyPaymentInfo': function(event, template){
        template.showPaymentInfoFor.set('loyalty');
    },

    'click .showAdjustmentInfo': function(event, template){
        template.showPaymentInfoFor.set('adjustment');
    },
    
    'click .open-addon-select': function(event, template){
        template.thisOrderItem.set(this);
        $('#select-addon-options').openModal();
    },

    'click #delete-order': function(event, template){
        event.preventDefault();

        console.log('deleting order');
        //reset / re-initialize order screen
        clearOrder(template);
    },

    'click .addToCashAmountGiven': function(event,template){
        let amount = Number($(event.target).data('cashamount'));
        let currentAmount = template.cashAmountGiven.get();
        template.cashAmountGiven.set(currentAmount + amount);
    },

    'click .addToCashDigitGiven': function(event, template){
        let digit = $(event.target).data('cashdigit');
        let currentAmount = template.cashAmountGiven.get();
        let newAmount = Number(String((currentAmount*100).toFixed(0)) + digit)/100;
        template.cashAmountGiven.set(newAmount);
    },

    'click .clearCashAmountGiven': function(event, template){
        template.cashAmountGiven.set(0);
    },

    'click .manualAdjustment': function(event, template){
        let adjustment = Number($(event.target).data('percent'));
        template.adjustmentAmount.set(adjustment);
        checkOrderForLoyaltyCreditItems(template);
    },

    'click .decreaseAdjustment': function(event, template){
        let currentValue = template.adjustmentAmount.get();
        currentValue = currentValue - 5;
        if (currentValue >= 0) {
            template.adjustmentAmount.set(currentValue);
        } else {
            template.adjustmentAmount.set(0);
        }
    },

    'click .increaseAdjustment': function(event, template){
        let currentValue = template.adjustmentAmount.get();
        currentValue = currentValue + 5;
        if (currentValue <= 100) {
            template.adjustmentAmount.set(currentValue);
        } else {
            template.adjustmentAmount.set(100);
        }
    },

    'mouseup .sliderManualAdjustment': function(event, template){
        let adjustment = Number(document.getElementById('setAdjustmentValue').value);
        template.adjustmentAmount.set(adjustment);
        checkOrderForLoyaltyCreditItems(template);
    },

    'click #complete-checkout': function (event, template) {
        event.preventDefault();

        if(!Maestro.Client.locationId()){
            Materialize.toast('Select a location first', 2000);
            return ;
        }

        //check location and business

        //TODO check device permissions

        //check if order items exist
        var orderItems = _.map(_.values(template.orderItems.all()), function (item, index) {
            return {
                product: _.pick(item.product, '_id', 'name', 'sizes'),
                size: item.size,
                addOns: _.map(item.addOns, function(addon, index){
                    return {
                        _id: addon._id,
                        name: addon.name,
                        price: addon.price
                    };
                }), 
                quantity: item.quantity,
                total: getItemTotal(item)
            };
        });
        
        //// customer
        var customerId = template.orderCustomer.get() && template.orderCustomer.get()["_id"] || null;

        ////totals
        var orderSubtotals = template.orderTotals.all();
        var subtotals = {
            subtotal: orderSubtotals["subtotal"],
            discount: orderSubtotals["discount"],
            adjustments: orderSubtotals["adjustments"],
            tax: orderSubtotals["tax"],
            taxComponents: orderSubtotals["taxBreakdown"], 
            total: orderSubtotals["total"]
        };

        ////payment details
        var paymentMethod = template.paymentMethod.get();
        var paymentDetails = {
            method: paymentMethod,
            amount: orderSubtotals.total
        };

        if(paymentMethod === Maestro.Payment.MethodsEnum.cash.key) { //is this cash method of payment
            // paymentDetails.amount = orderSubtotals["cash-total"];
            paymentDetails.rounding = orderSubtotals["cash-rounding"];
        }

        if (template.paymentDueAmount.get() === null){
            if(paymentMethod === Maestro.Payment.MethodsEnum.cash.key){
                paymentDetails.received = orderSubtotals["cash-total"];
            } else {
                paymentDetails.received = paymentDetails.amount;
            }
        } else {
            paymentDetails.received = template.paymentDueAmount.get(); 
        }

        let refDate = new Date();

        let timeBucket = {
            year: refDate.getFullYear(),
            month: refDate.getMonth(),
            day: refDate.getDate(),
            hour: refDate.getHours(),
        };

        var order = {
            businessId: Maestro.Client.businessId(),
            locationId: Maestro.Client.locationId(),
            createdAt: new Date(),
            timeBucket: timeBucket,
            status:'Completed',
            customerId: customerId,
            items: orderItems,
            subtotals: subtotals,
            payment: paymentDetails,
            dailyOrderNumber: Maestro.Order.GetNextOrderNumber(Maestro.Client.locationId()),
            uniqueOrderNumber: Maestro.Order.GetNextUniqueOrderNumber()
        };

        // console.log('daily #: ',  Maestro.Order.GetNextOrderNumber(Maestro.Client.locationId()));
        // console.log('unique #: ', Maestro.Order.GetNextUniqueOrderNumber());

        ///Loyalty programs
        var buyLoyaltyItems = template.orderLoyaltyItems.get();
        var buyLoyaltyDetails = [];

        for (i = 0; i < buyLoyaltyItems.length; i++){
            buyLoyaltyDetails.push({
                programId: buyLoyaltyItems[i]._id,
                remainingQuantity: buyLoyaltyItems[i].programType.quantity,
                remainingAmount: buyLoyaltyItems[i].programType.creditAmount,
                creditPercent: buyLoyaltyItems[i].programType.creditPercentage,
                expired: false,
                boughtOn: new Date(),
                prePurchase: buyLoyaltyItems[i].prePurchase || false 
            });
        }

        var updateExistingPrograms = {
            quantityBased: null,
            amountBased: null
        };

        updateExistingPrograms.quantityBased = template.existingQuantityLoyalty.get() || null;

        var giftCards = template.existingAmountLoyalty.get();
        var giftCardRedeemInfo = [];

        if(giftCards){
            for (i=0; i<giftCards.length; i++){
                giftCardRedeemInfo.push({
                    programId: giftCards[i].programId,
                    redeemedAmount: giftCards[i].remainingAmount - giftCardsBalances[i]
                });

                giftCards[i].remainingAmount = giftCardsBalances[i];
            }
            updateExistingPrograms.amountBased = giftCards;

            order.payment.giftCards = giftCardRedeemInfo;
            order.payment.giftCardTotal = _.reduce(giftCardRedeemInfo, function(memo, card){
                return memo + card.redeemedAmount;
            }, 0.00);
        }

        //Need to reconcile balances of prepurchase applied credits
        var duplicatePrograms = [];

        // console.log('pre duplicate qty filter: ', updateExistingPrograms.quantityBased);

        if(updateExistingPrograms.quantityBased){
            for (k = 0; k < updateExistingPrograms.quantityBased.length; k++){
                if(updateExistingPrograms.quantityBased[k].prePurchase == true){
                    let buyLoyaltyIndex = _.indexOf(buyLoyaltyDetails, _.find(buyLoyaltyDetails, function(program){return program.programId == updateExistingPrograms.quantityBased[k].programId; }));
                    buyLoyaltyDetails[buyLoyaltyIndex].remainingQuantity = updateExistingPrograms.quantityBased[k].remainingQuantity;
                    duplicatePrograms.push(updateExistingPrograms.quantityBased[k]);
                    updateExistingPrograms.quantityBased.splice(k,1);
                }
            }
            // console.log("qty: ", duplicatePrograms);
        }

        
        // updateExistingPrograms.quantityBased = _.without(updateExistingPrograms.quantityBased, duplicatePrograms);
        // console.log('post duplicate qty filter: ', updateExistingPrograms.quantityBased);

        duplicatePrograms = [];

        // console.log('pre duplicate amount filter: ', updateExistingPrograms.amountBased);

        if(updateExistingPrograms.amountBased){
            for (k = 0; k < updateExistingPrograms.amountBased.length; k++){
                if(updateExistingPrograms.amountBased[k].prePurchase == true){
                    let buyLoyaltyIndex = _.indexOf(buyLoyaltyDetails, _.find(buyLoyaltyDetails, function(program){return program.programId == updateExistingPrograms.amountBased[k].programId; }));
                    buyLoyaltyDetails[buyLoyaltyIndex].remainingAmount = updateExistingPrograms.amountBased[k].remainingAmount;
                    duplicatePrograms.push(updateExistingPrograms.amountBased[k]);
                    updateExistingPrograms.amountBased.splice(k,1);
                }
            }
            // console.log("amount: ", duplicatePrograms);
        }

        // updateExistingPrograms.amountBased = _.without(updateExistingPrograms.amountBased, duplicatePrograms);
        // console.log('post duplicate amount filter: ', updateExistingPrograms.amountBased);
        
        duplicatePrograms = [];

        if(customerId){
            let allCustomerProgramsPreOrder = Customers.findOne({_id: customerId}).loyaltyPrograms;
            let allQuantityPrograms = _.filter(allCustomerProgramsPreOrder, function(program){ return (program.remainingQuantity > 0) && (program.expired == false); }) 
            var quantityCardRedeemInfo = [];
        

            if(updateExistingPrograms.quantityBased){
                for (k = 0; k < updateExistingPrograms.quantityBased.length; k++){
                    var afterOrderProgram = updateExistingPrograms.quantityBased[k];
                    var originalProgram = _.find(allQuantityPrograms, function(program){return program.programId == afterOrderProgram.programId;});
                    if(!originalProgram){
                        originalProgram = {
                            programId: afterOrderProgram.programId,
                            remainingQuantity: LoyaltyPrograms.findOne({_id: afterOrderProgram.programId}).programType.quantity
                        };
                    }
                    
                    // console.log(afterOrderProgram);

                    quantityCardRedeemInfo.push({
                        programId: afterOrderProgram.programId,
                        redeemedQuantity: originalProgram.remainingQuantity - afterOrderProgram.remainingQuantity
                    });
                }
                order.payment.quantityCards = quantityCardRedeemInfo;
            }
        }

        if(customerId){
            let customerTally = template.existingTallyPrograms.get();

            let updateCustomerTally = _.map(customerTally, function(tallyObj){
                return {
                    programId: tallyObj.programId,
                    tally: tallyObj.customerTally
                };
            });

            updateExistingPrograms.updateTallyPrograms = updateCustomerTally;
        }

        // console.log(updateExistingPrograms.updateTallyPrograms);

        // console.log('quantity card redeem info: ', order.payment.quantityCards);

        // console.log("buyLoyaltyDetails: ", buyLoyaltyDetails);
        // console.log("updateExistingPrograms: ", updateExistingPrograms);

        let receiptOptions = {
            print: template.printReceiptFlag.get(),
            email: template.emailReceiptFlag.get()
        };

        // console.log("order: ", order);

        let orderId = Maestro.Order.SubmitOrder(order, customerId, buyLoyaltyDetails, updateExistingPrograms, receiptOptions);
        
        if(!!orderId){
            Materialize.toast("Processed", 1000, 'rounded green');
            template.newOrderId.set(orderId);
            Maestro.Order.PrintNewOrderReceipt(template);
        } else {
            Materialize.toast("Error submitting order!", 4000, 'rounded red');
        }

        // if(customerId){
        //     template.previousOrderCustomer.set(Customers.findOne({_id: customerId}));
        //     let $toastContent = $('<a id="viewPreviousOrderCustomerBalance" class="waves-effect waves-teal btn-flat white-text">View Customer Balance</a>');
        //     Materialize.toast($toastContent, 5000);
        //     // $('ul.tabs').tabs('select_tab', 'balanceTab');
        //     // window.setTimeout(function() {
        //     //     $('ul.tabs').tabs('select_tab', 'orderTab');
        //     //     $('ul.tabs').tabs('select_tab', 'order-products');
        //     //     $('ul.tabs').tabs('select_tab', 'searchCustomer');
        //     // }, 3000);
        // // } else {
        // //     $('ul.tabs').tabs('select_tab', 'orderTab');
        // //     $('ul.tabs').tabs('select_tab', 'order-products');
        // //     $('ul.tabs').tabs('select_tab', 'searchCustomer');
        // }

        clearOrder(template);

        $('ul.tabs').tabs('select_tab', 'orderTab');
        $('ul.tabs').tabs('select_tab', 'order-products');
        $('ul.tabs').tabs('select_tab', 'searchCustomer');

    },

    // 'click #begin-checkout': function (event, template) {
    //     if (template.orderLoyaltyItems.get().length && !template.orderCustomer.get()){
    //         Materialize.toast('Select a Customer to Add Loyalty Program', 4000);
    //     } else {
    //         //$('#checkout-order').openModal();
    //         $('#checkout-tabs').tabs('select_tab', 'cash-tab');
    //         $('#checkout-tabs-bottom').tabs('select_tab', 'cash-tab-bottom');
    //     }
    // },

    'click .emailReceipt': function(event, template){
        Meteor.call('emailReceipt');
    },

    'click .deselectEmailReceipt': function(event, template){
        template.emailReceiptFlag.set(false);
    },

    'click .selectEmailReceipt': function(event, template){
        template.emailReceiptFlag.set(true);
    },

    'click .deselectPrintReceipt': function(event, template){
        template.printReceiptFlag.set(false);
    },

    'click .selectPrintReceipt': function(event, template){
        template.printReceiptFlag.set(true);
    },

    'click #viewPreviousOrderCustomerBalance': function(event, template){
        $('ul.tabs').tabs('select_tab', 'balanceTab');
        console.log('going to balance tab');
    },

    // 'click #printReceipt':function(event, template){
    //     printOrderReceipt(template);
    // }
};

///
Template.CreateOrder.onCreated(function () {
    this.layoutTemplate = new ReactiveVar();
    this.layoutTemplateIcon = new ReactiveVar();

    _setLayout(Maestro.Templates.CreateOrderTiles, this);
});

var _setLayout = function (templateName, template) {
    if(templateName) {
        template.layoutTemplate.set(templateName);
        template.layoutTemplateIcon.set(templateName === Maestro.Templates.CreateOrderList ? "view_module" : "view_list");
    }
};

Template.CreateOrder.onRendered(function () {
    dropdownOptions = {
        constrain_width: false,
        belowOrigin: true,
        alignment: 'right'
    };

    $("#change-layout").dropdown(dropdownOptions);

    // console.log(Orders.find().fetch());
});

Template.CreateOrder.helpers({
    layoutTemplate: function () {
        return Template.instance().layoutTemplate.get();
    },
    selectedLayoutIcon: function () {
        return Template.instance().layoutTemplateIcon.get();
    }
});

Template.CreateOrder.events({
    'click #change-layout': function (event, template) {
        event.preventDefault();
        currentLayout = Template.instance().layoutTemplate.get();

        newLayout = Maestro.Templates.CreateOrderTiles;

        if(currentLayout === Maestro.Templates.CreateOrderTiles) {
            newLayout = Maestro.Templates.CreateOrderGrid;
        } else if(currentLayout === Maestro.Templates.CreateOrderGrid) {
            newLayout = Maestro.Templates.CreateOrderList;
        } else {
            newLayout = Maestro.Templates.CreateOrderTiles;
        }

        _setLayout(newLayout, template);
    }
});