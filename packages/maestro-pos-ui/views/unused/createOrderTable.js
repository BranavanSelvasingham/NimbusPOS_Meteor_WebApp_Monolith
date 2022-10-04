// Maestro.Templates.CreateOrderTable = "CreateOrderTable";

// let PRODUCTS = "Products";
// let CUSTOMERS = "Customers";
// let CUSTOMER_CRITERIA = ["NAME", "EMAIL", "PHONE"];

// let searchableLists = [PRODUCTS, CUSTOMERS];

// let searchableLists = [CUSTOMERS];

// initializeOrder = Maestro.POS.initializeOrder;

// clearOrder = Maestro.POS.clearOrder;

// clearCustomerInfo = Maestro.POS.Loyalty.clearCustomerInfo;

// reApplyLoyaltyPrograms = Maestro.POS.Loyalty.reApplyLoyaltyPrograms;

// var search = function(type, template) {
//     template.autorun(function () {
//         let searchTerm = template.searchCriteria.get(type);
//         Meteor.call("search" + type, searchTerm, function (error, result) {
//             template.lists.set(type, result);
//         });
//     });
// };

// updateOrderTotals = Maestro.POS.Calc.updateOrderTotals;

// calculateOrderTotals = Maestro.POS.Calc.calculateOrderTotals;

// createOrderItem = Maestro.POS.Tools.createOrderItem;

// Maestro.POS.Tools.getItemTotal = Maestro.POS.Tools.Maestro.POS.Tools.getItemTotal;

// getAddOnKey = Maestro.POS.Tools.getAddOnKey;

// Maestro.POS.Tools.generateKey = Maestro.POS.Tools.Maestro.POS.Tools.generateKey;

// getOrderItemKey = Maestro.POS.Tools.getOrderItemKey;

// getSeatKey = Maestro.POS.Tools.getSeatKey;

// Maestro.POS.Tools.selectProduct = Maestro.POS.Tools.Maestro.POS.Tools.selectProduct;

// removeProductItem = function (key, template) {Maestro.POS.OrderItems.removeItem(template, key);};

// removeLoyaltyItem = Maestro.POS.Loyalty.removeLoyaltyItem;

// setCustomerSearchCriteria = Maestro.POS.Loyalty.setCustomerSearchCriteria;

// setCustomerAlphabetSearchCriteria = Maestro.POS.Loyalty.setCustomerAlphabetSearchCriteria;

// clearCustomerSearchCriteria = Maestro.POS.Loyalty.clearCustomerSearchCriteria;

// Maestro.POS.Loyalty.setLoyaltyProgramApplyStatus = Maestro.POS.Loyalty.Maestro.POS.Loyalty.setLoyaltyProgramApplyStatus;

// Maestro.POS.Loyalty.setPrePurchaseLoyaltyApplyStatus = Maestro.POS.Loyalty.Maestro.POS.Loyalty.setPrePurchaseLoyaltyApplyStatus;

// Maestro.POS.Loyalty.isThisLoyalty = Maestro.POS.Loyalty.isThisLoyalty;

// Maestro.POS.Loyalty.getExistingCustomerLoyaltyPrograms = Maestro.POS.Loyalty.Maestro.POS.Loyalty.getExistingCustomerLoyaltyPrograms;

// refreshAppliedPrograms = Maestro.POS.Loyalty.refreshAppliedPrograms;

// purgeExistingPrograms = Maestro.POS.Loyalty.purgeExistingPrograms;

// getLoyaltyPrograms = Maestro.POS.Loyalty.getLoyaltyPrograms;

// getTallyPrograms = Maestro.POS.Loyalty.getTallyPrograms;

// getOrderItemWithKeyBeginning = Maestro.POS.Loyalty.getOrderItemWithKeyBeginning;

// applyAnyLoyaltyCredits = Maestro.POS.Loyalty.applyAnyLoyaltyCredits;

// Maestro.POS.Loyalty.deleteIfAnyRedeemProduct = Maestro.POS.Loyalty.Maestro.POS.Loyalty.deleteIfAnyRedeemProduct;

// deleteAllExistingRedeemItems = Maestro.POS.Loyalty.deleteAllExistingRedeemItems;

// addRedeemProduct = Maestro.POS.Loyalty.addRedeemProduct;

// Maestro.POS.Loyalty.checkOrderForLoyaltyCreditItems = Maestro.POS.Loyalty.Maestro.POS.Loyalty.checkOrderForLoyaltyCreditItems;
    
// isThisLoyaltyRedeemItem = Maestro.POS.Loyalty.isThisLoyaltyRedeemItem;

// Maestro.POS.Loyalty.anyOrderGiftCards = Maestro.POS.Loyalty.anyOrderGiftCards;

// autoRedeemSingleItemProgram = Maestro.POS.Loyalty.autoRedeemSingleItemProgram;    

// checkAutoRedeemForCustomer = Maestro.POS.Loyalty.checkAutoRedeemForCustomer;
   
// incrementOrderLoyaltyBalance = Maestro.POS.Loyalty.incrementOrderLoyaltyBalance;

// restaurantOrderHelpers = {
//     getSortedFilteredProductsAndGroups: function (){
//         let generalFindCriteria = {};
//         let sortCriteria = 'categories';
        
//         generalFindCriteria.status = "Active";
        
//         let categoryFilter = Template.instance().ordersSelectedCategoryFilter.get();

//         // return Maestro.Client.getProductsAndGroups(generalFindCriteria, 'categories', categoryFilter);
//         return Maestro.Client.getProductsAndGroupsOptimize(generalFindCriteria, sortCriteria, categoryFilter);
//     },

//     getCustomers: function(){
//         return Maestro.Customers.SearchCustomerNames(Template.instance().customerSearchCriteria.get("NAME"), false, true);
//     },

//     productSearchEnabled: function(){
//         return Template.instance().enableProductSearch.get();
//     },

//     getCategoryColor: function(categoryName, colorCode){
//         let allowedColors = Maestro.Products.Categories.Colors;
//         let categoryFilter = Template.instance().ordersSelectedCategoryFilter.get();

//         if (_.find(allowedColors, function(color){return color.key == colorCode;})){
//             if (categoryName == categoryFilter.primary){
//                 return "background-color:#" + colorCode + ";" + ' min-height:60px;';
//             } else {
//                 return "background-color:#" + colorCode + ";" + ' min-height:30px;';
//             }
//         } else {
//             if (categoryName == categoryFilter.primary){
//                 return "background-color:#bdbdbd;" + ' min-height:60px;';
//             } else {
//                 return "background-color:#bdbdbd;" + ' min-height:30px;';
//             }
//         }
//     },

//     // getCategoryColor: function(categoryName, colorCode){
//     //     let allowedColors = Maestro.Products.Categories.Colors;
//     //     let categoryFilter = Template.instance().ordersSelectedCategoryFilter.get();

//     //     if (_.find(allowedColors, function(color){return color.key == colorCode;})){
//     //         if (categoryName == categoryFilter.primary){
//     //             return 'background-color:lightblue;';
//     //         } else {
//     //             return "background-color:#" + colorCode;
//     //         }
//     //     } else {
//     //         if (categoryName == categoryFilter.primary){
//     //             return 'background-color:lightblue;';
//     //         } else {
//     //             return "background-color:#bdbdbd";
//     //         }
//     //     }
//     // },

//     isCategorySelected: function(categoryName){
//         let categoryFilter = Template.instance().ordersSelectedCategoryFilter.get();

//         if (categoryName == categoryFilter.primary){
//             return true;
//         }
//         return false;
//     },

//     isSecondaryCategorySelected: function(categoryName){
//         let categoryFilter = Template.instance().ordersSelectedCategoryFilter.get();

//         if (categoryName == categoryFilter.secondary){
//             return true;
//         }
//         return false;
//     },

//     isThisSelectedGroup: function(name){
//         let chosenGroup = Template.instance().selectedCandidateGroup.get();
//         if (chosenGroup){
//             let chosenGroupName = chosenGroup.name;
//             if (name == chosenGroupName){
//                 return true;
//             } else {
//                 return false;
//             }
//         } else {return false;}
//     },

//     anyAddOns: function(addOns){
//         if(addOns){
//             if(addOns.length){
//                 return true;
//             } else {
//                 return false;
//             }
//         }
//     },

//     getAddOnInfo: function(addOnId){
//         return ProductAddons.findOne({_id: addOnId});
//     },

//     sizeNotSelected: function(){
//         let candidateOrderItem = Template.instance().candidateOrderItem.get();

//         if(candidateOrderItem.size) {
//             return false;
//         } else {
//             return true;
//         }
//     },

//     getSelectedAddOns: function(){
//         let candidateOrderItem = Template.instance().candidateOrderItem.get();

//         return candidateOrderItem.addOns;
//     },

//     selectedProduct: function() {
//         return Template.instance().selectedProduct.get();
//     },

//     isSelectedProduct: function(productId) {
//         currentSelectedProduct= Template.instance().selectedProduct.get();
//         if(currentSelectedProduct) {
//             return currentSelectedProduct._id === productId;
//         }
//         return false;
//     },

//     isThisProductExpanded: function(product){
//         let currentCandidate = Template.instance().expandedProduct.get();
//         if(currentCandidate){
//             return currentCandidate._id === product._id;
//         }
//         return false;
//     },

//     isSelectedCustomer: function(customerId){
//         let chosenCustomer = Template.instance().orderCustomer.get();
//         if (chosenCustomer){
//             let chosenCustomerId = chosenCustomer._id;

//             if (customerId == chosenCustomerId){
//                 return 'background-color:lightblue;'
//             } else {
//                 return;
//             }
//         } else {return;}
//     },

//     loyaltyProgram: function(){
//         let selectedProgramType = Template.instance().orderLoyaltyType.get();
//         if (selectedProgramType == 'All'){
//             return LoyaltyPrograms.find({status:'Active'}).fetch();
//         } else {
//             let filteredList = _.filter(LoyaltyPrograms.find({status:'Active'}).fetch(), function(program){
//                 return program.programType.type == selectedProgramType;
//             });
//             return filteredList;
//         }
//     },

//     getExpiryDays: function(expiry){
//         if (expiry){
//             return "Expires " + expiry + " days after purchase";
//         } 
//     },

//     getExpiryDate: function(expiry){
//         if (expiry > new Date(1969, 12, 31)){
//             return "Expires on "+expiry.toDateString()+".";
//         }
//     },

//     getLoyaltyName: function(programId){
//         let loyaltyProgram = LoyaltyPrograms.findOne({_id: programId});
//         // console.log(LoyaltyPrograms.findOne({_id: programId}));
//         return loyaltyProgram.name;
//     },

//     getLoyaltyBalance: function(remainingQuantity, remainingAmount){
//         if(remainingAmount){
//             return "Balance $"+ remainingAmount.toFixed(2);
//         } else if (remainingQuantity){
//             return "Balance of "+remainingQuantity+" items";
//         }
//     },

//     getLoyaltyExpiration: function(programId, boughtOn){
//         let purchasedOn= new Date(boughtOn);
//         purchasedOn.setHours(0);
//         purchasedOn.setMinutes(0);
//         purchasedOn.setSeconds(0);
//         purchasedOn.setMilliseconds(1);

//         let todayDate = new Date();
//         todayDate.setHours(23);
//         todayDate.setMinutes(59);
//         todayDate.setSeconds(59);
//         todayDate.setMilliseconds(999);

//         let loyaltyProgram = LoyaltyPrograms.findOne({_id: programId});

//         if(loyaltyProgram.expiryDays){
//             let remainingDays = loyaltyProgram.expiryDays - ((todayDate.valueOf() - purchasedOn.valueOf())/(1000*60*60*24)).toFixed(0);
//             if (remainingDays < 0 ){
//                 return "Program Expired";
//             } else {
//                 return remainingDays + " days left till expiry";
//             }
//         } else if (loyaltyProgram.expiryDate){
//             if (todayDate>loyaltyProgram.expiryDate){
//                 return "Program Expired";
//             } else {
//                 return "Expires on " + loyaltyProgram.expiryDate.toDateString();
//             }
//         }
//     },
//     itemNotLoyalty: function(itemId){
//         return !Maestro.POS.Loyalty.isThisLoyalty(itemId);
//     },

//     itemNotLoyaltyRedeem: function(productId){
//         return !Maestro.POS.Loyalty.isThisLoyaltyRedeemItem(productId);
//     },

//     primaryCategories: function(){
//         return Maestro.Client.getPrimaryCategories();
//     },

//     secondaryCategories: function(primaryCategory){
//         return Maestro.Client.getSecondaryCategories(primaryCategory);
//     },

//     categories: function(){
//         return ProductCategories.find({});
//     },
//     categoryColor: function () {
//         var product = this;
//         if(!_.isEmpty(product.categories)) {
//             return Maestro.Client.getCategoryColor(product.categories[0]);
//         }
//         return "amethyst";
//     },
//     customers: function () {
//         return Template.instance().lists.get(CUSTOMERS);
//     },
//     noItems: function () {
//         // return _.isEmpty(Template.instance().orderItems.all());
//         return _.isEmpty(Maestro.POS.OrderItems.getAllItems(Template.instance()));
//     },
//     defaultSize: function () {
//         return this.price > 0 && Maestro.Client.isProductSizePreferred(this.code);
//     },
//     itemsList: function () {
//         // return _.sortBy(_.values(Template.instance().orderItems.all()),'itemNumber');
//         return _.sortBy(Maestro.POS.OrderItems.getAllItems(Template.instance()),'itemNumber');
//     },
//     itemsListBySeat: function () {
//         // let itemsList = _.sortBy(_.values(Template.instance().orderItems.all()),'itemNumber');
//         let itemsList = _.sortBy(Maestro.POS.OrderItems.getAllItems(Template.instance()),'itemNumber');
//         let seatNumber = Template.instance().selectedSeat.get() ? Template.instance().selectedSeat.get().seatNumber : null;
//         return _.where(itemsList, {seatNumber: seatNumber});
//     },
//     itemTotal: function () {
//         return Maestro.POS.Tools.getItemTotal(this);
//     },
//     orderSubtotal: function () {
//         return Template.instance().orderTotals.get("subtotal");
//     },
//     orderDiscount: function () {
//         return Template.instance().orderTotals.get("discount");
//     },
//     anyDiscounts: function(){
//         let discount = Template.instance().orderTotals.get("discount");
//         if (discount) {
//             return true;
//         } else {
//             return false;
//         }
//     },
//     anyGiftCards: function(){
//         return Maestro.POS.Loyalty.anyOrderGiftCards(Template.instance().existingAmountLoyalty.get());
//     },
//     orderAdjustments: function () {
//         return Template.instance().orderTotals.get("adjustments");
//     },
//     orderTax: function () {
//         return Template.instance().orderTotals.get("tax");
//     },
//     orderTotal: function () {
//         return Template.instance().orderTotals.get("total");
//     },
//     orderCashTotal: function () {
//         return Template.instance().orderTotals.get("cash-total");
//     },
//     orderPaymentDue: function(){
//         return Template.instance().paymentDueAmount.get();
//     },
//     orderCashPaymentDue: function(){
//         return Maestro.Payment.CashRounding(Template.instance().paymentDueAmount.get());
//     },
//     cashAmountGiven: function(){
//         return Template.instance().cashAmountGiven.get();
//     },
//     giftCardUsed: function(){
//         return Template.instance().orderTotals.get("total") - Template.instance().paymentDueAmount.get();
//     },
//     cashChangeDue: function(){
//         if(Template.instance().cashAmountGiven.get()){
//             if (Maestro.POS.Loyalty.anyOrderGiftCards(Template.instance().existingAmountLoyalty.get())){
//                 return Template.instance().cashAmountGiven.get() - Maestro.Payment.CashRounding(Template.instance().paymentDueAmount.get());
//             } else {
//                 return Template.instance().cashAmountGiven.get() - Template.instance().orderTotals.get("cash-total");
//             }
//         } else {
//             return 0.00;
//         }
//     },
//     orderCashRounding: function () {
//         return Template.instance().orderTotals.get("cash-rounding");
//     },
//     paymentMethods: function () {
//         // return [Maestro.Payment.Methods[0],Maestro.Payment.Methods[1]];
//         return Maestro.Payment.Methods;
//     },
//     isSelectedPaymentMethod: function (currentMethod) {
//         return currentMethod === Template.instance().paymentMethod.get();
//     },
//     selectedPaymentMethod: function () {
//         return Template.instance().paymentMethod.get();
//     },
//     paymentConfirmed: function () {
//         return !!Template.instance().paymentMethod.get();
//     },
//     isPaymentDisabled: function () {
//         return !Template.instance().paymentMethod.get() ? "disabled" : "";
//     },

//     getPaymentMethodIcon: function(){
//         if(Template.instance().paymentMethod.get() == "card"){
//             return 'credit_card';
//         } else if (Template.instance().paymentMethod.get() == "cash"){
//             return 'local_atm';
//         }
//     },
//     orderCustomer: function () {
//         let orderCustomer = Template.instance().orderCustomer.get();
//         if(orderCustomer){
//             return Customers.findOne({_id: orderCustomer._id});
//         }
//     },
//     processedOrderCustomer: function() {
//         return Template.instance().previousOrderCustomer.get();
//     },
//     getActivePrograms: function(){
//         return Template.instance().existingCustomerLoyaltyPrograms.get();
//     },

//     getCustomerActivePrograms: function(customerId){
//         return _.reject(Customers.findOne({_id: customerId}).loyaltyPrograms, function(program){return program.expired;});
//     },

//     thisProgramIsApplied: function(applyFlag){
//         return applyFlag;
//     },

//     loyaltyPrograms: function () {
//         return LoyaltyPrograms.find({});
//     },
//     applicableLoyaltyPrograms: function () {
//         var customer = this;
//         // console.log("customer for loyalty!! ", customer);
//     },

//     getLoyaltyOrderItemProgram: function(programId){
//         let allOrderLoyaltyItems = Template.instance().orderLoyaltyItems.get();
//         return _.findWhere(allOrderLoyaltyItems, {_id: programId});
//     },

//     emailReceiptSelected: function(){
//         return Template.instance().emailReceiptFlag.get();
//     },

//     printReceiptSelected: function(){
//         // console.log(Template.instance().printReceiptFlag.get());
//         return Template.instance().printReceiptFlag.get();
//     },

//     showCashPaymentInfo: function(){
//         if(Template.instance().showPaymentInfoFor.get() == "cash"){
//             return true;
//         }
//         return false;
//     },

//     showCardPaymentInfo: function(){
//         if(Template.instance().showPaymentInfoFor.get() == "card"){
//             return true;
//         }
//         return false;
//     },

//     showLoyaltyInfo: function(){
//         if(Template.instance().showPaymentInfoFor.get() == "loyalty"){
//             return true;
//         }
//         return false;
//     },

//     showAdjustmentAmountInfo: function(){
//         if(Template.instance().showPaymentInfoFor.get() == "adjustment"){
//             return true;
//         }
//         return false;
//     },

//     isAdjustmentSelected: function(percent){
//         if(Template.instance().adjustmentAmount.get() == percent){
//             return true;
//         }
//         return false;
//     },

//     getAdjustmentValue: function(){
//         return Template.instance().adjustmentAmount.get();
//     },

//     showAdjustmentAmount: function(){
//         let subtotal = Template.instance().orderTotals.get("subtotal");
//         return Template.instance().adjustmentAmount.get()/100 * subtotal;
//     },

//     getOrderNumber: function(){
//         let locationId = Maestro.Client.locationId();
//         let dailyOrderNumber = Maestro.Order.GetNextOrderNumber(locationId);
//         if (dailyOrderNumber < 10){
//             return "#00"+String(dailyOrderNumber);
//         } else if (dailyOrderNumber <100){
//             return "#0"+String(dailyOrderNumber);
//         } else {
//             return "#"+String(dailyOrderNumber);
//         }
//     },

//     getThisOrderItem: function(){
//         return Template.instance().thisOrderItem.get();
//     },

//     isCustomerSearchTabMode: function(){
//         if(Template.instance().customerTabMode.get() == "search"){
//             return true;
//         }
//         return false;
//     },

//     isCustomerCreateTabMode: function(){
//         if(Template.instance().customerTabMode.get() == "create"){
//             return true;
//         }
//         return false;
//     }
// };

// restaurantOrderEvents = {
//     'click .goToProgramsTab': function(event, template){
//         $('ul.tabs').tabs('select_tab', 'order-loyalty');
//     },

//     'click .goToCustomersTab': function(event, template){
//         $('ul.tabs').tabs('select_tab', 'order-customers');  
//     },

//     'click .goToCustomerSearchTab': function(event, template){
//         $('ul.tabs').tabs('select_tab', 'searchCustomer');
        
//         if(!template.orderCustomer.get()){
//             document.getElementById('customer-search').focus();
//             document.getElementById('customer-search').select();
//         }

//         template.customerTabMode.set('search');    
//     },

//     'click .goToCustomerCreateTab': function(event, template){
//         $('ul.tabs').tabs('select_tab', 'newCustomerAdd');

//         template.customerTabMode.set('create');
//     },

//     'click .goToCustomerEditTab': function(event, template){
//         $('ul.tabs').tabs('select_tab', 'order-customers');  
//         $('ul.tabs').tabs('select_tab', 'editCustomerDetails');

//         template.customerTabMode.set('edit');
//     },

//     'click .selectLoyaltyType': function(event, template){
//         let programType = $(event.target).data("programtype");
//         Template.instance().orderLoyaltyType.set(programType);
//     },

//     'click .selectCategory': function(event, template){
//         let categoryName = $(event.target).data('category');
//         template.ordersSelectedCategoryFilter.set({primary: categoryName});
//     },

//     'click .selectSecondaryCategory': function(event, template){
//         let secondaryCategoryName = $(event.target).data('secondcategory');
//         var categoryFilter = template.ordersSelectedCategoryFilter.get();

//         if(categoryFilter.secondary == secondaryCategoryName){
//             delete categoryFilter.secondary;
//         } else {
//             categoryFilter.secondary = secondaryCategoryName;
//         }

//         template.ordersSelectedCategoryFilter.set(categoryFilter);

//     },

//     'click .selectLoyaltyProgram': function(event, template){
//         event.preventDefault();
//         let programId = $(event.target).data("programid");
//         let loyaltyProgram = LoyaltyPrograms.findOne({_id:programId});
//         let loyaltyProduct = loyaltyProgram.purchaseLoyalty;
//         loyaltyProduct._id = programId;

//         let candidateProduct = loyaltyProduct;
//         let candidateSize = null;
//         let candidateKey = null;
//         let existingOrderItem = null;

//         if(candidateProduct.sizes.length === 1) {
//             candidateSize = candidateProduct.sizes[0];
//         }

//         let candidateOrderItem = Maestro.POS.Tools.createOrderItem(candidateProduct, candidateSize, null, [], template);

//         if(candidateSize) {
//             candidateKey = candidateSize.code + "-" + candidateProduct._id;
//         }

//         if(candidateKey) {
//             // existingOrderItem = template.orderItems.get(candidateKey);
//             existingOrderItem = Maestro.POS.OrderItems.getItem(template, candidateKey);
//         }

//         if(existingOrderItem) {
//             candidateOrderItem = existingOrderItem;
//             candidateOrderItem.quantity = 1;
//             // incrementOrderLoyaltyBalance(candidateOrderItem, template);
//             Materialize.toast('Multiples of Loyalty Programs Currently Not Available', 3000);
//             return;
//         } else {
//             let existingItems = [];

//             // _.each(template.orderItems.all(), function (orderItem, key) {
//             _.each(Maestro.POS.OrderItems.getAllItems(template), function (orderItem, key) {
//                 if(key.endsWith("-" + candidateProduct._id)) {
//                     existingItems.push(orderItem);
//                 }
//             });

//             if(existingItems.length === 1) {
//                 candidateOrderItem = existingItems[0];
//             }
//         }

//         //add order item
//         template.candidateOrderItem.set(candidateOrderItem);

//         //add entire program to loyatly item
//         var selectedLoyalty = template.orderLoyaltyItems.get();
//         loyaltyProgram.apply = false;
//         selectedLoyalty.push(loyaltyProgram);
//         template.orderLoyaltyItems.set(selectedLoyalty);

//         //open modal if more than one size
//         if (candidateProduct.sizes.length === 1) {
//             let candidateOrderItem = template.candidateOrderItem.get();
//             if(candidateOrderItem && candidateOrderItem.size) {
//                 Maestro.POS.Tools.selectProduct(candidateOrderItem.product, candidateOrderItem.size.code, candidateOrderItem.quantity, null, template);
//             }
//         } 
//         // else {
//         //     $('#select-product-options').openModal();
//         // }
//     },

//     'click i.delete-item': function (event, template) {
//         event.preventDefault();
//         let orderItem = this;

//         let seat = template.selectedSeat.get();
//         let seatNumber = seat ? seat.seatNumber : null;

//         // let key = getSeatKey(seatNumber) + this.size.code + "-" + this.product._id + getAddOnKey(orderItem.addOns);
//         let key = Maestro.POS.Tools.generateKey(this.size.code, this.product._id, orderItem.addOns, seatNumber);

//         Maestro.POS.OrderItems.removeItem(template, key)
//         Maestro.POS.Loyalty.deleteIfAnyRedeemProduct(key, template);

//         if(LoyaltyPrograms.findOne({_id: this.product._id})){
//             let allOrderLoyaltyItems = Template.instance().orderLoyaltyItems.get();
//             Maestro.POS.Loyalty.setPrePurchaseLoyaltyApplyStatus(_.findWhere(allOrderLoyaltyItems, {_id: this.product._id}), false, template);
//             Maestro.POS.Loyalty.removeLoyaltyItem(this.product._id, template);
//             Maestro.POS.Loyalty.checkOrderForLoyaltyCreditItems(template);
//         }
//     },

//     'click .enableProductSearch': function(event, template){
//         if (template.enableProductSearch.get()){
//             template.enableProductSearch.set(false);

//         } else {
//             template.enableProductSearch.set(true);
//         }
//     },

//     'keyup #product-search': function (event, template) {
//         let searchTerm = $(event.currentTarget).val();
//         setProductSearchCriteria(searchTerm, template);
//     },

//     'keyup #customer-search': function (event, template) {
//         let searchTerm = $(event.currentTarget).val();
//         if(searchTerm.length>1){
//             template.customerSearchCriteria.set("NAME", searchTerm);
//             Maestro.POS.Loyalty.setCustomerSearchCriteria(searchTerm, template);
//         }
//     },



//     // 'click .categoryFilter': function(event, template) {
//     //     let searchTerm = $(event.target).data("category");
//     //     setProductCategorySearchCriteria(searchTerm, template);
//     // },

//     'click .alphabetFilter': function(event, template){
//         let searchTerm = $(event.target).data("alphabet");
//         template.customerSearchCriteria.set("NAME", "Alphabet:"+searchTerm);
//         Maestro.POS.Loyalty.setCustomerAlphabetSearchCriteria(searchTerm, template);
//     },

//     // 'click .clear-product-search': function (event, template) {
//     //     clearProductSearchCriteria(template);
//     // },

//     'click .clear-customer-search': function (event, template) {
//         Maestro.POS.Loyalty.clearCustomerSearchCriteria(template);

//     },
//     'click .select-customer': function (event, template) {
//         Maestro.POS.Loyalty.clearCustomerInfo(template);
//         let customer = Customers.findOne({_id: this._id})
//         template.orderCustomer.set(customer);
//         Maestro.POS.Loyalty.getExistingCustomerLoyaltyPrograms(customer, template);
//         // checkAutoRedeemForCustomer(this, template);
//         // console.log(customer);
//     },

//     'click .doNotApplyThisProgram': function(event, template){
//         Maestro.POS.Loyalty.setLoyaltyProgramApplyStatus(this, false, template);
//     },

//     'click .applyThisProgram': function(event, template){
//         Maestro.POS.Loyalty.setLoyaltyProgramApplyStatus(this, true, template);
//     },

//     'click .applyThisProgramPrePurchase': function(event, template){
//         Maestro.POS.Loyalty.setPrePurchaseLoyaltyApplyStatus(this, true, template);
//     },

//     'click .doNotApplyThisProgramPrePurchase': function(event, template){
//         Maestro.POS.Loyalty.setPrePurchaseLoyaltyApplyStatus(this, false, template);
//     },

//     // 'click #add-Customer':function(event, target){
//     //     $('#addNewCustomerModal').openModal();
//     // },

//     // 'click #cancel-create-customer':function(event, target){
//     //     $('#addNewCustomerModal').closeModal();
//     // },

//     'click .select-payment-method': function (event, template) {
//         template.paymentMethod.set($(event.target).data('paymentkey'));
//     },

//     'click .showCashPaymentInfo': function(event, template){
//         template.showPaymentInfoFor.set('cash');
//     },

//     'click .showCardPaymentInfo': function(event, template){
//         template.showPaymentInfoFor.set('card');
//     },

//     'click .showLoyaltyPaymentInfo': function(event, template){
//         template.showPaymentInfoFor.set('loyalty');
//     },

//     'click .showAdjustmentInfo': function(event, template){
//         template.showPaymentInfoFor.set('adjustment');
//     },
    
//     'click .open-addon-select': function(event, template){
//         template.thisOrderItem.set(this);
//         $('#select-addon-options').openModal();
//     },

//     'click #delete-order': function(event, template){
//         event.preventDefault();

//         console.log('deleting order');
//         //reset / re-initialize order screen
//         Maestro.POS.clearOrder(template);
//         Maestro.POS.Tools.checkForEditCheckoutMode(template);
//         // if(template.inOrderEditMode.get()){
//         //     let editOrderId = FlowRouter.getParam("orderId");
//         //     let editOrder = Orders.findOne({_id: editOrderId});            
//         //     Maestro.POS.Tools.initEditOrder(editOrder, template);
//         // }
//     },

//     'click .addToCashAmountGiven': function(event,template){
//         let amount = Number($(event.target).data('cashamount'));
//         let currentAmount = template.cashAmountGiven.get();
//         template.cashAmountGiven.set(currentAmount + amount);
//     },

//     'click .addToCashDigitGiven': function(event, template){
//         let digit = $(event.target).data('cashdigit');
//         let currentAmount = template.cashAmountGiven.get();
//         let newAmount = Number(String((currentAmount*100).toFixed(0)) + digit)/100;
//         template.cashAmountGiven.set(newAmount);
//     },

//     'click .clearCashAmountGiven': function(event, template){
//         template.cashAmountGiven.set(0);
//     },

//     'click .manualAdjustment': function(event, template){
//         let adjustment = Number($(event.target).data('percent'));
//         template.adjustmentAmount.set(adjustment);
//         Maestro.POS.Loyalty.checkOrderForLoyaltyCreditItems(template);
//     },

//     'click .decreaseAdjustment': function(event, template){
//         let currentValue = template.adjustmentAmount.get();
//         currentValue = currentValue - 5;
//         if (currentValue >= 0) {
//             template.adjustmentAmount.set(currentValue);
//         } else {
//             template.adjustmentAmount.set(0);
//         }
//     },

//     'click .increaseAdjustment': function(event, template){
//         let currentValue = template.adjustmentAmount.get();
//         currentValue = currentValue + 5;
//         if (currentValue <= 100) {
//             template.adjustmentAmount.set(currentValue);
//         } else {
//             template.adjustmentAmount.set(100);
//         }
//     },

//     'mouseup .sliderManualAdjustment': function(event, template){
//         let adjustment = Number(document.getElementById('setAdjustmentValue').value);
//         template.adjustmentAmount.set(adjustment);
//         Maestro.POS.Loyalty.checkOrderForLoyaltyCreditItems(template);
//     },

//     'click .create-order': function(event, template){
//         event.preventDefault();

//         if(!Maestro.Client.locationId()){
//             Materialize.toast('Select a location first', 2000);
//             return ;
//         }

//         Maestro.Order.CreateOrder(template);

//         $('ul.tabs').tabs('select_tab', 'restaurantOrderCreateTab');
//         $('ul.tabs').tabs('select_tab', 'order-products');
//         $('ul.tabs').tabs('select_tab', 'searchCustomer');
//     },

//     'click .update-order': function(event, template){
//         event.preventDefault();

//         if(!Maestro.Client.locationId()){
//             Materialize.toast('Select a location first', 2000);
//             return ;
//         }

//         Maestro.Order.UpdateOrder(template);

//         // $('ul.tabs').tabs('select_tab', 'restaurantOrderCreateTab');
//         // $('ul.tabs').tabs('select_tab', 'order-products');
//         // $('ul.tabs').tabs('select_tab', 'searchCustomer');
//     },

//     'click #checkout-order': function(event, template){
//         event.preventDefault();

//         if(!Maestro.Client.locationId()){
//             Materialize.toast('Select a location first', 2000);
//             return ;
//         }

//         Maestro.Order.CheckoutOrder(template);

//         $('ul.tabs').tabs('select_tab', 'restaurantOrderCreateTab');
//         $('ul.tabs').tabs('select_tab', 'order-products');
//         $('ul.tabs').tabs('select_tab', 'searchCustomer');
//     },

//     'click #complete-checkout': function (event, template) {
//         event.preventDefault();

//         if(!Maestro.Client.locationId()){
//             Materialize.toast('Select a location first', 2000);
//             return ;
//         }

//         //check location and business

//         //TODO check device permissions

//         //check if order items exist
//         // var orderItems = _.map(_.values(template.orderItems.all()), function (item, index) {
//         var orderItems = _.map(Maestro.POS.OrderItems.getAllItems(template), function (item, index) {
//             return {
//                 product: _.pick(item.product, '_id', 'name', 'sizes'),
//                 size: item.size,
//                 seatNumber: item.seatNumber,
//                 addOns: _.map(item.addOns, function(addon, index){
//                     return {
//                         _id: addon._id,
//                         name: addon.name,
//                         price: addon.price
//                     };
//                 }), 
//                 quantity: item.quantity,
//                 total: Maestro.POS.Tools.getItemTotal(item)
//             };
//         });
        
//         //// customer
//         var customerId = template.orderCustomer.get() && template.orderCustomer.get()["_id"] || null;

//         ////totals
//         var orderSubtotals = template.orderTotals.all();
//         var subtotals = {
//             subtotal: orderSubtotals["subtotal"],
//             discount: orderSubtotals["discount"],
//             adjustments: orderSubtotals["adjustments"],
//             tax: orderSubtotals["tax"],
//             taxComponents: orderSubtotals["taxBreakdown"], 
//             total: orderSubtotals["total"]
//         };

//         ////payment details
//         var paymentMethod = template.paymentMethod.get();
//         var paymentDetails = {
//             method: paymentMethod,
//             amount: orderSubtotals.total
//         };

//         if(paymentMethod === Maestro.Payment.MethodsEnum.cash.key) { //is this cash method of payment
//             // paymentDetails.amount = orderSubtotals["cash-total"];
//             paymentDetails.rounding = orderSubtotals["cash-rounding"];
//         }

//         if (template.paymentDueAmount.get() === null){
//             if(paymentMethod === Maestro.Payment.MethodsEnum.cash.key){
//                 paymentDetails.received = orderSubtotals["cash-total"];
//             } else {
//                 paymentDetails.received = paymentDetails.amount;
//             }
//         } else {
//             paymentDetails.received = template.paymentDueAmount.get(); 
//         }

//         let refDate = new Date();

//         let timeBucket = {
//             year: refDate.getFullYear(),
//             month: refDate.getMonth(),
//             day: refDate.getDate(),
//             hour: refDate.getHours(),
//         };

//         let table = template.selectedTable.get();

//         var order = {
//             businessId: Maestro.Client.businessId(),
//             locationId: Maestro.Client.locationId(),
//             tableId: table ? table._id : null,
//             createdAt: new Date(),
//             timeBucket: timeBucket,
//             status:'Completed',
//             customerId: customerId,
//             items: orderItems,
//             subtotals: subtotals,
//             payment: paymentDetails,
//             dailyOrderNumber: Maestro.Order.GetNextOrderNumber(Maestro.Client.locationId()),
//             uniqueOrderNumber: Maestro.Order.GetNextUniqueOrderNumber()
//         };

//         // console.log('daily #: ',  Maestro.Order.GetNextOrderNumber(Maestro.Client.locationId()));
//         // console.log('unique #: ', Maestro.Order.GetNextUniqueOrderNumber());

//         ///Loyalty programs
//         var buyLoyaltyItems = template.orderLoyaltyItems.get();
//         var buyLoyaltyDetails = [];

//         for (i = 0; i < buyLoyaltyItems.length; i++){
//             buyLoyaltyDetails.push({
//                 programId: buyLoyaltyItems[i]._id,
//                 remainingQuantity: buyLoyaltyItems[i].programType.quantity,
//                 remainingAmount: buyLoyaltyItems[i].programType.creditAmount,
//                 creditPercent: buyLoyaltyItems[i].programType.creditPercentage,
//                 expired: false,
//                 boughtOn: new Date(),
//                 prePurchase: buyLoyaltyItems[i].prePurchase || false 
//             });
//         }

//         var updateExistingPrograms = {
//             quantityBased: null,
//             amountBased: null
//         };

//         updateExistingPrograms.quantityBased = template.existingQuantityLoyalty.get() || null;

//         var giftCards = template.existingAmountLoyalty.get();
//         var giftCardRedeemInfo = [];

//         if(giftCards){
//             for (i=0; i<giftCards.length; i++){
//                 giftCardRedeemInfo.push({
//                     programId: giftCards[i].programId,
//                     redeemedAmount: giftCards[i].remainingAmount - template.giftCardsBalances[i]
//                 });

//                 giftCards[i].remainingAmount = template.giftCardsBalances[i];
//             }
//             updateExistingPrograms.amountBased = giftCards;

//             order.payment.giftCards = giftCardRedeemInfo;
//             order.payment.giftCardTotal = _.reduce(giftCardRedeemInfo, function(memo, card){
//                 return memo + card.redeemedAmount;
//             }, 0.00);
//         }

//         //Need to reconcile balances of prepurchase applied credits
//         var duplicatePrograms = [];

//         // console.log('pre duplicate qty filter: ', updateExistingPrograms.quantityBased);

//         if(updateExistingPrograms.quantityBased){
//             for (k = 0; k < updateExistingPrograms.quantityBased.length; k++){
//                 if(updateExistingPrograms.quantityBased[k].prePurchase == true){
//                     let buyLoyaltyIndex = _.indexOf(buyLoyaltyDetails, _.find(buyLoyaltyDetails, function(program){return program.programId == updateExistingPrograms.quantityBased[k].programId; }));
//                     buyLoyaltyDetails[buyLoyaltyIndex].remainingQuantity = updateExistingPrograms.quantityBased[k].remainingQuantity;
//                     duplicatePrograms.push(updateExistingPrograms.quantityBased[k]);
//                     updateExistingPrograms.quantityBased.splice(k,1);
//                 }
//             }
//             // console.log("qty: ", duplicatePrograms);
//         }

        
//         // updateExistingPrograms.quantityBased = _.without(updateExistingPrograms.quantityBased, duplicatePrograms);
//         // console.log('post duplicate qty filter: ', updateExistingPrograms.quantityBased);

//         duplicatePrograms = [];

//         // console.log('pre duplicate amount filter: ', updateExistingPrograms.amountBased);

//         if(updateExistingPrograms.amountBased){
//             for (k = 0; k < updateExistingPrograms.amountBased.length; k++){
//                 if(updateExistingPrograms.amountBased[k].prePurchase == true){
//                     let buyLoyaltyIndex = _.indexOf(buyLoyaltyDetails, _.find(buyLoyaltyDetails, function(program){return program.programId == updateExistingPrograms.amountBased[k].programId; }));
//                     buyLoyaltyDetails[buyLoyaltyIndex].remainingAmount = updateExistingPrograms.amountBased[k].remainingAmount;
//                     duplicatePrograms.push(updateExistingPrograms.amountBased[k]);
//                     updateExistingPrograms.amountBased.splice(k,1);
//                 }
//             }
//             // console.log("amount: ", duplicatePrograms);
//         }

//         // updateExistingPrograms.amountBased = _.without(updateExistingPrograms.amountBased, duplicatePrograms);
//         // console.log('post duplicate amount filter: ', updateExistingPrograms.amountBased);
        
//         duplicatePrograms = [];

//         if(customerId){
//             let allCustomerProgramsPreOrder = Customers.findOne({_id: customerId}).loyaltyPrograms;
//             let allQuantityPrograms = _.filter(allCustomerProgramsPreOrder, function(program){ return (program.remainingQuantity > 0) && (program.expired == false); }) 
//             var quantityCardRedeemInfo = [];
        

//             if(updateExistingPrograms.quantityBased){
//                 for (k = 0; k < updateExistingPrograms.quantityBased.length; k++){
//                     var afterOrderProgram = updateExistingPrograms.quantityBased[k];
//                     var originalProgram = _.find(allQuantityPrograms, function(program){return program.programId == afterOrderProgram.programId;});
//                     if(!originalProgram){
//                         originalProgram = {
//                             programId: afterOrderProgram.programId,
//                             remainingQuantity: LoyaltyPrograms.findOne({_id: afterOrderProgram.programId}).programType.quantity
//                         };
//                     }
                    
//                     // console.log(afterOrderProgram);

//                     quantityCardRedeemInfo.push({
//                         programId: afterOrderProgram.programId,
//                         redeemedQuantity: originalProgram.remainingQuantity - afterOrderProgram.remainingQuantity
//                     });
//                 }
//                 order.payment.quantityCards = quantityCardRedeemInfo;
//             }
//         }

//         if(customerId){
//             let customerTally = template.existingTallyPrograms.get();

//             let updateCustomerTally = _.map(customerTally, function(tallyObj){
//                 return {
//                     programId: tallyObj.programId,
//                     tally: tallyObj.customerTally
//                 };
//             });

//             updateExistingPrograms.updateTallyPrograms = updateCustomerTally;
//         }

//         // console.log(updateExistingPrograms.updateTallyPrograms);

//         // console.log('quantity card redeem info: ', order.payment.quantityCards);

//         // console.log("buyLoyaltyDetails: ", buyLoyaltyDetails);
//         // console.log("updateExistingPrograms: ", updateExistingPrograms);

//         let receiptOptions = {
//             print: template.printReceiptFlag.get(),
//             email: template.emailReceiptFlag.get()
//         };

//         // console.log("order: ", order);

//         // Meteor.call("submitOrder", order, customerId, buyLoyaltyDetails, updateExistingPrograms, receiptOptions, function (error, result) {
//         //     if(error) {
//         //         Materialize.toast("Error submitting order!", 4000);
//         //     } else {
//         //         Materialize.toast("Order successfully submitted", 4000);
//         //         template.newOrderId.set(result);
//         //         Maestro.Order.PrintNewOrderReceipt(template);
//         //     }
//         // });

//         console.log('order object: ', order);

//         let orderId = Maestro.Order.SubmitOrder(order, customerId, buyLoyaltyDetails, updateExistingPrograms, receiptOptions);
        
//         if(!!orderId){
//             Materialize.toast("Processed", 1000, 'rounded green');
//             template.newOrderId.set(orderId);
//             Maestro.Order.PrintNewOrderReceipt(template);
//         } else {
//             Materialize.toast("Error submitting order!", 4000, 'rounded red');
//         }

//         // if(customerId){
//         //     template.previousOrderCustomer.set(template.orderCustomer.get());
//         //     $('#checkout-order').closeModal();
//         //     $('#processed-order-customer-info').openModal();
//         // } else {
//         //     $('#checkout-order').closeModal();
//         // }

//         // if(customerId){
//         //     template.previousOrderCustomer.set(template.orderCustomer.get());
//         //     $('ul.tabs').tabs('select_tab', 'balanceTab');
//         //     window.setTimeout(function() {
//         //         $('ul.tabs').tabs('select_tab', 'restaurantOrderCreateTab');
//         //         $('ul.tabs').tabs('select_tab', 'order-products');
//         //         $('ul.tabs').tabs('select_tab', 'searchCustomer');
//         //     }, 3000);
//         // } else {
//             // $('ul.tabs').tabs('select_tab', 'restaurantOrderCreateTab');
//             // $('ul.tabs').tabs('select_tab', 'order-products');
//             // $('ul.tabs').tabs('select_tab', 'searchCustomer');
//         // }

//         Maestro.POS.clearOrder(template);

//         $('ul.tabs').tabs('select_tab', 'restaurantOrderCreateTab');
//         $('ul.tabs').tabs('select_tab', 'order-products');
//         $('ul.tabs').tabs('select_tab', 'searchCustomer');

//     },

//     // 'click #begin-checkout': function (event, template) {
//     //     if (template.orderLoyaltyItems.get().length && !template.orderCustomer.get()){
//     //         Materialize.toast('Select a Customer to Add Loyalty Program', 4000);
//     //     } else {
//     //         //$('#checkout-order').openModal();
//     //         $('#checkout-tabs').tabs('select_tab', 'cash-tab');
//     //         $('#checkout-tabs-bottom').tabs('select_tab', 'cash-tab-bottom');
//     //     }
//     // },

//     'click .emailReceipt': function(event, template){
//         Meteor.call('emailReceipt');
//     },

//     'click .deselectEmailReceipt': function(event, template){
//         template.emailReceiptFlag.set(false);
//     },

//     'click .selectEmailReceipt': function(event, template){
//         template.emailReceiptFlag.set(true);
//     },

//     'click .deselectPrintReceipt': function(event, template){
//         template.printReceiptFlag.set(false);
//     },

//     'click .selectPrintReceipt': function(event, template){
//         template.printReceiptFlag.set(true);
//     },

//     // 'click #printReceipt':function(event, template){
//     //     printOrderReceipt(template);
//     // }
// };

// ///
// Template.CreateOrderTable.onCreated(function () {

// });

// Template.CreateOrderTable.onRendered(function () {

// });

// Template.CreateOrderTable.helpers({

// });

// Template.CreateOrderTable.events({

// });