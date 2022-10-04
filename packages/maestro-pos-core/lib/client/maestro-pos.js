Maestro.POS = {};

Maestro.POS.OrderItems = {};

Maestro.POS.Calc = {};

Maestro.POS.Tools = {};

Maestro.POS.Loyalty = {};

Maestro.POS.Views = {};

let CUSTOMERS = "Customers";
let CUSTOMER_CRITERIA = ["NAME", "EMAIL", "PHONE"];
let searchableLists = [CUSTOMERS];

var subtotalDefaults = {
    subtotal: 0.00,
    discount: 0.00,
    adjustments: 0.00,
    tax: 0.00,
    taxBreakdown: {},
    total: 0.00
};

///
Maestro.POS.UI = {};

// Maestro.POS.UI.ToggleLargeQuantityField = function(itemId){
//     let quantityField = document.getElementById(itemId + '_large_quantity');
//     if(quantityField.style.display === 'none'){
//         quantityField.style.display = 'block';
//     } else {
//         quantityField.style.display = 'none';
//     }
// };

Maestro.POS.UI.ToggleEditCustomerDetails = function(){
    let newCustomerForm = document.getElementById('editCustomerDetails');
    if (newCustomerForm.style.display === 'none') {
        newCustomerForm.style.display = 'block';
    } else {
        newCustomerForm.style.display = 'none';
    }
};

Maestro.POS.UI.ToggleNewCustomerForm = function(){
    let newCustomerForm = document.getElementById('newCustomerAdd');
    if (newCustomerForm.style.display === 'none') {
        newCustomerForm.style.display = 'block';
        Maestro.POS.UI.FocusOnField('customer-name');
    } else {
        newCustomerForm.style.display = 'none';
    }
};

Maestro.POS.UI.FocusOnField = function(fieldId){
    // Tracker.afterFlush(function(){
        Tracker.flush();
        let field = document.getElementById(fieldId);
        field.click();
        field.focus();
        field.select();
    // });
};

Maestro.POS.UI.FocusOnCustomerSearchField = function(){
    // Tracker.afterFlush(function(){
        Tracker.flush();
        let nameField = document.getElementById('customer-name-search');
        let emailField = document.getElementById('customer-phone-search');
        let phoneField = document.getElementById('customer-email-search');

        if(!!nameField){
            nameField.click();
            nameField.focus();
            nameField.select();
        } else if(!!emailField){
            emailField.click();
            emailField.focus();
            emailField.select();
        } else if(!!phoneField){
            phoneField.click();
            phoneField.focus();
            phoneField.select();
        }
    // });
};

Maestro.POS.UI.ClearCustomerSearchFields = function(){
    let nameField = document.getElementById('customer-name-search');
    let emailField = document.getElementById('customer-phone-search');
    let phoneField = document.getElementById('customer-email-search');

    if(!!nameField){
        nameField.value = "";
    } else if(!!emailField){
        emailField.value = "";
    } else if(!!phoneField){
        phoneField.value = "";
    }
};

///
var addToSubtotal = function(subtotal, orderItem) {
    return subtotal + Maestro.POS.Tools.getItemTotal(orderItem);
};

var calculateSubtotals = function(template, allItems) {  
    var discount = 0.00;
    var highestPercent = 0;
    let subtotalAll = Maestro.Payment.RoundedNumber(_.reduce(allItems, addToSubtotal, 0.00), 2);

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

    let discountPercent = highestPercent;

    let adjustment = template.adjustmentAmount.get();
    let adjustmentAmount = adjustment/100 * subtotalAll; 

    let taxes = Maestro.Tax.DetermineTax(template, allItems, discountPercent, adjustment);
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

Maestro.POS.Calc.updateOrderTotals = function(template) {
    template.autorun(function (){
        if(template.orderItemsCollection.find({}) && template.orderTotals) {
            let subtotals = subtotalDefaults;

            let allItems = Maestro.POS.OrderItems.getAllItems(template);
            if(!!allItems){
                subtotals = _.extend(subtotalDefaults, Maestro.POS.Calc.calculateOrderTotals(template, allItems));
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


Maestro.POS.Calc.calculateOrderTotals = function (template, allItems) {
    let subtotals = subtotalDefaults;

    if(allItems){
        subtotals = calculateSubtotals(template, allItems);
    }
    return subtotals;
};

//////////////////////////////////////////////////////////////////////////////////

Maestro.POS.initializeOrder = function(template) {
    template.selectedTableId = new ReactiveVar();
    template.selectedTable = new ReactiveVar();
    
    template.selectedSeat = new ReactiveVar();
    template.selectedSeat.set({
        seatNumber: 1,
        tableId: null
    });

    template.rememberOrderType = new ReactiveVar();
    template.orderType = new ReactiveVar();

    template.orderInformation = {};

    template.checkoutSeatSelected = new ReactiveVar();

    template.inOrderEditMode = new ReactiveVar();
    template.checkoutMode = new ReactiveVar ();
    template.editOrder = new ReactiveVar();

    template.ordersSelectedCategoryFilter = new ReactiveVar();
    template.ordersSelectedCategoryFilter.set({primary: 'All'});

    template.seatGrouping = new ReactiveVar();
    template.seatGrouping.set([]);

    template.definedGroups = new ReactiveVar();
    template.ungroupedSeats = new ReactiveVar();
    template.definedGroups.set([]);
    template.ungroupedSeats.set([]);

    // template.customerSearchCriteria = new ReactiveDict();
    // _.each(CUSTOMER_CRITERIA, function (field) {
    //     template.customerSearchCriteria.set(field, "");
    // });

    // template.ordersSelectedAlphabetFilter = new ReactiveVar();
    // template.ordersSelectedAlphabetFilter.set('All');

    Maestro.POS.OrderItems.initialize(template);

    template.orderTotals = new ReactiveDict();

    template.orderSplitType = new ReactiveVar();
    template.orderSplitType.set("TABLE");

    template.orderSplitEquallyBy = new ReactiveVar();
    template.orderSplitEquallyBy.set(1);

    template.paymentMethod = new ReactiveVar();
    template.paymentMethod.set("cash");

    template.paymentDueAmount = new ReactiveVar();
    template.paymentDueAmount.set(null);

    template.adjustmentAmount = new ReactiveVar();
    template.adjustmentAmount.set(0);

    template.cashAmountGiven = new ReactiveVar();
    template.cashAmountGiven.set(0);

    template.tipGiven = new ReactiveVar();
    template.tipGiven.set(0);

    template.giftCardsBalances = [];

    template.searchCustomersList = new ReactiveVar();

    template.orderCustomer = new ReactiveVar();
    template.orderCustomer.set(null);

    template.tableCustomers = new ReactiveVar();
    template.tableCustomers.set(null);

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
    Maestro.POS.Calc.updateOrderTotals(template);

    //initialize searchable product and customer lists
    // template.searchCriteria = new ReactiveDict();
    // _.each(searchableLists, function (searchableItem) {
    //     template.searchCriteria.set(searchableItem, "");
    // });


    // template.lists = new ReactiveDict();
    // _.each(searchableLists, function (searchableItem) {
    //     template.lists.set(searchableItem, []);
    //     search(searchableItem, template);
    // });

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

    template.numberPadFocusTo = new ReactiveVar();
    template.numberPadFocusTo.set('CASHGIVEN');

    template.showSubtotalsDetails = new ReactiveVar();
    template.showSubtotalsDetails.set(false);

    //

    template.openWaiterLoginUnderlay = function(){
        document.getElementById("waiterLoginUnderlay").style.width = "100%";
        document.getElementById("waiterLoginUnderlay").style.height = "100%";
    };

    template.closeWaiterLoginUnderlay = function(){
        document.getElementById("waiterLoginUnderlay").style.width = "0";
        document.getElementById("waiterLoginUnderlay").style.height = "0";
    };

    template.openWaiterLoginPopup = function(){
        document.getElementById("waiterLoginScreen").style.height = "85%";
        document.getElementById("waiterLoginScreen").style.top = "75px";
    };

    template.closeWaiterLogin = function(){
        document.getElementById("waiterLoginScreen").style.top = "0px";
        document.getElementById("waiterLoginScreen").style.height = "0";
    };

    //

    template.openRecentOrderSummaryUnderlay = function(){
        document.getElementById("recentOrderSummaryUnderlay").style.width = "100%";
        document.getElementById("recentOrderSummaryUnderlay").style.height = "100%";
    };

    template.closeRecentOrderSummaryUnderlay = function(){
        document.getElementById("recentOrderSummaryUnderlay").style.width = "0";
        document.getElementById("recentOrderSummaryUnderlay").style.height = "0";
    };

    template.openRecentOrderSummaryPopup = function(){
        document.getElementById("recentOrderSummary").style.width = "40%";
        // document.getElementById("recentOrderSummary").style.top = "75px";
    };

    template.closeRecentOrderSummaryPopup = function(){
        // document.getElementById("recentOrderSummary").style.top = "0px";
        document.getElementById("recentOrderSummary").style.width = "0";
    };



    Maestro.POS.ApplySavedSettings(template);
};

Maestro.POS.OrderItems.initialize = function(template){
    // console.log(template);
    template.orderItemsCollection = new Mongo.Collection(null);
    template.orderItemsCache = new ReactiveVar();
};

Maestro.POS.clearOrder = function(template){

    template.selectedTableId.set(null);
    template.selectedTable.set(null);
    
    template.seatGrouping.set([]);
    template.definedGroups.set([]);
    template.ungroupedSeats.set([]);

    template.selectedSeat.set(null);
    template.selectedSeat.set({
        seatNumber: 1,
        tableId: null
    });

    template.rememberOrderType.set(null);
    template.orderType.set(null);

    template.orderInformation = {};
    // console.log(template.orderInformation);

    template.checkoutSeatSelected.set();

    template.checkoutMode.set(null);

    template.orderSplitType.set("TABLE");
    template.orderSplitEquallyBy.set(1);
    // template.editOrder.set(null);

    // template.inOrderEditMode.set(null);

    // template.orderItems.clear();
    Maestro.POS.OrderItems.clear(template);

    template.paymentMethod.set("cash");

    template.paymentDueAmount.set(null);

    template.adjustmentAmount.set(0);

    template.cashAmountGiven.set(0);
    
    template.numberPadFocusTo.set('CASHGIVEN');
    template.tipGiven.set(0);
    
    template.orderCustomer.set();

    // template.ordersSelectedAlphabetFilter.set('All');

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

    template.giftCardsBalances = [];
    
    // template.searchCustomersList.set([]);

    Maestro.POS.Loyalty.clearCustomerSearch(template);

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

    $('ul.tabs').tabs('select_tab', 'searchCustomer');
    $('ul.tabs').tabs('select_tab', 'order-products');
    template.customerTabMode.set('search');

    Maestro.POS.SVGTableLayout.clearSVGTableSelect(template);

    Maestro.POS.Navigation.goToStartTabs(template);

    Maestro.POS.ApplySavedSettings(template);
};

Maestro.POS.ApplySavedSettings = function(template){
    if(UserSession.get(Maestro.UserSessionConstants.POS_DEFAULT_PAYMENT_METHOD) == "CASH"){
        template.showPaymentInfoFor.set("cash");
        template.paymentMethod.set("cash");
    } 


    if(UserSession.get(Maestro.UserSessionConstants.POS_DEFAULT_PAYMENT_METHOD) == "CARD"){
        template.showPaymentInfoFor.set("card");
        template.paymentMethod.set("card");
    } 


    if(UserSession.get(Maestro.UserSessionConstants.POS_ALWAYS_PRINT_RECEIPT)){
        template.printReceiptFlag.set(true);
    }

};

Maestro.POS.OrderItems.clear = function(template){
    template.orderItemsCollection.remove({});
    template.orderItemsCache.set();
};

/////////////////////////////////////////////////////////////////////////////////////
Maestro.POS.OrderItems.setItem = function(template, key, orderItem, seatNumber){
    // console.log('key: ', key);
    // console.log('order item: ', orderItem);

    let existingItem = Maestro.POS.OrderItems.getItem(template, key, seatNumber);
    if(!!existingItem){
        let updateAttr = _.omit(orderItem, '_id');
        // console.log('updateAttr', updateAttr);
        template.orderItemsCollection.update({_id: existingItem._id},{$set: updateAttr});
        Maestro.POS.OrderItems.scrollToItemAndHighlight(existingItem._id);
    } else {
        let itemId = template.orderItemsCollection.insert(orderItem);
        Maestro.POS.OrderItems.scrollToItemAndHighlight(itemId);
    }

    // console.log(template.orderItemsCollection.find({}).fetch());
};

Maestro.POS.OrderItems.setItemAttr = function(template, orderItem, modifyAttr){
    template.orderItemsCollection.update({_id: orderItem._id}, {$set: modifyAttr});
};

Maestro.POS.OrderItems.setAllItemsAttr = function(template, modifyAttr){
    template.orderItemsCollection.update({}, {$set: modifyAttr});
};

Maestro.POS.OrderItems.increaseQuantity = function(template, orderItem, increment){
    template.orderItemsCollection.update({_id: orderItem._id}, {$inc: {quantity: increment}});
};

Maestro.POS.OrderItems.setQuantity = function(template, orderItem, quantity){
    template.orderItemsCollection.update({_id: orderItem._id}, {$set: {quantity: quantity}});
};

Maestro.POS.OrderItems.getItem = function(template, key, seatNumber = null){
    if(seatNumber){
        return template.orderItemsCollection.findOne({currentKey: key, seatNumber: seatNumber});
    } else {
        return template.orderItemsCollection.findOne({currentKey: key});
    }
};

Maestro.POS.OrderItems.getItemWithId = function(template, itemId){
    return template.orderItemsCollection.findOne({_id: itemId});
};

Maestro.POS.OrderItems.getAllItems = function(template){
    return template.orderItemsCollection.find({}).fetch();
};

Maestro.POS.OrderItems.getAllSeatItems = function(template, seatNumber = null){
    if(seatNumber == "ALL"){
        return template.orderItemsCollection.find({}).fetch();
    } else if (!!seatNumber){
        return template.orderItemsCollection.find({seatNumber: seatNumber}).fetch();
    } else {
        let seat = template.selectedSeat.get();
        let selectedSeatNumber = seat ? seat.seatNumber : null;
        if(!!selectedSeatNumber){
            return template.orderItemsCollection.find({seatNumber: selectedSeatNumber}).fetch();
        }
    } 
};

Maestro.POS.OrderItems.getAllSeatItemsWithAttr = function(template, seatNumber = null, attrDetails){
    let searchAttr = attrDetails || {};
    searchAttr.seatNumber = seatNumber;

    if(seatNumber == "ALL"){
        return template.orderItemsCollection.find({}).fetch();
    } else if (!!seatNumber){
        return template.orderItemsCollection.find(searchAttr).fetch();
    } else {
        let seat = template.selectedSeat.get();
        let selectedSeatNumber = seat ? seat.seatNumber : null;
        searchAttr.seatNumber = selectedSeatNumber;
        if(!!selectedSeatNumber){
            return template.orderItemsCollection.find(searchAttr).fetch();
        }
    } 
};

Maestro.POS.OrderItems.getSeatsUsed = function(template){
    let allUsedSeats = template.orderItemsCollection.find({},{fields: {seatNumber:1}}).fetch();
    allUsedSeats = _.pluck(allUsedSeats, "seatNumber");
    allUsedSeats = _.uniq(allUsedSeats);
    return allUsedSeats;
};

Maestro.POS.OrderItems.getAllItemKeys = function(template){
    // console.log('all items: ', Maestro.POS.OrderItems.getAllItems(template));
    // console.log('pluck current keys: ', _.pluck(Maestro.POS.OrderItems.getAllItems(template), 'currentKey'));
    return  _.pluck(Maestro.POS.OrderItems.getAllItems(template), 'currentKey');
};

Maestro.POS.OrderItems.removeItem = function(template, key = null, itemId = null){
    let removed;
    // console.log('entering remove item with: ', key, itemId);

    if(itemId){
        removed = template.orderItemsCollection.remove({_id: itemId});
    } else if (key){
        removed = template.orderItemsCollection.remove({currentKey: key});
        // console.log('removed items (key): ', removed);
    }
    
    // console.log(template.orderItemsCollection.find({}).fetch());
};

Maestro.POS.OrderItems.removeAllItems = function(template){
    template.orderItemsCollection.remove({});
};

Maestro.POS.OrderItems.addBackItemsChunk = function(template, items){
    _.each(items, function(item){
        template.orderItemsCollection.insert(item);
    });
};

Maestro.POS.OrderItems.productClick = function(template, candidateProduct){
    let candidateSize = null;
    let candidateKey = null;
    let existingOrderItem = null;

    if(candidateProduct.sizes.length === 1) {
        candidateSize = candidateProduct.sizes[0];
    }

    let candidateOrderItem = Maestro.POS.Tools.createOrderItem(candidateProduct, candidateSize, null, [], template);

    if(candidateSize) {
        candidateKey = candidateSize.code + "-" + candidateProduct._id;
    }

    let seat = template.selectedSeat.get();
    let seatNumber = seat ? seat.seatNumber : null;

    if(candidateKey) {
        existingOrderItem = Maestro.POS.OrderItems.getItem(template, candidateKey, seatNumber);
    }

    if(existingOrderItem) {
        candidateOrderItem = existingOrderItem;
        candidateOrderItem.quantity = 1;
    }

    template.candidateOrderItem.set(candidateOrderItem);

    if (candidateProduct.sizes.length === 1) {
        if(candidateOrderItem && candidateOrderItem.size) {
            Maestro.POS.Tools.selectProduct(candidateOrderItem.product, candidateOrderItem.size.code, candidateOrderItem.quantity, null, template);
            Maestro.POS.Loyalty.checkOrderForLoyaltyCreditItems(template);
        }
        template.expandedProduct.set();
    } else {
        template.expandedProduct.set(candidateProduct);
    }
};

Maestro.POS.OrderItems.initializeSeatSplit = function(template){
    let allUsedSeats = Maestro.POS.OrderItems.getSeatsUsed(template);
    let seatAndItems = _.map(allUsedSeats, function(num){
        return {seatNumber: num,
                seatItems: Maestro.POS.OrderItems.getAllSeatItems(template, num)
            };
    });
    template.seatGrouping.set(seatAndItems);

    template.orderItemsCache.set(Maestro.POS.OrderItems.getAllItems(template));
};

Maestro.POS.OrderItems.initializeGroupSplit = function(template){
    let allUsedSeats = Maestro.POS.OrderItems.getSeatsUsed(template);

    let seatAndItems = _.map(allUsedSeats, function(num){
        return {seatNumber: num,
                selectedForGroup: false
                };
    });

    template.ungroupedSeats.set(seatAndItems);
};

Maestro.POS.OrderItems.thisGroupDone = function(template){
    let selectedSeats = _.where(template.ungroupedSeats.get(), {selectedForGroup: true});

    if(selectedSeats.length == 0){ 
        return; 
    }

    let definedGroups = template.definedGroups.get();
    let nextGroup = !!definedGroups ? definedGroups.length + 1 : 1;
    // console.log(_.pluck(selectedSeats, "seatNumber"));
    let newGroup = {
        groupNumber: definedGroups.length + 1,
        selectedSeats: selectedSeats,
        groupLabel: (_.pluck(selectedSeats, "seatNumber")).join(" & ")
    };

    definedGroups.push(newGroup);

    template.definedGroups.set(definedGroups);

    let unselectedSeats = _.where(template.ungroupedSeats.get(), {selectedForGroup: false});
    template.ungroupedSeats.set(unselectedSeats);
    // console.log(unselectedSeats);
    if(unselectedSeats.length== 0){
        Maestro.POS.OrderItems.finalizeGroupSplitSelection(template);
    } else if (unselectedSeats.length == 1){
        let seatNumber = unselectedSeats[0].seatNumber;
        Maestro.POS.OrderItems.toggleSeatSelectionToGroup(template, seatNumber);
        Maestro.POS.OrderItems.thisGroupDone(template);
    }
};

Maestro.POS.OrderItems.toggleSeatSelectionToGroup = function(template, seatNumber){
    let ungroupedSeats = template.ungroupedSeats.get();
    ungroupedSeats = _.map(ungroupedSeats, function(seat){
        if(seat.seatNumber == seatNumber){
            seat.selectedForGroup = !seat.selectedForGroup;
        }
        return seat;
    });
    template.ungroupedSeats.set(ungroupedSeats);
};

Maestro.POS.OrderItems.finalizeGroupSplitSelection = function(template){
    let definedGroups = template.definedGroups.get();

    let seatAndItems = _.map(definedGroups, function(group){
        let groupedSeatItems = [];
        _.each(group.selectedSeats, function(seat){
            // console.log()
            groupedSeatItems = $.merge(groupedSeatItems, Maestro.POS.OrderItems.getAllSeatItems(template, seat.seatNumber));
        });
        // console.log(groupedSeatItems);
        return {seatNumber: group.groupLabel,
                seatItems: groupedSeatItems
        };
    });
    template.seatGrouping.set(seatAndItems);

    template.orderItemsCache.set(Maestro.POS.OrderItems.getAllItems(template));
};

Maestro.POS.OrderItems.isolateSeatItemsForCheckout = function(template){
    let checkoutSeat = template.checkoutSeatSelected.get();
    let seatItemsGroup = _.findWhere(template.seatGrouping.get(), {seatNumber: checkoutSeat});
    let seatItems = !!seatItemsGroup ? seatItemsGroup.seatItems : [];

    Maestro.POS.OrderItems.removeAllItems(template);
    Maestro.POS.OrderItems.addBackItemsChunk(template, seatItems);
};  

Maestro.POS.OrderItems.deleteIncompleteSplitOrders = function(template){
    let seatGroups = template.seatGrouping.get();
    _.each(seatGroups, function(seatGroup){
        if(!!seatGroup.splitOrderId){
            Maestro.Order.Delete(seatGroup.splitOrderId);
        }
    });
};

Maestro.POS.OrderItems.restoreFromCache = function(template){
    if(!!template.orderItemsCache.get()){
        Maestro.POS.OrderItems.removeAllItems(template);
        Maestro.POS.OrderItems.addBackItemsChunk(template, template.orderItemsCache.get());
        Maestro.POS.OrderItems.deleteIncompleteSplitOrders(template);
    }
    template.checkoutSeatSelected.set();
    template.definedGroups.set([]);
    template.ungroupedSeats.set([]);
};

Maestro.POS.OrderItems.productAddonSelect = function(template, selectedAddon){
    if(!selectedAddon){return;}
    let candidateOrderItem = template.thisOrderItem.get();
    
    var currentAddOns = candidateOrderItem.addOns || [];

    currentAddOns.push(selectedAddon);

    let newKey = Maestro.POS.Tools.generateKey(candidateOrderItem.size.code, candidateOrderItem.product._id, currentAddOns, candidateOrderItem.seatNumber);

    Maestro.POS.OrderItems.setItemAttr(template, candidateOrderItem, {currentKey: newKey, addOns: currentAddOns});

    candidateOrderItem.addOns = currentAddOns;
    candidateOrderItem.currentKey = newKey;
    template.thisOrderItem.set(candidateOrderItem);

};

Maestro.POS.OrderItems.removeSelectedProductAddon = function(template, selectedAddon){
    let candidateOrderItem = template.thisOrderItem.get();

    var currentAddOns = candidateOrderItem.addOns || [];

    currentAddOns.splice(currentAddOns.indexOf(selectedAddon),1);

    candidateOrderItem.addOns = currentAddOns;

    let newKey = Maestro.POS.Tools.generateKey(candidateOrderItem.size.code, candidateOrderItem.product._id, currentAddOns, candidateOrderItem.seatNumber);

    Maestro.POS.OrderItems.setItemAttr(template, candidateOrderItem, {currentKey: newKey, addOns: currentAddOns});

    candidateOrderItem.addOns = currentAddOns;
    candidateOrderItem.currentKey = newKey;
    template.thisOrderItem.set(candidateOrderItem);
};

Maestro.POS.OrderItems.initAddRedeemItem = function(template, orderItem){
    
    let redeemOrderItem = orderItem;
    let parseRedeemId = orderItem.product._id.split("-");
    let originalProductId = parseRedeemId[2];

    let originalProduct = Products.findOne({_id: originalProductId});
    
    originalProduct._id = orderItem.product._id;
    originalProduct.name = orderItem.product.name;
    redeemOrderItem.product = originalProduct;
    redeemProduct = originalProduct;

    let seatNumber = orderItem.seatNumber || template.selectedSeat.get();

    let key = redeemProduct._id;
   
    redeemOrderItem.itemNumber = orderItem.itemNumber + 0.1;
    redeemOrderItem.seatNumber = seatNumber;
    redeemOrderItem.currentKey = key;
    redeemOrderItem.sentToKitchen = true; //need to find a better way to bypass redeem items from being sent to kitchen
    redeemOrderItem.isRedeemItem = true;
    redeemOrderItem.isManualRedeem = orderItem.isManualRedeem;
    Maestro.POS.OrderItems.setItem(template, key, redeemOrderItem, seatNumber);
    // console.log(redeemOrderItem);
};

Maestro.POS.OrderItems.addRedeemItem = function(template, orderItem, selectedQuantity, discountPercent = 1, includeAddOns = false, isManualRedeem = true){ //discount percent in decimal
    let redeemProduct = _.clone(orderItem.product); //this is a shallow clone, be careful

    // console.log('incoming info: ', orderItem, selectedQuantity, discountPercent, includeAddOns, isManualRedeem);

    let selectedSizeCode = orderItem.size.code;
    let selectedAddOns = orderItem.addOns;
    let seatNumber = orderItem.seatNumber || template.selectedSeat.get();
    let selectedSize = _.find(redeemProduct.sizes, function (size) {
        return size.code === selectedSizeCode;
    });

    if(!discountPercent){
        selectedSize.price = selectedSize.price*(-1);
    } else {
        selectedSize.price = selectedSize.price*(-1)*(discountPercent);
    }

    redeemProduct.sizes = [selectedSize];
    
    if(!Maestro.POS.Loyalty.isThisLoyaltyRedeemItem(redeemProduct._id)){
        redeemProduct.name = "Redeem - " + redeemProduct.name;
        redeemProduct._id = "Redeem-"+ Maestro.POS.Tools.generateKey(selectedSizeCode, redeemProduct._id, selectedAddOns, seatNumber);
    }

    if (selectedSize) { 
        let key = redeemProduct._id;
        // console.log("key: ", key);

        let redeemOrderItem = Maestro.POS.OrderItems.getItem(template, key, seatNumber);
        
        if (redeemOrderItem) {
            if(selectedQuantity === 0) {
            } else {
                redeemOrderItem.quantity = selectedQuantity || 1;
            }
        } else {
            redeemOrderItem = Maestro.POS.Tools.createOrderItem(redeemProduct, selectedSize, selectedQuantity, selectedAddOns, template);
        }

        if(!includeAddOns){
            redeemOrderItem.addOns = [];
        } else {
            redeemOrderItem.addOns = _.map(orderItem.addOns, function(addOn){
                addOn.price = (-1)*(discountPercent) * addOn.price;
                return addOn;
            });
        }

        redeemOrderItem.itemNumber = orderItem.itemNumber + 0.1;
        redeemOrderItem.seatNumber = seatNumber;
        redeemOrderItem.currentKey = key;
        redeemOrderItem.sentToKitchen = true; //need to find a better way to bypass redeem items from being sent to kitchen
        redeemOrderItem.isRedeemItem = true;
        redeemOrderItem.isManualRedeem = isManualRedeem;
        Maestro.POS.OrderItems.setItem(template, key, redeemOrderItem, seatNumber);
        // console.log(redeemOrderItem);
    }
};

Maestro.POS.OrderItems.scrollToItem = function(itemId){
    Tracker.afterFlush(function(){
        document.getElementById(itemId).scrollIntoView()
        $('#'+itemId).removeClass('fadeOut').addClass('fadeIn');        
    });
};

Maestro.POS.OrderItems.scrollToItemAndHighlight = function(itemId){
    Tracker.afterFlush(function(){
        if(!!document.getElementById(itemId)){
            document.getElementById(itemId).scrollIntoView();
        }
        $('#'+itemId).addClass('fadeOut');
        window.setTimeout(function(){
            $('#'+itemId).removeClass('fadeOut').addClass('fadeIn');
        }, 500);

    });
};
///////////////////////////////////////////
Maestro.POS.AddOns = {};

Maestro.POS.AddOns.CreateNew = function(addonName, addonPrice, isSubstitution = false){
    let businessId = Maestro.Business.getBusinessId();

    let addonDetails = {
        name: addonName,
        price: addonPrice,
        status: 'Active',
        businessId: businessId,
        isSubstitution: isSubstitution
    };

    check(addonDetails, Maestro.Schemas.ProductAddon);

    return ProductAddons.insert(addonDetails);
};

Maestro.POS.AddOns.getAddOn = function(addonId){
    return ProductAddons.findOne({_id: addonId});
};

Maestro.POS.AddOns.getProductAttachedPureAddOns = function(addOns){
    let allPureAddons = ProductAddons.find({_id: {$in: addOns}, status: "Active", isSubstitution: {$ne: true}}).fetch();
    return allPureAddons;
};

Maestro.POS.AddOns.getProductAttachedSubstituteAddOns = function(addOns){
    let allSubstituteAddons = ProductAddons.find({_id: {$in: addOns}, status: "Active", isSubstitution: true}).fetch();
    return allSubstituteAddons;
};  

Maestro.POS.AddOns.getPureAddOns = function(addOns){   
    return _.reject(addOns, function(addOn){return addOn.isSubstitution == true;});
};

Maestro.POS.AddOns.getSubstituteAddOns = function(addOns){
    return _.filter(addOns, function(addOn){return addOn.isSubstitution == true;});
};

Maestro.POS.AddOns.getAllOtherAddOns = function(productAddOns){
    let allAddons = ProductAddons.find({status: "Active"}).fetch();
    let allOtherAddons = _.reject(allAddons, function(addon){return _.contains(productAddOns, addon._id);});
    return allOtherAddons; 
};

Maestro.POS.AddOns.getAddOnInfo = function(addOnId){
    return ProductAddons.findOne({_id: addOnId, status: "Active"});
};

///////////////////////////////////////////
Maestro.POS.Notes = {};

Maestro.POS.Notes.CreateNew = function(template, noteDescription){
    if(!noteDescription){return;}
    let candidateOrderItem = template.thisOrderItem.get();
    
    var currentNotes = candidateOrderItem.notes || [];

    currentNotes.push(noteDescription);

    Maestro.POS.OrderItems.setItemAttr(template, candidateOrderItem, {notes: currentNotes});

    candidateOrderItem.notes = currentNotes;
    template.thisOrderItem.set(candidateOrderItem);
};

Maestro.POS.Notes.RemoveNote = function(template, noteDescription){
    if(!noteDescription){return;}
    let candidateOrderItem = template.thisOrderItem.get();
    
    var currentNotes = candidateOrderItem.notes || [];

    currentNotes.splice(currentNotes.indexOf(noteDescription),1);

    Maestro.POS.OrderItems.setItemAttr(template, candidateOrderItem, {notes: currentNotes});

    candidateOrderItem.notes = currentNotes;
    template.thisOrderItem.set(candidateOrderItem);
};

///////////////////////////////////////////

Maestro.POS.Tools.getItemTotal = function (orderItem) {
    let itemTotal = orderItem.size.price * orderItem.quantity;
    let addOnTotal = _.reduce(_.pluck(orderItem.addOns, 'price'), function(memo, num){return memo + num;}, 0) * orderItem.quantity;
    return itemTotal + addOnTotal;
};

Maestro.POS.Tools.selectProduct = function (selectedProduct, selectedSizeCode, selectedQuantity, selectedAddOns, template, sentToKitchen = false, preselectedSeat = null, notes = null, itemNumber = null, setUnitBasedPriceQuantity = null, originalUnitPrice = null, setVariablePrice = null) {
    if(selectedProduct) {
        template.selectedProduct.set(selectedProduct);
    }

    if (selectedSizeCode) {
        let selectedProductId = selectedProduct._id;
        let selectedSize = _.find(selectedProduct.sizes, function (size) {
            return size.code === selectedSizeCode;
        });

        let seat = template.selectedSeat.get();
        
        let seatNumber = null; 
        
        if(seat) {seatNumber = seat.seatNumber;}

        if(preselectedSeat) { seatNumber = preselectedSeat;}

        if (selectedSize) { //removed $0 price check to allow for $0 items to be added to cart
            // let key = getSeatKey(seatNumber) + selectedSizeCode + "-" + selectedProductId + getAddOnKey(selectedAddOns);
            let key = Maestro.POS.Tools.generateKey(selectedSizeCode, selectedProductId, selectedAddOns, seatNumber);
            // let orderItem = template.orderItems.get(key);
            let orderItem = Maestro.POS.OrderItems.getItem(template, key, seatNumber);
            // console.log('existing order item: ', orderItem);
            if (orderItem) {
                if(selectedQuantity === 0) {
                } else {
                    orderItem.quantity += selectedQuantity || 1;
                    // orderItem.quantity = selectedQuantity || orderItem.quantity + 1;
                }
            } else {
                orderItem = Maestro.POS.Tools.createOrderItem(selectedProduct, selectedSize, selectedQuantity, selectedAddOns, template);
            }

            orderItem.itemNumber = itemNumber ? itemNumber : orderItem.itemNumber;
            orderItem.seatNumber = seatNumber;
            orderItem.currentKey = Maestro.POS.Tools.getOrderItemKey(orderItem);
            orderItem.sentToKitchen = sentToKitchen;
            orderItem.notes = notes;

            orderItem.variablePrice = selectedProduct.variablePrice || false;
            orderItem.unitBasedPrice = selectedProduct.unitBasedPrice || false;
            orderItem.unitLabel = selectedProduct.unitLabel || "";

            orderItem.unitBasedPriceQuantity = setUnitBasedPriceQuantity || 1;
            orderItem.unitPrice = originalUnitPrice || orderItem.size.price;
            if(setVariablePrice){orderItem.size.price = setVariablePrice;}
            

            Maestro.POS.OrderItems.setItem(template, key, orderItem, seatNumber);
            template.itemIdCounter.set(template.itemIdCounter.get() + 1);
            template.selectedOrderItem.set(orderItem);
            // console.log(orderItem);
        }
    }
};

Maestro.POS.Tools.createOrderItem = function (selectedProduct, selectedSize, selectedQuantity, selectedAddOns, template) {
    return {
        itemNumber: template.itemIdCounter.get(),
        product: selectedProduct,
        size: selectedSize,
        addOns: selectedAddOns || [],
        quantity: (selectedQuantity || 1)
    };
};

Maestro.POS.Tools.generateKey = function(selectedSizeCode, selectedProductId, selectedAddOns, seatNumber){
    // let key = getSeatKey(seatNumber) + selectedSizeCode + "-" + selectedProductId + getAddOnKey(selectedAddOns);
    let key = selectedSizeCode + "-" + selectedProductId + Maestro.POS.Tools.getAddOnKey(selectedAddOns);

    return key;  
};

Maestro.POS.Tools.getOrderItemKey = function(orderItem){
    let selectedSizeCode = orderItem.size.code;
    let selectedProductId = orderItem.product._id;
    let selectedAddOns = orderItem.addOns;
    let seatNumber = orderItem.seatNumber ? orderItem.seatNumber : null;

    // let key = getSeatKey(seatNumber) + selectedSizeCode + "-" + selectedProductId + getAddOnKey(selectedAddOns);
    let key = Maestro.POS.Tools.generateKey(selectedSizeCode, selectedProductId, selectedAddOns, seatNumber);

    return key;
};

Maestro.POS.Tools.getSeatKey = function(seatNumber){
    if(!seatNumber){
        return '';
    } else {
        return 's'+ seatNumber;
    }
};

Maestro.POS.Tools.getAddOnKey = function(addOnSet){
    var addOnKey = "";
    let allProductAddOns = _.pluck(ProductAddons.find({status:'Active'},{sort: {createdAt: 1}}).fetch(), '_id'); 
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

Maestro.POS.Tools.checkForEditCheckoutMode = function(template){
    let editOrderId = FlowRouter.getParam("orderId");
    template.editOrderId = new ReactiveVar();
    template.editOrderId.set(editOrderId);
    // console.log("edit order id: ", template.editOrderId.get());
    if(!!editOrderId){
        let businessId = UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID);
        Template.instance().subscribe('orders-orderId', businessId, editOrderId);
        // console.log('edit order id provided: ', editOrderId);
        let editOrder = Orders.findOne({_id: editOrderId});            
        template.inOrderEditMode.set(true);
        template.editOrder.set(editOrder);
        Maestro.POS.Tools.initEditOrder(editOrder, template);
    } else {
        // console.log('no edit order id');order
        template.inOrderEditMode.set(false);
    }

    var checkoutMode = FlowRouter.getParam("checkoutMode");
    
    if(checkoutMode == "true"){
        template.checkoutMode.set(true);
    } else if (checkoutMode == "false"){ 
        template.checkoutMode.set(false);
    }
    // console.log('checkoutMode: ', template.checkoutMode.get());
};

Maestro.POS.Tools.initEditOrder = function(order, template){
    // console.log('pos tools: ', order);
    let selectedProduct, selectedSizeCode, selectedQuantity, selectedAddOns;
    
    if(!!order){
        _.each(order.items, function(item){
            // console.log('init item: ', item);
            selectedProduct = Products.findOne({_id: item.product._id});
            selectedSizeCode = item.size.code;
            selectedQuantity = item.quantity;
            selectedAddOns = item.addOns;
            sentToKitchen = item.sentToKitchen;
            notes = item.notes;
            seatNumber = item.seatNumber;
            itemNumber = item.itemNumber;

            setUnitBasedPriceQuantity = item.unitBasedPriceQuantity;
            originalUnitPrice = item.unitPrice;
            setVariablePrice = item.size.price;

            if(item.isRedeemItem){
                if(item.isManualRedeem){
                    Maestro.POS.OrderItems.initAddRedeemItem(template, item);
                    // Maestro.POS.OrderItems.addRedeemItem(template, item, selectedQuantity, correction = -1, includeAddOns = true);
                } else {
                    // console.log("is redeem but not manual redeem");
                }
            } else if (Maestro.POS.Loyalty.isThisLoyalty(item.product._id)){
                // console.log('this is a loyalty program', item);
                Maestro.POS.Loyalty.addLoyaltyProgramPurchase (template, item.product._id, item.product, item.quantity);
            } else {
                Maestro.POS.Tools.selectProduct(selectedProduct, selectedSizeCode, selectedQuantity, selectedAddOns, template, sentToKitchen, seatNumber, notes, itemNumber, setUnitBasedPriceQuantity, originalUnitPrice, setVariablePrice);    
            }
            
        });
        
        if(!!order.orderInformation){
            template.orderInformation = order.orderInformation;
            template.orderType.set(order.orderInformation.orderType);
        } else {
            order.orderInformation = {};
        }

        if(order.orderInformation.orderType == "TAKEOUT"){
            template.selectedTable.set({
                _id: "TAKEOUT",
                tableLabel: "Take-Out",
                defaultSeats: 1,
            });
        } else if(order.orderInformation.orderType == "DELIVERY"){
            template.selectedTable.set({
                _id: "DELIVERY",
                tableLabel: "Delivery",
                defaultSeats: 1,
            });
        } else if(!!order.tableId){
            // console.log(order.tableId);
            template.selectedTableId.set(order.tableId);
        }

        if (!!order.customerId){
            // Maestro.POS.Loyalty.clearCustomerInfo(template);
            let customer = Customers.findOne({_id: order.customerId});
            template.orderCustomer.set(customer);
            Maestro.POS.Loyalty.getExistingCustomerLoyaltyPrograms(customer, template);
            // Maestro.POS.Loyalty.checkAutoRedeemForCustomer(this, template);
            // console.log(customer);
        }

        $('ul.tabs').tabs('select_tab', 'restaurantOrderCreateTab');
        $('ul.tabs').tabs('select_tab', 'order-products');
    }
};

///////////////////////////////////////////////////////

Maestro.POS.Loyalty.customerSearch = function(template, matchField, matchTerm, showAll = false, optimize = false){
    template.searchCustomersList.set(Maestro.Customers.SearchCustomerMatch(matchField, matchTerm, showAll = false, optimize = false));
};

Maestro.POS.Loyalty.clearCustomerInfo = function(template){
    template.orderCustomer.set();

    // template.orderLoyaltyItems.set([]);

    template.appliedCustomerLoyaltyPrograms.set();

    template.existingCustomerLoyaltyPrograms.set();

    template.existingQuantityLoyalty.set(); 
    template.existingAmountLoyalty.set();
    template.existingPercentageLoyalty.set();
    template.existingTallyPrograms.set(); 

    template.addLoyaltyCreditItems.clear();

    Maestro.POS.Loyalty.deleteAllExistingRedeemItems(template);

    template.giftCardsBalances = [];

    template.paymentDueAmount.set(null);

    template.cashAmountGiven.set(0);

    template.emailReceiptFlag.set(false);

    // document.getElementById('customer-search').value="";

    template.customerTabMode.set('search');
};

Maestro.POS.Loyalty.reApplyLoyaltyPrograms = function(template){
    Maestro.POS.Loyalty.deleteAllExistingRedeemItems(template);
    // console.log('deleted all items');
    // template.orderLoyaltyItems.set([]);

    template.existingQuantityLoyalty.set(); 
    template.existingAmountLoyalty.set();
    template.existingPercentageLoyalty.set();
    template.existingTallyPrograms.set(); 

    template.addLoyaltyCreditItems.clear();

    template.giftCardsBalances = [];

    template.paymentDueAmount.set(null);

    template.cashAmountGiven.set(0);

    Maestro.POS.Loyalty.getLoyaltyPrograms(template);
};

Maestro.POS.Loyalty.removeLoyaltyItem = function(programId, template){
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

// Maestro.POS.Loyalty.setCustomerSearchCriteria = function (searchTerm, template) {
//     template.searchCriteria.set(CUSTOMERS, searchTerm);
// };

// Maestro.POS.Loyalty.setCustomerAlphabetSearchCriteria = function(searchTerm, template){
//     template.searchCriteria.set(CUSTOMERS, "");
//     template.searchCriteria.set(CUSTOMERS, "Alphabet:"+searchTerm);
// };

Maestro.POS.Loyalty.clearCustomerSearch = function (template) {
    Maestro.POS.UI.ClearCustomerSearchFields();
    template.searchCustomersList.set([]);
};
    

Maestro.POS.Loyalty.setLoyaltyProgramApplyStatus = function(program, flag, template){
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
    Maestro.POS.Loyalty.reApplyLoyaltyPrograms(template);

    if(flag){
        Maestro.POS.Loyalty.autoRedeemSingleItemProgram(thisProgram.programId, template);
    }

    // console.log('all existing: ', template.existingCustomerLoyaltyPrograms.get());
    // console.log('applied: ', template.appliedCustomerLoyaltyPrograms.get());

};

Maestro.POS.Loyalty.setPrePurchaseLoyaltyApplyStatus = function(loyaltyProgram, flag, template){
    var thisLoyaltyProgram = loyaltyProgram;
    var allOrderLoyaltyItems = template.orderLoyaltyItems.get();

    let programIndex = _.indexOf(allOrderLoyaltyItems, thisLoyaltyProgram);
    // console.log(allOrderLoyaltyItems, thisLoyaltyProgram);

    allOrderLoyaltyItems[programIndex].apply = flag;
    allOrderLoyaltyItems[programIndex].prePurchase = flag;

    template.orderLoyaltyItems.set(allOrderLoyaltyItems);

    var allAppliedPrograms = template.appliedCustomerLoyaltyPrograms.get() || [];

    if(flag){
        let existingOrderLoyaltyItem = Maestro.POS.Loyalty.getOrderLoyaltyItem(template, loyaltyProgram) || {quantity:1};
        // console.log(existingOrderLoyaltyItem);

        let prePurchaseLoyaltyProgram = {
            programId: allOrderLoyaltyItems[programIndex]._id,
            remainingQuantity: allOrderLoyaltyItems[programIndex].programType.quantity * existingOrderLoyaltyItem.quantity ,
            remainingAmount: allOrderLoyaltyItems[programIndex].programType.creditAmount  * existingOrderLoyaltyItem.quantity ,
            creditPercent: allOrderLoyaltyItems[programIndex].programType.creditPercentage,
            expired: false,
            boughtOn: new Date(),
            apply: true,
            prePurchase: true 
        };

        allAppliedPrograms.push(prePurchaseLoyaltyProgram);
    } else if (!flag){
        allAppliedPrograms = _.reject(allAppliedPrograms, function(prog){
            return prog.prePurchase == true && prog.programId == thisLoyaltyProgram._id;
        });
        // allAppliedPrograms = _.without(allAppliedPrograms, _.findWhere(allAppliedPrograms, {programId: thisLoyaltyProgram._id}));
    }

    template.appliedCustomerLoyaltyPrograms.set(allAppliedPrograms);
    // console.log('applied programs: ', allAppliedPrograms);

    Maestro.POS.Loyalty.reApplyLoyaltyPrograms(template);

    // console.log('all loyalty order items: ', template.orderLoyaltyItems.get());
    // console.log('applied: ', template.appliedCustomerLoyaltyPrograms.get());

    // Maestro.POS.Loyalty.purgeExistingPrograms(template);//this is a temporary fix till the loyalty system is re-written

    if(flag){
        Maestro.POS.Loyalty.autoRedeemSingleItemProgram(thisLoyaltyProgram._id, template);
    }
};

Maestro.POS.Loyalty.isThisLoyalty = function(id){
    if(LoyaltyPrograms.findOne({_id:id})){
        return true;
    } else {
        return false;
    }
};

Maestro.POS.Loyalty.getExistingCustomerLoyaltyPrograms = function(customer, template){
    // Meteor.call("checkCustomerProgramExpiry", customer._id);
    Maestro.LoyaltyCards.CheckCustomerProgramExpiry(customer._id);

    let existingPrograms = Maestro.LoyaltyCards.getCustomerActiveCards(customer._id);

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
        Maestro.POS.Loyalty.getLoyaltyPrograms(template);
    }
};

Maestro.POS.Loyalty.refreshAppliedPrograms = function(existing, template){
    let applied = existing;
    applied.concat(template.appliedCustomerLoyaltyPrograms.get());
    template.appliedCustomerLoyaltyPrograms.set(applied);
};

Maestro.POS.Loyalty.purgeExistingPrograms = function(template){
    template.existingCustomerLoyaltyPrograms.set(_.reject(template.existingCustomerLoyaltyPrograms.get(), function(prog){
        return prog.prePurchase == true;
    }));
}; 

Maestro.POS.Loyalty.getLoyaltyPrograms = function(template){
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
                        _id: existingLoyaltyPrograms[i]._id,
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
                        _id: existingLoyaltyPrograms[i]._id,
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
                    _id: existingLoyaltyPrograms[i]._id,
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
                    _id: existingLoyaltyPrograms[i]._id,
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

    Maestro.POS.Loyalty.getTallyPrograms(template);

    Maestro.POS.Loyalty.checkOrderForLoyaltyCreditItems(template);
};

Maestro.POS.Loyalty.getTallyPrograms = function(template){
    let activeTallyPrograms = Maestro.Loyalty.GetActiveTallyPrograms();
    let customerObj = template.orderCustomer.get();
    // console.log('getting tally programs'); 

    if(activeTallyPrograms.length && !!customerObj){
        let customerTallyPrograms = [];

        _.each(activeTallyPrograms, function(program){
            // // let existingCustomerTally = customerObj.tallyPrograms;
            // let existingCustomerTally = Maestro.LoyaltyCards.getActiveTallyCards(customerObj._id);

            // let thisTallyObj = _.find(existingCustomerTally, function(tallyObj){
            //     return tallyObj.programId == program._id;
            // });

            let thisTallyObj = Maestro.LoyaltyCards.getCard(null, customerObj._id, program._id) || {};

            customerTallyPrograms.push({
                programId: program._id,
                customerTally: thisTallyObj.tally || 0,
                tallyThreshold: program.programType.tally,
                productSet: program.products
            });
        });
        // console.log('customerTallyPrograms: ', customerTallyPrograms);
        template.existingTallyPrograms.set(customerTallyPrograms);

        return true;
    }

    return false;
};

Maestro.POS.Loyalty.getOrderItemWithKeyBeginning = function(selectedSizeCode, selectedProductId, template){
    let seat = template.selectedSeat.get();
    let seatNumber = seat ? seat.seatNumber : null;
    let searchKey = Maestro.POS.Tools.generateKey(selectedSizeCode, selectedProductId, null, seatNumber);

    // let allOrderItems = _.keys(template.orderItems.all());
    let allOrderItems = Maestro.POS.OrderItems.getAllItemKeys(template);

    let keyMatch = _.find(allOrderItems, function(itemKey){
        return itemKey.startsWith(searchKey);
    });

    // console.log(template.orderItems.get(keyMatch));

    // return template.orderItems.get(keyMatch);
    return Maestro.POS.OrderItems.getItem(template, keyMatch);
};

Maestro.POS.Loyalty.checkOrderForLoyaltyCreditItems = function(template){

    let orderItems = Maestro.POS.OrderItems.getAllItems(template);
    if(orderItems){
        _.each(orderItems, function(item){
            // console.log(item);
            Maestro.POS.Loyalty.applyAnyLoyaltyCredits(item, template);
        });
    }
};

Maestro.POS.Loyalty.applyAnyLoyaltyCredits = function(orderItem, template){
    
    Maestro.POS.Loyalty.applyQuantityCards (orderItem, template);

    Maestro.POS.Loyalty.applyGiftCards (template);

    Maestro.POS.Loyalty.applyPercentageCards (orderItem, template);

    Maestro.POS.Loyalty.applyTallyPrograms (orderItem, template);

};

Maestro.POS.Loyalty.applyQuantityCards = function(orderItem, template){
    // console.log("order item: ", orderItem);
    let selectedProduct = orderItem.product,
        selectedSizeCode = orderItem.size.code,
        selectedQuantity = orderItem.quantity,
        seatNumber = orderItem.seatNumber;

    // console.log('checking applicable loyalty credits');
    var currentPrograms = template.existingQuantityLoyalty.get();
    // console.log('currentPrograms :', currentPrograms);

    if(currentPrograms){
        for (i=0; i<currentPrograms.length; i++){
            let currentProgramProducts = currentPrograms[i].productSet || [];
            // console.log('===== i:' + i + "=====");
            // console.log('currentProgramProducts :', currentProgramProducts);
            for (j=0; j<currentProgramProducts.length; j++){
                let programProduct = currentProgramProducts[j];
                // console.log('===== j:' + j + "=====");
                // console.log(orderItem, programProduct);
                if (selectedProduct._id == programProduct.productId){
                    // console.log("product match");
                    // console.log(programProduct.sizeCodes, selectedSizeCode);
                    if(_.contains(programProduct.sizeCodes, selectedSizeCode)){
                        // console.log("size code applies to program");

                        let redeemItemKey = "Redeem-"+selectedSizeCode+"-"+selectedProduct._id;
                        // console.log("searching for redeem item: ", redeemItemKey, seatNumber);
                        let redeemItem = Maestro.POS.OrderItems.getItem(template, redeemItemKey, seatNumber);

                        // console.log("order: ========== ", orderItem);
                        // console.log("redeem: ========== ", redeemItem);

                        if(redeemItem){
                            if (orderItem.quantity > redeemItem.quantity){
                                // console.log("qty greater");
                                let addQuantity = orderItem.quantity - redeemItem.quantity;
                                if((addQuantity <= currentPrograms[i].remainingQuantity) && (currentPrograms[i].remainingQuantity > 0)){
                                    currentPrograms[i].remainingQuantity -= addQuantity;
                                    Maestro.POS.OrderItems.addRedeemItem (template, orderItem, orderItem.quantity, discountPercent = 1, includeAddOns = false, isManualRedeem = false);
                                    // console.log(orderItem.quantity);
                                } else if ((addQuantity > currentPrograms[i].remainingQuantity) && (currentPrograms[i].remainingQuantity > 0)){
                                    // console.log('evaluation: ', addQuantity, currentPrograms[i].remainingQuantity);
                                    let fullQuantity = redeemItem.quantity + currentPrograms[i].remainingQuantity;
                                    Maestro.POS.OrderItems.addRedeemItem (template, orderItem, fullQuantity, discountPercent = 1, includeAddOns = false, isManualRedeem = false);
                                
                                    currentPrograms[i].remainingQuantity = 0;
                                } else {
                                    // console.log('do nothing');
                                }
                            } else if (orderItem.quantity < redeemItem.quantity){
                                // console.log("qty less");
                                let reduceQuantity = redeemItem.quantity - orderItem.quantity;
                                currentPrograms[i].remainingQuantity += reduceQuantity;
                                Maestro.POS.OrderItems.addRedeemItem (template, orderItem, orderItem.quantity, discountPercent = 1, includeAddOns = false, isManualRedeem = false);
                                // Maestro.POS.Loyalty.addRedeemProduct(selectedProduct, selectedSizeCode, -1*reduceQuantity, template);
                            }
                        }else {
                            // console.log("new redeem item");
                            if(selectedQuantity <= currentPrograms[i].remainingQuantity){
                                Maestro.POS.OrderItems.addRedeemItem (template, orderItem, selectedQuantity, discountPercent = 1, includeAddOns = false, isManualRedeem = false);
                                currentPrograms[i].remainingQuantity -= selectedQuantity;
                            } else {
                                Maestro.POS.OrderItems.addRedeemItem (template, orderItem, currentPrograms[i].remainingQuantity, discountPercent = 1, includeAddOns = false, isManualRedeem = false);
                                currentPrograms[i].remainingQuantity = 0;
                            }
                            // Maestro.POS.Loyalty.addRedeemProduct(selectedProduct, selectedSizeCode, selectedQuantity, template);
                        }
                    }
                }
            }
        }    
        // console.log("existingQuantityLoyalty: ", currentPrograms);
        template.existingQuantityLoyalty.set(currentPrograms);
    }
};

Maestro.POS.Loyalty.applyGiftCards = function(template){
    // let selectedProduct = orderItem.product,
    //     selectedSizeCode = orderItem.size.code,
    //     selectedQuantity = orderItem.quantity,
    //     seatNumber = orderItem.seatNumber;

    //amount based gift cards
    // let orderSubtotals = (calculateOrderTotals(template, template.orderItems.all()));
    let orderSubtotals = (Maestro.POS.Calc.calculateOrderTotals(template, Maestro.POS.OrderItems.getAllItems(template)));
    var paymentDueAmount = orderSubtotals.total;
    let giftCards = template.existingAmountLoyalty.get();

    // console.log('payment due: ', paymentDueAmount);

    template.giftCardsBalances = _.pluck(giftCards, 'remainingAmount') || [];
    
    if(template.giftCardsBalances.length > 0){
        // console.log('giftcards: ', template.giftCardsBalances);
        for (card = 0; card < template.giftCardsBalances.length; card++){
            if(giftCards[card].prePurchase==true){
                let cardPrice = LoyaltyPrograms.findOne({_id: giftCards[card].programId}).price;
                // console.log('card price: ', cardPrice);
                if((paymentDueAmount - cardPrice) <= template.giftCardsBalances[card]){
                    template.giftCardsBalances[card] = template.giftCardsBalances[card] - (paymentDueAmount - cardPrice);
                    paymentDueAmount = 0 + cardPrice;
                } else {
                    paymentDueAmount = paymentDueAmount - template.giftCardsBalances[card] + cardPrice;
                    template.giftCardsBalances[card] = 0;                 
                }
                // console.log('payment due: ', paymentDueAmount);
            } else {
                if(paymentDueAmount <= template.giftCardsBalances[card]){
                    template.giftCardsBalances[card] -=paymentDueAmount;
                    paymentDueAmount = 0;
                } else {
                    paymentDueAmount -= template.giftCardsBalances[card];
                    template.giftCardsBalances[card] = 0;                 
                }
            }
        }
        template.paymentDueAmount.set(paymentDueAmount);
    } 

    
};


Maestro.POS.Loyalty.applyPercentageCards = function(orderItem, template){
    let selectedProduct = orderItem.product,
        selectedSizeCode = orderItem.size.code,
        selectedQuantity = orderItem.quantity,
        seatNumber = orderItem.seatNumber;

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

                        let redeemItemKey = "Redeem-"+selectedSizeCode+"-"+selectedProduct._id;

                        let redeemItem = Maestro.POS.OrderItems.getItem(template, redeemItemKey, seatNumber);

                        let discountPercent = percentagePrograms[i].creditPercent/100;
                        // console.log('sending percentage info: ', orderItem, orderItem.quantity, discountPercent, includeAddOns = false, isManualRedeem = false);

                        Maestro.POS.OrderItems.addRedeemItem (template, orderItem, orderItem.quantity, discountPercent, includeAddOns = false, isManualRedeem = false);

                    }
                }
            }
        }    
    }

};

Maestro.POS.Loyalty.applyTallyPrograms = function(orderItem, template){
    let selectedProduct = orderItem.product,
        selectedSizeCode = orderItem.size.code,
        selectedQuantity = orderItem.quantity,
        seatNumber = orderItem.seatNumber;

    if(Maestro.POS.Loyalty.getTallyPrograms(template)){
        let tallyPrograms = template.existingTallyPrograms.get();
        for (i=0; i<tallyPrograms.length; i++){
            let currentProgramProducts = tallyPrograms[i].productSet || [];
            for (j=0; j<currentProgramProducts.length; j++){
                let programProduct = currentProgramProducts[j];
                if (selectedProduct._id == programProduct.productId){
                    if(_.contains(programProduct.sizeCodes, selectedSizeCode)){
                        let redeemItemKey = "Redeem-"+selectedSizeCode+"-"+selectedProduct._id;
                        let redeemItem = Maestro.POS.OrderItems.getItem(template, redeemItemKey, seatNumber);

                        if(redeemItem){
                            // IN ORDER TO AVOID CONFLICTING REDEEMS, IF THERE IS ALREADY A REDEEM ITEM, DO NOTHING

                            // if(orderItem.quantity < (1 + tallyPrograms[i].tallyThreshold - tallyPrograms[i].customerTally)){
                            //     Maestro.POS.OrderItems.removeItem(template, null, orderItem._id);
                            // }

                        }else {
                            tallyPrograms[i].customerTally += orderItem.quantity;
                            
                            if(tallyPrograms[i].customerTally > tallyPrograms[i].tallyThreshold){
                                // Maestro.POS.Loyalty.addRedeemProduct(selectedProduct, selectedSizeCode, 1, template);
                                // console.log('sending tally info: ', orderItem, orderItem.quantity, discountPercent, includeAddOns = false, isManualRedeem = false);
                                Maestro.POS.OrderItems.addRedeemItem (template, orderItem, quantity = 1, discountPercent = 1, includeAddOns = false, isManualRedeem = false);
                                tallyPrograms[i].customerTally = 0;
                            }
                        }
                    }
                }
            }
        }
        template.existingTallyPrograms.set(tallyPrograms);
    }


};

Maestro.POS.Loyalty.deleteIfAnyRedeemProduct = function(productId, template){
    let key = 'Redeem-'+productId;
    // let existingItem = template.orderItems.get(key);
    let existingItem = Maestro.POS.OrderItems.getItem(template, key);

    if (existingItem){
        // template.orderItems.delete(key);
        Maestro.POS.OrderItems.removeItem(template, key);
    }
};

Maestro.POS.Loyalty.deleteAllExistingRedeemItems = function(template){
    // let allOrderItems = _.keys(template.orderItems.all());
    // console.log('deleting all existing items');
    let allOrderItems =  Maestro.POS.OrderItems.getAllItemKeys(template);

    // console.log('all order item keys ', allOrderItems);
    if (allOrderItems){
        for (i = 0; i < allOrderItems.length; i++){
            if (Maestro.POS.Loyalty.isThisLoyaltyRedeemItem(allOrderItems[i])){
                // template.orderItems.delete(allOrderItems[i]);
                // console.log('deleting item');
                Maestro.POS.OrderItems.removeItem(template, allOrderItems[i]);
            }
        }
    }
};

Maestro.POS.Loyalty.addRedeemProduct = function(selectedProduct, selectedSizeCode, selectedQuantity, template, discountPercent){ //discount percent in decimal
    return;

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
        // let orderItem = template.orderItems.get(key);
        let orderItem = Maestro.POS.OrderItems.getItem(template, key);

        if (orderItem) {
            if(selectedQuantity === 0) {
                addItem = false;
            } else {
                orderItem["quantity"] += selectedQuantity;
            }
        } else {
            orderItem = Maestro.POS.Tools.createOrderItem(redeemProduct, selectedSize, selectedQuantity, [], template);
        }

        // set/update order-item
        if(addItem) {
            orderItem.currentKey = key;
            Maestro.POS.OrderItems.setItem(template, key, orderItem);
            template.itemIdCounter.set(template.itemIdCounter.get() + 1);
        } else {
            removeProductItem(key, template);
        }
    }
};

Maestro.POS.Loyalty.isThisLoyaltyRedeemItem = function(productId){
    if(productId.substring(0,6)=="Redeem"){
        return true;
    } else {
        return false;
    }
};

Maestro.POS.Loyalty.anyOrderGiftCards = function(giftCards){
    if (giftCards){
        return true;
    } else {
        return false;
    }
};

Maestro.POS.Loyalty.autoRedeemSingleItemProgram = function(programId, template){
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

            let candidateOrderItem = Maestro.POS.Tools.createOrderItem(candidateProduct, candidateSize, null, [], template);

            if(candidateSize) {
                candidateKey = candidateSize.code + "-" + candidateProduct._id;
            }

            if(candidateKey) {
                // existingOrderItem = template.orderItems.get(candidateKey);
                existingOrderItem = Maestro.POS.OrderItems.getItem(template, candidateKey);
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
                Maestro.POS.Tools.selectProduct(candidateOrderItem.product, candidateOrderItem.size.code, candidateOrderItem.quantity, null, template);
                Maestro.POS.Loyalty.checkOrderForLoyaltyCreditItems(template);
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

// Maestro.POS.Loyalty.checkAutoRedeemForCustomer = function(customerObj, template){
//     if(customerObj){
//         if(customerObj.loyaltyPrograms){
//             for(k=0; k< customerObj.loyaltyPrograms.length; k++){
//                 Maestro.POS.Loyalty.autoRedeemSingleItemProgram(customerObj.loyaltyPrograms[0].programId, template);
//             }
//         }
//     }
// };

Maestro.POS.Loyalty.getOrderLoyaltyItem = function(template, loyaltyProgram){
    let itemSizeCode = loyaltyProgram.purchaseLoyalty.sizes[0].code;

    let itemKey =  itemSizeCode + "-" + loyaltyProgram._id;

    return Maestro.POS.OrderItems.getItem(template, itemKey);
};

Maestro.POS.Loyalty.getLoyaltyOrderItemProgram = function(programId){
    let allOrderLoyaltyItems = Template.instance().orderLoyaltyItems.get();
    return _.findWhere(allOrderLoyaltyItems, {_id: programId});
};

Maestro.POS.Loyalty.incrementLoyaltyProgramPurchase = function(template, orderLoyaltyItem, increaseQuantity = 1 ){
    // console.log("order loyalty item: ", orderLoyaltyItem);
    let loyaltyProgram = Maestro.POS.Loyalty.getLoyaltyOrderItemProgram(orderLoyaltyItem.product._id);
    if(loyaltyProgram.programType.type == "Percentage"){
        Materialize.toast("Can not add multiples of same coupon", 3000, "rounded red");
        return;
    }
    Maestro.POS.Loyalty.setPrePurchaseLoyaltyApplyStatus(loyaltyProgram, false, template);
    Maestro.POS.OrderItems.increaseQuantity(template, orderLoyaltyItem, increaseQuantity);
    Maestro.POS.Loyalty.checkOrderForLoyaltyCreditItems(template);
};

Maestro.POS.Loyalty.addLoyaltyProgramPurchase = function(template, programId, loyaltyProduct, quantity = 1){
    // console.log(programId, loyaltyProduct);

    let candidateProduct = loyaltyProduct;
    candidateProduct._id = programId; 
    let loyaltyProgram = LoyaltyPrograms.findOne({_id:programId});
    let candidateSize = null;
    let candidateKey = null;
    let existingOrderItem = null;

    // console.log('candidateProduct: ', candidateProduct);

    if(candidateProduct.sizes.length === 1) {
        candidateSize = candidateProduct.sizes[0];
    }

    let candidateOrderItem = Maestro.POS.Tools.createOrderItem(candidateProduct, candidateSize, quantity, [], template);

    if(candidateSize) {
        candidateKey =  candidateSize.code + "-" + candidateProduct._id;
    }

    if(candidateKey) {
        existingOrderItem = Maestro.POS.OrderItems.getItem(template, candidateKey);
    }

    if(existingOrderItem) {
        Maestro.POS.Loyalty.incrementLoyaltyProgramPurchase(template, existingOrderItem, 1);
    } else {
        //add entire program to loyatly item
        var selectedLoyalty = template.orderLoyaltyItems.get();
        loyaltyProgram.apply = false;
        selectedLoyalty.push(loyaltyProgram);
        template.orderLoyaltyItems.set(selectedLoyalty);
    

        //add order item
        template.candidateOrderItem.set(candidateOrderItem);

        //open modal if more than one size
        if (candidateProduct.sizes.length === 1) {
            let candidateOrderItem = template.candidateOrderItem.get();
            if(candidateOrderItem && candidateOrderItem.size) {
                Maestro.POS.Tools.selectProduct(candidateOrderItem.product, candidateOrderItem.size.code, candidateOrderItem.quantity, null, template);
            }
        }

        Maestro.POS.Loyalty.checkOrderForLoyaltyCreditItems(template);
    }
};

Maestro.POS.Loyalty.emailInstructionsTrackLoyalty = function(customer){
    if(Meteor.status().connected){
        Meteor.call("emailInstructionsTrackLoyalty", customer._id);
        Materialize.toast("Email sent", 2000, "green rounded");
    } else {
        Materialize.toast("You are not connected to the internet", 2000, "red rounded");
    }
};

/////////////////////////////////////////////////////////////////////

Maestro.POS.Navigation = {};

Maestro.POS.Navigation.goToStartTabs = function(template){
    if(UserSession.get(Maestro.UserSessionConstants.POS_START_ORDER_TYPE)=="EXPRESS"){
        $('ul.tabs').tabs('select_tab', 'restaurantOrderCreateTab');
        $('ul.tabs').tabs('select_tab', 'order-products');
        template.orderType.set(UserSession.get(Maestro.UserSessionConstants.POS_START_ORDER_TYPE));
        template.orderInformation.orderType = UserSession.get(Maestro.UserSessionConstants.POS_START_ORDER_TYPE);
    } else if(UserSession.get(Maestro.UserSessionConstants.POS_START_ORDER_TYPE)=="DINEIN") {
        $('ul.tabs').tabs('select_tab', 'restaurantOrderCreateTab');
        $('ul.tabs').tabs('select_tab', 'order-tables');
    } else {
        $('ul.tabs').tabs('select_tab', 'orderDetailsTab');
        $('ul.tabs').tabs('select_tab', 'order-products');
        template.orderType.set(UserSession.get(Maestro.UserSessionConstants.POS_START_ORDER_TYPE));
        template.orderInformation.orderType = UserSession.get(Maestro.UserSessionConstants.POS_START_ORDER_TYPE);
    }
    
    $('ul.tabs').tabs('select_tab', 'searchCustomer');
};

/////////////////////////////////////////////////////////////////////

Maestro.POS.Views.restaurantHelpers = {
    getSortedFilteredProductsAndGroups: function (){
        let generalFindCriteria = {};
        let sortCriteria = 'categories';
        
        generalFindCriteria.status = "Active";
        
        let categoryFilter = Template.instance().ordersSelectedCategoryFilter.get();

        // return Maestro.Client.getProductsAndGroups(generalFindCriteria, 'categories', categoryFilter);
        return Maestro.Client.getProductsAndGroupsOptimize(generalFindCriteria, sortCriteria, categoryFilter);
    },

    getProductsInGroupWithFilters: function(groupName){
        let findCriteria = {};

        findCriteria.status = "Active";

        return Maestro.Client.getProductsInGroup(groupName, findCriteria);
    },

    getCustomers: function(){
        return Template.instance().searchCustomersList.get();
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

    getCategoryTileColor: function(categoryName, colorCode){
        let allowedColors = Maestro.Products.Categories.Colors;
        let categoryFilter = Template.instance().ordersSelectedCategoryFilter.get();

        if (_.find(allowedColors, function(color){return color.key == colorCode;})){
            if (categoryName == categoryFilter.primary){
                return "background-color:#" + colorCode + ";";
            } else {
                return "background-color:#" + colorCode + ";";
            }
        } else {
            if (categoryName == categoryFilter.primary){
                return "background-color:#bdbdbd;";
            } else {
                return "background-color:#bdbdbd;";
            }
        }
    },

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

    getPureAddOns: function(addOns){
        return Maestro.POS.AddOns.getPureAddOns(addOns);
    },

    getProductAttachedPureAddOns: function(addOns){
        return Maestro.POS.AddOns.getProductAttachedPureAddOns(addOns); 
    },

    getSubstituteAddOns: function(addOns){
        return Maestro.POS.AddOns.getSubstituteAddOns(addOns);
    },

    getProductAttachedSubstituteAddOns: function(addOns){
        return Maestro.POS.AddOns.getProductAttachedSubstituteAddOns(addOns); 
    },

    allOtherAddons: function(productAddOns){
        return Maestro.POS.AddOns.getAllOtherAddOns(productAddOns);
    },

    getAddOnInfo: function(addOnId){
        return Maestro.POS.AddOns.getAddOnInfo(addOnId);
    },

    POSAddingofAddonsAllowed: function(){
        return Maestro.Business.getConfigurations().allowPOSAddOnCreation || false;
    },

    POSAddingofSubstitutesAllowed: function(){
        return Maestro.Business.getConfigurations().allowPOSSubsitutionCreation || false;
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

    isLoyaltyProgramTypeSelected: function(type){
        if(type == Template.instance().orderLoyaltyType.get()){
            return true;
        }
        return false;
    },

    getLoyaltyTileColor: function(type){
        if(type == "Quantity"){
            return 'quantityLoyaltyColor';
        } else if (type == "Percentage"){
            return 'percentageLoyaltyColor';
        } else if (type == "Amount"){
            return 'amountLoyaltyColor';
        }
        return 'grey lighten-2';
    },

    getActiveLoyaltyPrograms: function(){
        let selectedProgramType = Template.instance().orderLoyaltyType.get();
        let sort = {sort: {'programType.type': -1, name: 1}};
        if (selectedProgramType == 'All'){
            return Maestro.Loyalty.GetLoyaltyPrograms({status:'Active', 'programType.type': {$ne: 'Tally'}}, sort);
            // return LoyaltyPrograms.find({status:'Active', 'programType.type': {$ne: 'Tally'}}).fetch();
        } else {
            return Maestro.Loyalty.GetLoyaltyPrograms({status:'Active', 'programType.type': selectedProgramType}, sort);
            // let filteredList = _.filter(LoyaltyPrograms.find({status:'Active', 'programType.type': {$ne: 'Tally'}}).fetch(), function(program){
            //     return program.programType.type == selectedProgramType;
            // });
            // return filteredList;
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
        return !Maestro.POS.Loyalty.isThisLoyalty(itemId);
    },

    itemNotLoyaltyRedeem: function(productId){
        return !Maestro.POS.Loyalty.isThisLoyaltyRedeemItem(productId);
    },

    primaryCategories: function(){
        return Maestro.Client.getPrimaryCategories();
    },

    secondaryCategories: function(primaryCategory){
        return Maestro.Client.getSecondaryCategories(primaryCategory);
    },

    allCategories: function(){
        return Maestro.Client.getAllCategories();
    },

    categories: function(){ //deprecated, delete at a later time
        return ProductCategories.find({});
    },
    categoryColor: function () {
        var product = this;
        if(!_.isEmpty(product.categories)) {
            return Maestro.Client.getCategoryColor(product.categories[0]);
        }
        return "amethyst";
    },
    // customers: function () {
    //     return Template.instance().lists.get(CUSTOMERS);
    // },
    noItems: function () {
        // return _.isEmpty(Template.instance().orderItems.all());
        return _.isEmpty(Maestro.POS.OrderItems.getAllItems(Template.instance()));
    },
    defaultSize: function () {
        return this.price > 0 && Maestro.Client.isProductSizePreferred(this.code);
    },
    itemsList: function () {
        // return _.sortBy(_.values(Template.instance().orderItems.all()),'itemNumber');
        return _.sortBy(Maestro.POS.OrderItems.getAllItems(Template.instance()),'itemNumber');
    },
    itemsListBySeat: function () {
        return _.sortBy(Maestro.POS.OrderItems.getAllSeatItems(Template.instance()),'itemNumber');
    },
    itemTotal: function () {
        return Maestro.POS.Tools.getItemTotal(this);
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
        return Maestro.POS.Loyalty.anyOrderGiftCards(Template.instance().existingAmountLoyalty.get());
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
            if (Maestro.POS.Loyalty.anyOrderGiftCards(Template.instance().existingAmountLoyalty.get())){
                return Template.instance().cashAmountGiven.get() - Maestro.Payment.CashRounding(Template.instance().paymentDueAmount.get());
            } else {
                return Template.instance().cashAmountGiven.get() - Template.instance().orderTotals.get("cash-total");
            }
        } else {
            return 0.00;
        }
    },

    splitCashChangeDue: function(){
        let splitBy = Template.instance().orderSplitEquallyBy.get();
        if(Template.instance().cashAmountGiven.get()){
            if (Maestro.POS.Loyalty.anyOrderGiftCards(Template.instance().existingAmountLoyalty.get())){
                return Template.instance().cashAmountGiven.get() - Maestro.Payment.CashRounding(Template.instance().paymentDueAmount.get() / splitBy);
            } else {
                return Template.instance().cashAmountGiven.get() - Template.instance().orderTotals.get("cash-total") / splitBy;
            }
        } else {
            return 0.00;
        }
    },

    splitPaymentDueAmount: function(amount, moneyType){
        if(moneyType != "cash"){
            return amount / Template.instance().orderSplitEquallyBy.get();
        } else {
            return Number(Maestro.Payment.CashRounding(amount / Template.instance().orderSplitEquallyBy.get()));
        }
    },

    splitIsNotReconciling: function(amount, moneyType){
        // console.log('money type = ', moneyType);
        
        let splitBy = Template.instance().orderSplitEquallyBy.get();
        let originalTotal = Number(amount);
        let equalPayments;

        if(moneyType != "cash"){
            equalPayments = Number(Maestro.Numbers.Accounting.toFixed(originalTotal / splitBy, 2));
        } else {
            equalPayments = Number(Maestro.Payment.CashRounding(originalTotal / splitBy));
        }
        
        let totalPayments = equalPayments * splitBy;

        // console.log('originalTotal = ', originalTotal);
        // console.log('equalPayments = ', equalPayments);
        // console.log('totalPayments = ', totalPayments);

        if( totalPayments != originalTotal){
            return true;
        }
        return false;
    },

    splitFairPayment: function(amount, moneyType){
        // console.log('money type = ', moneyType);
        
        let splitBy = Template.instance().orderSplitEquallyBy.get();
        let originalTotal = Number(amount);
        let equalPayments;

        if(moneyType != "cash"){
            equalPayments = Number(Maestro.Numbers.Accounting.toFixed(originalTotal / splitBy, 2));
        } else {
            equalPayments = Number(Maestro.Payment.CashRounding(originalTotal / splitBy));
        }

        let totalPayments = equalPayments * splitBy;

        if( totalPayments != originalTotal){
            let difference = originalTotal - totalPayments;
            return equalPayments + difference;
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
    previousOrder: function() {
        let previousOrder = Maestro.Order.GetLatestCompletedOrder();
        // console.log('previousOrder: ', previousOrder);
        return previousOrder;
    },
    processedOrderCustomer: function() {
        return Template.instance().previousOrderCustomer.get();
    },
    getOrderCustomer: function(customerId){
        return Customers.findOne({_id: customerId});
    },
    getActivePrograms: function(){
        return Template.instance().existingCustomerLoyaltyPrograms.get();
    },
    getActiveTallyPrograms: function(){
        // return Maestro.LoyaltyCards.getActiveTallyCards(customerId);
        // console.log('tally: ', Template.instance().existingTallyPrograms.get());
        return Template.instance().existingTallyPrograms.get();
    },

    getCustomerActivePrograms: function(customerId){
        return Maestro.LoyaltyCards.getCustomerActiveCards(customerId);
        // return _.reject(Customers.findOne({_id: customerId}).loyaltyPrograms, function(program){return program.expired;});
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
        // let allOrderLoyaltyItems = Template.instance().orderLoyaltyItems.get();
        // return _.findWhere(allOrderLoyaltyItems, {_id: programId});
        return Maestro.POS.Loyalty.getLoyaltyOrderItemProgram(programId);
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
        // console.log(Template.instance().thisOrderItem.get());
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
    },

    getSelectedCheckoutSeat: function(){
        return Template.instance().checkoutSeatSelected.get();
    },

    isPaymentMethodCash: function(method){
        return method == 'cash';
    },

    getPaymentMethod: function(method){
        return Maestro.Payment.MethodsEnum.get(method, "label");
    },

    startWithExpressPage: function(){
        return Template.instance().showExpressPage.get();
    },

    rememberOrderSelected: function(){
        return Template.instance().rememberOrderType.get();
    },

    noOrderTypeSelected: function(){
        return !Template.instance().orderType.get();
    },

    showOrderTypeOptions: function(){
        let orderType = Template.instance().orderType.get()
        if(!orderType){
            return true;
        } else if (orderType == "EXPRESS"){
            return true;
        } else if (orderType == "DINEIN"){
            return true;
        }
        return false;
    },

    inExpressMode: function(){
        return Template.instance().orderType.get() == "EXPRESS";
    },

    inDineInMode: function(){
        return Template.instance().orderType.get() == "DINEIN";
    },

    inTakeOutMode: function(){
        return Template.instance().orderType.get() == "TAKEOUT";
    },

    inDeliveryMode: function(){
        return Template.instance().orderType.get() == "DELIVERY";
    },

    getOrderInfoName: function(){
        return Template.instance().orderInformation.orderName;
    },

    getOrderInfoPhone: function(){
        return Template.instance().orderInformation.orderPhone;
    },

    getOrderInfoUnitNum: function(){
        return Template.instance().orderInformation.unitNumber;
    },
    getOrderInfoBuzzer: function(){
        return Template.instance().orderInformation.buzzerNumber;
    },

    getOrderInfoStreetNum: function(){
        return Template.instance().orderInformation.streetNumber;
    },

    getOrderInfoStreet: function(){
        return Template.instance().orderInformation.street;
    },

    getOrderInfoCity: function(){
        return Template.instance().orderInformation.city;
    },

    getOrderInfoPostalCode: function(){
        return Template.instance().orderInformation.postalCode;
    },

    getOrderInfoInstructions: function(){
        // console.log(Template.instance().orderInformation.instructions);
        return Template.instance().orderInformation.instructions;
    },

    getRememberedOrderType: function(){
        let saved = UserSession.get(Maestro.UserSessionConstants.POS_START_ORDER_TYPE);
        
        if(saved == "EXPRESS"){
            return "Express";
        } else if (saved == "DINEIN"){
            return "Dine-In";
        } else if (saved == "TAKEOUT"){
            return "Take-Out";
        } else if (saved == "DELIVERY"){
            return "Delivery";
        }

        return null;
    },

    getOrderTypeLabel: function(){
        let saved = Template.instance().orderType.get();
        
        if(saved == "EXPRESS"){
            return "Express";
        } else if (saved == "DINEIN"){
            return "Dine-In";
        } else if (saved == "TAKEOUT"){
            return "Take-Out";
        } else if (saved == "DELIVERY"){
            return "Delivery";
        }

        return null;
    },

    isNumberPadFocusOnCashGiven: function(){
        if(Template.instance().numberPadFocusTo.get() == "CASHGIVEN"){
            return true;
        }
        return false;
    },

    isNumberPadFocusOnTipGiven: function(){
        if(Template.instance().numberPadFocusTo.get() == "TIPGIVEN"){
            return true;
        }
        return false;
    },

    isTipsTracked: function(){
        return Maestro.Business.getConfigurations().trackTips || false;
    },

    getTipGiven: function(){
        return Template.instance().tipGiven.get();
    },

    getSystemEmployee: function(){
        return UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE);
    },

    showSubtotalsAndDetails: function(){
        return Template.instance().showSubtotalsDetails.get();
    },

    defaultCashPayment: function(){
        if(UserSession.get(Maestro.UserSessionConstants.POS_DEFAULT_PAYMENT_METHOD) == "CASH"){
            return true;
        } 
        return false;
    },

    defaultCardPayment: function(){
        if(UserSession.get(Maestro.UserSessionConstants.POS_DEFAULT_PAYMENT_METHOD) == "CARD"){
            return true;
        } 
        return false;
    },

    alwaysPrintReceipt: function(){
        return UserSession.get(Maestro.UserSessionConstants.POS_ALWAYS_PRINT_RECEIPT);
    },

    alwaysOpenPriorOrderSummary: function(){
        return UserSession.get(Maestro.UserSessionConstants.POS_ALWAYS_PRIOR_ORDER_SUMMARY);
    },

    isCustomerSearchTypeSelected: function(field){
        if(field == UserSession.get(Maestro.UserSessionConstants.CUSTOMER_SEARCH_TYPE)){
            return true;
        }
    },
};

Maestro.POS.Views.restaurantEvents = {
    'click .toggleShowingOfSubtotalsDetails': function(event, template){
        if(template.showSubtotalsDetails.get()){
            template.showSubtotalsDetails.set(false);
        } else {
            template.showSubtotalsDetails.set(true);
        }
    },

    'click .startExpressMode': function(event, template){
        $('ul.tabs').tabs('select_tab', 'restaurantOrderCreateTab');
        $('ul.tabs').tabs('select_tab', 'order-products');
        $('ul.tabs').tabs('select_tab', 'searchCustomer');

        template.orderType.set("EXPRESS");
        if(template.rememberOrderType.get() == true){
            UserSession.set(Maestro.UserSessionConstants.POS_START_ORDER_TYPE, "EXPRESS");
        }

        template.orderInformation.orderType = "EXPRESS";

    },

    'click .startDineInMode': function(event, template){
        $('ul.tabs').tabs('select_tab', 'restaurantOrderCreateTab');
        $('ul.tabs').tabs('select_tab', 'order-tables');
        $('ul.tabs').tabs('select_tab', 'searchCustomer');

        // template.orderType.set("DINEIN");
        if(template.rememberOrderType.get() == true){
            UserSession.set(Maestro.UserSessionConstants.POS_START_ORDER_TYPE, "DINEIN");
        }

        // template.orderInformation.orderType = "DINEIN";
    },

    'click .startTakeOutMode': function(event, template){
        template.orderType.set("TAKEOUT");
        if(template.rememberOrderType.get() == true){
            UserSession.set(Maestro.UserSessionConstants.POS_START_ORDER_TYPE, "TAKEOUT");
        }

        template.orderInformation.orderType = "TAKEOUT";
    },

    'click .startDeliveryMode': function(event, template){
        template.orderType.set("DELIVERY");
        if(template.rememberOrderType.get() == true){
            UserSession.set(Maestro.UserSessionConstants.POS_START_ORDER_TYPE, "DELIVERY");
        }

        template.orderInformation.orderType = "DELIVERY";
    },

    'click .continueToOrder': function(event, template){
        $('ul.tabs').tabs('select_tab', 'restaurantOrderCreateTab');
        $('ul.tabs').tabs('select_tab', 'order-products');
        $('ul.tabs').tabs('select_tab', 'searchCustomer');

        if(template.orderType.get() == "TAKEOUT"){
            template.selectedTable.set({
                _id: "TAKEOUT",
                tableLabel: "Take-Out",
                defaultSeats: 1,
            });
            Maestro.POS.SVGTableLayout.clearSVGTableSelect(template);

            let orderInformation = {
                orderName: $("#orderNameField").val() || "",
                orderPhone: $("#orderPhoneField").val() || "",
                instructions: $("#deliveryInstructionsField").val() || "",
                orderType: "TAKEOUT"
            };

            template.orderInformation = orderInformation;
        } else if (template.orderType.get() == "DELIVERY"){
            template.selectedTable.set({
                _id: "DELIVERY",
                tableLabel: "Delivery",
                defaultSeats: 1,
            });
            Maestro.POS.SVGTableLayout.clearSVGTableSelect(template);

            let orderInformation = {
                orderName: $("#orderNameField").val() || "",
                orderPhone: $("#orderPhoneField").val() || "",
                unitNumber: $("#unitNumberField").val() || "",
                buzzerNumber: $("#buzzerNumberField").val() || "",
                streetNumber: $("#streetNumberField").val() || "",
                street: $("#streetField").val() || "",
                city: $("#cityField").val() || "",
                postalCode: $("#postalCodeField").val() || "",
                instructions: $("#deliveryInstructionsField").val() || "",
                orderType: "DELIVERY"
            };

            template.orderInformation = orderInformation;
        }

        // console.log('order info: ', template.orderInformation);
    },

    'click .toggleRememberOrderType': function(event, template){
        if(template.rememberOrderType.get()){
            template.rememberOrderType.set(false);
            UserSession.set(Maestro.UserSessionConstants.POS_START_ORDER_TYPE, null);
        } else {
            template.rememberOrderType.set(true);
        }
    },

    'click .clearOrderTypeSelection': function(event, template){
        template.orderType.set(null);
        template.selectedTable.set(null);
    },

    'click .goToOrderDetailsTab': function(event, template){
        $('ul.tabs').tabs('select_tab', 'orderDetailsTab');

    },

    'click .goToProgramsTab': function(event, template){
        $('ul.tabs').tabs('select_tab', 'order-loyalty');
    },

    'click .goToCustomersTab': function(event, template){
        $('ul.tabs').tabs('select_tab', 'order-customers');  
    },

    'click .goToCustomerCreateTab': function(event, template){
        $('ul.tabs').tabs('select_tab', 'newCustomerAdd');

        template.customerTabMode.set('create');
    },


    'click .editCustomerDetails': function(event, template){
        Maestro.POS.UI.ToggleEditCustomerDetails();
    },

    'click .createNewCustomerForm': function(event, template){
        document.getElementById('create-customer').reset();
        Maestro.POS.UI.ToggleNewCustomerForm();
    },

    'blur #customer-name': function(event, template) {
        $('#customer-name').removeClass("invalid");

        if(Maestro.Customers.CustomerNameExists(template.find("#customer-name").value)){
            Materialize.toast('Caution: Identical Customer Name Exists. Ask for Email.', 2000, 'rounded');
            $('#customer-name').addClass("invalid");
        }

    },

    'blur #email': function(event, template) {
        $('#email').removeClass("invalid");

        if(Maestro.Customers.CustomerEmailExists(template.find("#email").value)){
            Materialize.toast('Identical Email Already Exists.', 2000, 'rounded red');
            $('#email').addClass("invalid");
        }
    },

    'blur #customerPhone': function(event, template) {
        $('#customerPhone').removeClass("invalid");

        if(Maestro.Customers.CustomerPhoneExists(template.find("#customerPhone").value)){
            Materialize.toast('Identical Phone # Exists. Ask for Email.', 2000, 'rounded red');
            $('#customerPhone').addClass("invalid");
        }
    },

    'click #submitNewCustomer': function(event, template) {
        event.preventDefault();

        let customerName = template.find("#customer-name").value,
            email = template.find("#email").value,
            unformattedPhone = template.find('#customerPhone').value;

        let newCustId = Maestro.Customers.SubmitCustomerCreateInfo(customerName, email, unformattedPhone);

        if(!!newCustId){
            Materialize.toast("Created customer", 4000, 'rounded green');
            document.getElementById('create-customer').reset();
            Maestro.POS.Loyalty.clearCustomerInfo(template);
            template.newCustomerId.set(newCustId);
            $('ul.tabs').tabs('select_tab', 'order-loyalty');
            Maestro.POS.UI.ToggleNewCustomerForm();
        } else {
            // console.log("error creating new customer");
        }
    },

    'click #save-changes-customer': function(event, template) {

        let customerId = template.orderCustomer.get()._id;
        
        var customerName = template.find("#edit-customer-name").value,
                email = template.find("#edit-email").value,
                unformattedPhone = template.find('#edit-customerPhone').value;

        let updated = Maestro.Customers.SubmitCustomerEditInfo(customerId, customerName, email, unformattedPhone);

        if(updated){
            Materialize.toast("Updated Details", 2000, 'rounded green');
            Maestro.POS.UI.ToggleEditCustomerDetails();
            Maestro.POS.Loyalty.clearCustomerInfo(template);
            let customer = Customers.findOne({_id: customerId});
            Template.instance().orderCustomer.set(customer);
            Maestro.POS.Loyalty.getExistingCustomerLoyaltyPrograms(customer, template);
        } else {
            // console.log("error updating customer");
        }
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
        let loyaltyProduct = this;
        let programId = $(event.target).data("programid");
        Maestro.POS.Loyalty.addLoyaltyProgramPurchase (template, programId, loyaltyProduct);
    },

    'click .increase-loyaltyItem-quantity':function(event, template){
        Maestro.POS.Loyalty.incrementLoyaltyProgramPurchase(template, this, 1);
    },

    'click .decrease-loyaltyItem-quantity': function(event, template){
        let orderItem = this;
        
        if(!orderItem){return}

        if(orderItem.quantity > 1){
             Maestro.POS.Loyalty.incrementLoyaltyProgramPurchase(template, this, -1);
        }
    },

    'click .delete-item': function (event, template) {
        event.preventDefault();
        let orderItem = this;

        let seat = template.selectedSeat.get();
        let seatNumber = seat ? seat.seatNumber : null;

        // let key = getSeatKey(seatNumber) + this.size.code + "-" + this.product._id + getAddOnKey(orderItem.addOns);
        let key = Maestro.POS.Tools.generateKey(this.size.code, this.product._id, orderItem.addOns, seatNumber);

        if(LoyaltyPrograms.findOne({_id: this.product._id})){
            let allOrderLoyaltyItems = Template.instance().orderLoyaltyItems.get();
            Maestro.POS.Loyalty.setPrePurchaseLoyaltyApplyStatus(_.findWhere(allOrderLoyaltyItems, {_id: this.product._id}), false, template);
            Maestro.POS.Loyalty.removeLoyaltyItem(this.product._id, template);
            Maestro.POS.OrderItems.removeItem(template, null, orderItem._id);
            // console.log('ran through all the steps');
            // Maestro.POS.Loyalty.deleteIfAnyRedeemProduct(key, template);
        } else {
            Maestro.POS.OrderItems.removeItem(template, null, orderItem._id);
            Maestro.POS.Loyalty.deleteIfAnyRedeemProduct(key, template);

            Maestro.POS.Loyalty.checkOrderForLoyaltyCreditItems(template);
        }

       
    },

    'click .enableProductSearch': function(event, template){
        if (template.enableProductSearch.get()){
            template.enableProductSearch.set(false);
        } else {
            template.enableProductSearch.set(true);
        }
    },

    // 'keyup #product-search': function (event, template) {
    //     let searchTerm = $(event.currentTarget).val();
    //     setProductSearchCriteria(searchTerm, template);
    // },

    'click .selectCustomerSearchField': function(event, template){
        let searchField = $(event.target).data('field');
        // template.customerSearchFieldSelected.set(searchField);  
        UserSession.set(Maestro.UserSessionConstants.CUSTOMER_SEARCH_TYPE, searchField);
        // console.log(searchField);

        Maestro.POS.UI.FocusOnCustomerSearchField();
    }, 

    // 'keyup #customer-search': function (event, template) {
    //     let searchTerm = $(event.currentTarget).val();
    //     if(searchTerm.length>1){
    //         template.customerSearchCriteria.set("NAME", searchTerm);
    //         Maestro.POS.Loyalty.setCustomerSearchCriteria(searchTerm, template);
    //     }
    // },

    'keyup #customer-name-search': function (event, template) {
        let searchName = $(event.currentTarget).val();

        Maestro.POS.Loyalty.customerSearch(template, 'name', searchName, false, optimize = false)
    },

    'keyup #customer-phone-search': function (event, template) {
        let searchPhone = $(event.currentTarget).val();

        let formattedPhone = Maestro.Customers.Tools.FormatPhoneNumber(searchPhone);

        Maestro.POS.Loyalty.customerSearch(template, 'phone', formattedPhone);
    },

    'keyup #customer-email-search': function (event, template) {
        let searchEmail = $(event.currentTarget).val();
                
        Maestro.POS.Loyalty.customerSearch(template, 'email', searchEmail);
    },

    // 'click .categoryFilter': function(event, template) {
    //     let searchTerm = $(event.target).data("category");
    //     setProductCategorySearchCriteria(searchTerm, template);
    // },

    // 'click .alphabetFilter': function(event, template){
    //     let searchTerm = $(event.target).data("alphabet");
    //     template.customerSearchCriteria.set("NAME", "Alphabet:"+searchTerm);
    //     Maestro.POS.Loyalty.setCustomerAlphabetSearchCriteria(searchTerm, template);
    // },

    // 'click .clear-product-search': function (event, template) {
    //     clearProductSearchCriteria(template);
    // },

    'click .clear-customer-search': function (event, template) {
        Maestro.POS.Loyalty.clearCustomerSearch(template);

    },
    'click .select-customer': function (event, template) {
        Maestro.POS.Loyalty.clearCustomerInfo(template);
        let customer = Customers.findOne({_id: this._id})

        // let seat = template.selectedSeat.get() || {};
        // let seatNumber = seat.seatNumber;

        // let tableCustomers = template.orderCustomer.get();

        // tableCustomers[seatNumber] = customer;

        template.orderCustomer.set(customer);

        Maestro.POS.Loyalty.getExistingCustomerLoyaltyPrograms(customer, template);
        // checkAutoRedeemForCustomer(this, template);
        // console.log(customer);
    },

    'click .deselectCustomer': function(event, template){
        Maestro.POS.Loyalty.clearCustomerInfo(template);
    },

    'keydown #customerPreference': function(event, template){
        var saveButton = document.getElementById('saveCustomerNotesButton');
        if (saveButton.style.display === 'none') {
            saveButton.style.display = 'block';
        } 
    },

    'blur #customerPreference': function(event, template){
        let notes = $('#customerPreference').val();
        let customerId = template.orderCustomer.get()._id;
        Maestro.Customers.UpdateCustomerNotes(customerId, notes);
    },

    // 'click .saveCustomerNotes': function(event, template){
    //     let notes = $('#customerPreference').val();
    //     let customerId = template.orderCustomer.get()._id;
    //     Maestro.Customers.UpdateCustomerNotes(customerId, notes);
    //     // var saveButton = document.getElementById('saveCustomerNotesButton');
    //     // if (saveButton.style.display === 'block') {
    //     //     saveButton.style.display = 'none';
    //     // } 
    // },

    'click .doNotApplyThisProgram': function(event, template){
        Maestro.POS.Loyalty.setLoyaltyProgramApplyStatus(this, false, template);
    },

    'click .applyThisProgram': function(event, template){
        Maestro.POS.Loyalty.setLoyaltyProgramApplyStatus(this, true, template);
    },

    'click .applyThisProgramPrePurchase': function(event, template){
        Maestro.POS.Loyalty.setPrePurchaseLoyaltyApplyStatus(this, true, template);
    },

    'click .doNotApplyThisProgramPrePurchase': function(event, template){
        Maestro.POS.Loyalty.setPrePurchaseLoyaltyApplyStatus(this, false, template);
    },

    'click .emailInstructionsTrackLoyalty': function(event, template){
        let customer = this;
        Maestro.POS.Loyalty.emailInstructionsTrackLoyalty(customer);
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

    'click .setNumberPadFocusToCashGiven': function(event, template){
        template.numberPadFocusTo.set('CASHGIVEN');
    },

    'click .setNumberPadFocusToTipGiven': function(event, template){
        template.numberPadFocusTo.set('TIPGIVEN');
    },

    'click .showCashPaymentInfo': function(event, template){
        template.showPaymentInfoFor.set('cash');
        template.numberPadFocusTo.set('CASHGIVEN');
    },

    'click .showCardPaymentInfo': function(event, template){
        template.showPaymentInfoFor.set('card');
        template.numberPadFocusTo.set('TIPGIVEN');
    },

    'click .showLoyaltyPaymentInfo': function(event, template){
        template.showPaymentInfoFor.set('loyalty');
    },

    'click .showAdjustmentInfo': function(event, template){
        template.showPaymentInfoFor.set('adjustment');
    },

    'blur .variablePricingInput': function(event, template){
        let orderItem = this;
        let variablePrice = Number(document.getElementById(this._id+"_variable_price").value);

        if(variablePrice <= 0){ return ;}

        if(orderItem.unitBasedPriceQuantity){
            orderItem.size.price = variablePrice * orderItem.unitBasedPriceQuantity;
        } else {
            orderItem.size.price = variablePrice;
        }

        Maestro.POS.OrderItems.setItemAttr(template, this, {unitPrice: variablePrice});

        Maestro.POS.OrderItems.setItemAttr(template, this, {size: orderItem.size});
    },

    // 'click .saveVariablePricing': function(event, template){
    //     let orderItem = this;
    //     let variablePrice = Number(document.getElementById(this._id+"_variable_price").value);

    //     if(variablePrice <= 0){ return ;}

    //     if(orderItem.unitBasedPriceQuantity){
    //         orderItem.size.price = variablePrice * orderItem.unitBasedPriceQuantity;
    //     } else {
    //         orderItem.size.price = variablePrice;
    //     }

    //     Maestro.POS.OrderItems.setItemAttr(template, this, {unitPrice: variablePrice});

    //     Maestro.POS.OrderItems.setItemAttr(template, this, {size: orderItem.size});
    // },

    'blur .unitBasedPricingInput': function(event, template){
        let orderItem = this;
        let unitQuantity = Number(document.getElementById(this._id+"_unit_quantity").value);

        if(unitQuantity <= 0){return ;}

        orderItem.unitBasedPriceQuantity = unitQuantity;
        Maestro.POS.OrderItems.setItemAttr(template, this, {unitBasedPriceQuantity: unitQuantity});

        orderItem.size.price = unitQuantity * orderItem.unitPrice;
        Maestro.POS.OrderItems.setItemAttr(template, this, {size: orderItem.size});
    },

    // 'click .saveUnitBasedPriceQuantity': function(event, template){
    //     let orderItem = this;
    //     let unitQuantity = Number(document.getElementById(this._id+"_unit_quantity").value);

    //     if(unitQuantity <= 0){return ;}

    //     orderItem.unitBasedPriceQuantity = unitQuantity;
    //     Maestro.POS.OrderItems.setItemAttr(template, this, {unitBasedPriceQuantity: unitQuantity});

    //     orderItem.size.price = unitQuantity * orderItem.unitPrice;
    //     Maestro.POS.OrderItems.setItemAttr(template, this, {size: orderItem.size});
    // },

    'click .open-addon-select': function(event, template){
        template.thisOrderItem.set(this);
        Maestro.POS.OrderItems.setAllItemsAttr(template, {optionsExpanded: false}); // close any other expanded options
        Maestro.POS.OrderItems.setItemAttr(template, this, {optionsExpanded: true});
        Maestro.POS.OrderItems.setItemAttr(template, this, {optionsExpandType: "ADDONS"});
    },

    'click .close-addon-select': function(event, template){
        Maestro.POS.OrderItems.setItemAttr(template, this, {optionsExpanded: false});
    },

    'click .options-expand-addons': function(event, template){
        Maestro.POS.OrderItems.setItemAttr(template, this, {optionsExpandType: "ADDONS"});
    },

    'click .options-expand-substitutions': function(event, template){
        Maestro.POS.OrderItems.setItemAttr(template, this, {optionsExpandType: "SUBSTITUTIONS"});
    },

    'click .options-expand-notes': function(event, template){
        Maestro.POS.OrderItems.setItemAttr(template, this, {optionsExpandType: "NOTES"});
    },

    'click .options-expand-discount': function(event, template){
        Maestro.POS.OrderItems.setItemAttr(template, this, {optionsExpandType: "DISCOUNTS"});
        if(!this.manualDiscount){
            let manualDiscount = {
                discountPercent: 100,
                includeAddOns: false,
                quantity: this.quantity,
            };
            Maestro.POS.OrderItems.setItemAttr(template, this, {manualDiscount: manualDiscount});
        }
    },

    'click .toggleIncludeAddOn': function(event, template){
        if(this.manualDiscount.includeAddOns == true){
            let manualDiscount = {
                discountPercent: this.manualDiscount.discountPercent,
                includeAddOns: false,
                quantity: this.manualDiscount.quantity
            };
            Maestro.POS.OrderItems.setItemAttr(template, this, {manualDiscount: manualDiscount});
            // console.log('dont include', this);
        } else {
            let manualDiscount = {
                discountPercent: this.manualDiscount.discountPercent,
                includeAddOns: true,
                quantity: this.manualDiscount.quantity
            };
            Maestro.POS.OrderItems.setItemAttr(template, this, {manualDiscount: manualDiscount});
            // console.log('include', this);
        }
    },

    'click .create-new-add-on': function(event, template){
        let addonName = String(document.getElementById('new-add-on-name').value);
        let addonPrice = Number(document.getElementById('new-add-on-price').value);
        
        if(!addonName){return false;}
        
        let newAddonId = Maestro.POS.AddOns.CreateNew(addonName, addonPrice);
        // if(!newAddonId){Materialize.toast("AddOn Created", 1000)}

        Maestro.POS.OrderItems.productAddonSelect(template, Maestro.POS.AddOns.getAddOn(newAddonId));

        document.getElementById('new-add-on-name').value = null;
        document.getElementById('new-add-on-price').value = null;
    },

    'click .create-new-substitute': function(event, template){
        let substituteNo = String(document.getElementById('new-substitute-label-NO').value);
        let substituteADD = String(document.getElementById('new-substitute-label-ADD').value);
        let substitutePrice = Number(document.getElementById('new-substitute-price').value);
        
        let addonName = "";

        if(!substituteNo & !substituteADD){return;}

        if(!!substituteNo){addonName += "NO: "+substituteNo}
        if(!!substituteADD){
            if(!!addonName){addonName += ", ";}
            addonName += "ADD: " + substituteADD}

        if(!addonName){return;}
        
        let newAddonId = Maestro.POS.AddOns.CreateNew(addonName, substitutePrice, true);
        // if(!newAddonId){Materialize.toast("Substitute Created", 1000)}

        Maestro.POS.OrderItems.productAddonSelect(template, Maestro.POS.AddOns.getAddOn(newAddonId));

        document.getElementById('new-substitute-label-NO').value = null;
        document.getElementById('new-substitute-label-ADD').value = null;
        document.getElementById('new-substitute-price').value = null;
        document.getElementById('substituteNamePreview').value = null;
    },

    'click .create-new-note': function(event, template){
        let noteDescription = String(document.getElementById('new-note-description').value);
        
        if(!noteDescription){return false;}
        
        Maestro.POS.Notes.CreateNew(template, noteDescription);

        document.getElementById('new-note-description').value = null;
    },

    'click .add-redeem-item': function(event, template){
        // console.log('clicked: ', this);
        let orderItem = this;
        let includeAddOns = orderItem.manualDiscount.includeAddOns;
        let discountPercent = Number(document.getElementById('discount-percent').value);
        let quantity = Number(document.getElementById('discount-quantity').value);

        if(discountPercent > 100 || discountPercent < 1){
            Materialize.toast('Invalid Discount Percent', 1000);
            return;
        }

        if (quantity > orderItem.quantity || quantity < 1){
            Materialize.toast('Invalid Discount Quantity', 1000);
            return;
        }

        let manualDiscount = {
            discountPercent: discountPercent,
            includeAddOns: this.manualDiscount.includeAddOns,
            quantity: quantity
        };

        Maestro.POS.OrderItems.setItemAttr(template, this, {manualDiscount: manualDiscount});

        Maestro.POS.OrderItems.addRedeemItem(template, orderItem, quantity, discountPercent/100, includeAddOns);
        Maestro.POS.OrderItems.setAllItemsAttr(template, {optionsExpanded: false});
    },

    'click .remove-note': function(event, template){
        Maestro.POS.Notes.RemoveNote(template, String(this));
    },    

    'keydown #new-substitute-label-NO, keydown #new-substitute-label-ADD': function(event, template){
        let substituteNo = String(document.getElementById('new-substitute-label-NO').value);
        let substituteADD = String(document.getElementById('new-substitute-label-ADD').value);
        let substitutePrice = Number(document.getElementById('new-substitute-price').value);
        
        let addonName = "";

        if(!substituteNo & !substituteADD){return;}

        if(!!substituteNo){addonName += "NO: "+substituteNo}
        if(!!substituteADD){
            if(!!addonName){addonName += ", ";}
            addonName += "ADD: " + substituteADD}

        document.getElementById('substituteNamePreview').value = addonName;
    },  

    'click #delete-order': function(event, template){
        event.preventDefault();

        // console.log('deleting order');
        //reset / re-initialize order screen
        Maestro.POS.clearOrder(template);
        Maestro.POS.Tools.checkForEditCheckoutMode(template);
        // if(template.inOrderEditMode.get()){
        //     let editOrderId = FlowRouter.getParam("orderId");
        //     let editOrder = Orders.findOne({_id: editOrderId});            
        //     Maestro.POS.Tools.initEditOrder(editOrder, template);
        // }
    },

    'click .addToCashAmountGiven': function(event,template){
        let amount = Number($(event.target).data('cashamount'));
        if(template.numberPadFocusTo.get() == "CASHGIVEN"){
            let currentAmount = template.cashAmountGiven.get();
            template.cashAmountGiven.set(currentAmount + amount);
        } else if (template.numberPadFocusTo.get() == "TIPGIVEN"){
            let currentAmount = template.tipGiven.get();
            template.tipGiven.set(currentAmount + amount);
            Maestro.POS.Loyalty.applyGiftCards (template);
        }
    },

    'click .addToCashDigitGiven': function(event, template){
        let digit = $(event.target).data('cashdigit');
        if(template.numberPadFocusTo.get() == "CASHGIVEN"){
            let currentAmount = template.cashAmountGiven.get();
            let newAmount = Number(String((currentAmount*100).toFixed(0)) + digit)/100;
            template.cashAmountGiven.set(newAmount);
        } else if (template.numberPadFocusTo.get() == "TIPGIVEN"){
            let currentAmount = template.tipGiven.get();
            let newAmount = Number(String((currentAmount*100).toFixed(0)) + digit)/100;
            template.tipGiven.set(newAmount);
            // Maestro.POS.Loyalty.applyGiftCards (template);
        }
    },

    'click .clearCashAmountGiven': function(event, template){
        if(template.numberPadFocusTo.get() == "CASHGIVEN"){
            template.cashAmountGiven.set(0);
        } else if (template.numberPadFocusTo.get() == "TIPGIVEN"){
            template.tipGiven.set(0);
            // Maestro.POS.Loyalty.applyGiftCards (template);
        }
    },

    'click .manualAdjustment': function(event, template){
        let adjustment = Number($(event.target).data('percent'));
        template.adjustmentAmount.set(adjustment);
        Maestro.POS.Loyalty.checkOrderForLoyaltyCreditItems(template);
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
        Maestro.POS.Loyalty.checkOrderForLoyaltyCreditItems(template);
    },

    'click .create-order': function(event, template){
        event.preventDefault();

        if(!Maestro.Client.locationId()){
            Materialize.toast('Select a location first', 2000);
            return ;
        }

        if(!template.selectedTable.get()){
            Materialize.toast('Select a table first', 2000);
            return;
        }

        if(!UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE)){
            Materialize.toast('Select Team Member Responsible For Order', 2000);
            template.openWaiterLoginUnderlay();
            template.openWaiterLoginPopup();
            return;
        }

        Maestro.Order.CreateOrder(template);

        // Maestro.POS.Navigation.goToStartTabs(template);
    },

    'click .update-order': function(event, template){
        event.preventDefault();

        if(!Maestro.Client.locationId()){
            Materialize.toast('Select a location first', 2000);
            return ;
        }

        if(!UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE)){
            Materialize.toast('Select Team Member Responsible For Order', 2000);
            template.openWaiterLoginUnderlay();
            template.openWaiterLoginPopup();
            return;
        }

        Maestro.Order.UpdateOrder(template);

        // $('ul.tabs').tabs('select_tab', 'restaurantOrderCreateTab');
        // $('ul.tabs').tabs('select_tab', 'order-products');
        // $('ul.tabs').tabs('select_tab', 'searchCustomer');
    },

    'click .beginTableCheckout': function(event, template){
        if(!Maestro.Client.locationId()){
            Materialize.toast('Select a location first', 2000);
            return ;
        }

        if(!UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE)){
            Materialize.toast('Select Team Member Responsible For Order', 2000);
            template.openWaiterLoginUnderlay();
            template.openWaiterLoginPopup();
            return;
        }

        $('ul.tabs').tabs('select_tab', 'checkoutTab'); 
    },

    'click .beginCheckout': function(event, target){
        $('ul.tabs').tabs('select_tab', 'checkoutTab'); 
    },

    'click #checkout-split-order-separately': function(event, template){
        Maestro.Order.CheckoutSeatsSeparately (template);
    },

    'click #checkout-order': function(event, template){
        event.preventDefault();

        if(!Maestro.Client.locationId()){
            Materialize.toast('Select a location first', 2000);
            return ;
        }

        if(Template.instance().selectedTable.get()){
            Maestro.Order.CheckoutOrder(template);

            // if(!UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE)){
            //     Materialize.toast('Select Team Member Responsible For Order', 2000);
            //     template.openWaiterLoginUnderlay();
            //     template.openWaiterLoginPopup();
            //     return;
            // }
        } else {
            Maestro.Order.DirectCheckoutOrder(template);
        }

        // Maestro.POS.Navigation.goToStartTabs(template);
    },

    'click #checkout-seat': function(event, template){
        if(!Maestro.Client.locationId()){
            Materialize.toast('Select a location first', 2000);
            return ;
        }

        Maestro.Order.CheckoutSeat(template);

    },

    'click #split-order-completed':function(event, template){
        Maestro.Order.CompleteSplitOrder(template);

        // Maestro.POS.Navigation.goToStartTabs(template);
    },

    'click #split-order': function(event, template){
        event.preventDefault();

        if(!Maestro.Client.locationId()){
            Materialize.toast('Select a location first', 2000);
            return ;
        }

        $('ul.tabs').tabs('select_tab', 'orderSplitTab');
    },

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

    // 'click #printReceipt':function(event, template){
    //     printOrderReceipt(template);
    // }

    'click .logoutEmployee': function(event, template){
        UserSession.set(Maestro.UserSessionConstants.SELECT_EMPLOYEE, null);
    },

    'click .openWaiterLoginPopup': function(event, template) {
        if(document.getElementById("waiterLoginScreen").style.width=="95%"){
            // document.getElementById("sideNavMenu").style.top = "0";
            // document.getElementById("sideNavMenu").style.left = "0";
            // document.getElementById("sideNavMenu").style.width = "0";
            // document.getElementById("sideNavMenu").style.height = "0";
            template.closeWaiterLogin();
            template.closeWaiterLoginUnderlay();
        } else {
            template.openWaiterLoginUnderlay();
            template.openWaiterLoginPopup();
            // document.getElementById("sideNavMenu").style.top = "75px";
            // document.getElementById("sideNavMenu").style.left = "2.5%";
            // document.getElementById("sideNavMenu").style.width = "95%";
            // document.getElementById("sideNavMenu").style.height = "75%";
            
        }
    },

   'click .closeWaiterLogin': function(event, template) {
        template.closeWaiterLogin();
        template.closeWaiterLoginUnderlay();
            // document.getElementById("sideNavMenu").style.top = "0";
            // document.getElementById("sideNavMenu").style.left = "0";
            // document.getElementById("sideNavMenu").style.width = "0";
            // document.getElementById("sideNavMenu").style.height = "0";
    },

    'click .openRecentOrderSummaryPopup': function(event, template) {
        if(document.getElementById("recentOrderSummary").style.width=="95%"){
            // document.getElementById("sideNavMenu").style.top = "0";
            // document.getElementById("sideNavMenu").style.left = "0";
            // document.getElementById("sideNavMenu").style.width = "0";
            // document.getElementById("sideNavMenu").style.height = "0";
            template.closeRecentOrderSummaryPopup();
            template.closeRecentOrderSummaryUnderlay();
            // console.log('closing summary');
        } else {
            template.openRecentOrderSummaryPopup();
            template.openRecentOrderSummaryUnderlay();
            // console.log('opening summary');
            // document.getElementById("sideNavMenu").style.top = "75px";
            // document.getElementById("sideNavMenu").style.left = "2.5%";
            // document.getElementById("sideNavMenu").style.width = "95%";
            // document.getElementById("sideNavMenu").style.height = "75%";
            
        }
    },

   'click .closeRecentOrderSummaryPopup': function(event, template) {
        template.closeRecentOrderSummaryPopup();
        template.closeRecentOrderSummaryUnderlay();
        // console.log('closing summary');
        // document.getElementById("sideNavMenu").style.top = "0";
        // document.getElementById("sideNavMenu").style.left = "0";
        // document.getElementById("sideNavMenu").style.width = "0";
        // document.getElementById("sideNavMenu").style.height = "0";
    },


    'click .toggleAlwaysPrintReceipt': function(event, template){
        if(UserSession.get(Maestro.UserSessionConstants.POS_ALWAYS_PRINT_RECEIPT)){
            UserSession.set(Maestro.UserSessionConstants.POS_ALWAYS_PRINT_RECEIPT, false);
        } else {
            UserSession.set(Maestro.UserSessionConstants.POS_ALWAYS_PRINT_RECEIPT, true);
        }
    },

    'click .toggleAlwaysOpenOrderSummary': function(event, template){
        if(UserSession.get(Maestro.UserSessionConstants.POS_ALWAYS_PRIOR_ORDER_SUMMARY)){
            UserSession.set(Maestro.UserSessionConstants.POS_ALWAYS_PRIOR_ORDER_SUMMARY, false);
        } else {
            UserSession.set(Maestro.UserSessionConstants.POS_ALWAYS_PRIOR_ORDER_SUMMARY, true);
        }
    },

    'click .setDefaultPaymentToCash': function(event, template){
        UserSession.set(Maestro.UserSessionConstants.POS_DEFAULT_PAYMENT_METHOD, 'CASH');
    },

    'click .setDefaultPaymentToCard': function(event, template){
        UserSession.set(Maestro.UserSessionConstants.POS_DEFAULT_PAYMENT_METHOD, 'CARD');
    },
};