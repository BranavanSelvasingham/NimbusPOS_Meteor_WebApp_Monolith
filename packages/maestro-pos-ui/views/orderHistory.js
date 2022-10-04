Maestro.Templates.OrderHistory = "OrderHistory";

Template.OrderHistory.onCreated(function(){
    let template = this;

    template.searchType = new ReactiveVar();
    template.orderSearchFilter = new ReactiveVar();
    template.customerNameSearch = new ReactiveVar();

    template.selectedOrder = new ReactiveVar();
    template.selectedDirectOrder = new ReactiveVar();
    template.selectedTableOrder = new ReactiveVar();
    template.giftCardRedeemInfo = new ReactiveVar();
    template.percentageCardRedeemInfo = new ReactiveVar();
    template.quantityCardRedeemInfo = new ReactiveVar();
    template.payBackMoney = new ReactiveVar();
    template.displayLimit = new ReactiveVar();
    template.setLimit = 10;

    template.displayLimit.set(template.setLimit);

    template.initOrderHistory = function(){
        template.selectedOrder.set();
        template.selectedDirectOrder.set();
        template.selectedTableOrder.set();
        template.giftCardRedeemInfo.set();
        template.percentageCardRedeemInfo.set();
        template.quantityCardRedeemInfo.set();
        template.payBackMoney.set();
    };

    template.focusOnCustomerSearchField = function(){
        Tracker.flush();
        let orderNumField = document.getElementById('order-number-search');
        let dailyNumField = document.getElementById('daily-number-search');
        let customerNameField = document.getElementById('customer-name-search');

        if(!!orderNumField){
            orderNumField.click();
            orderNumField.focus();
            orderNumField.select();
        } else if(!!dailyNumField){
            dailyNumField.click();
            dailyNumField.focus();
            dailyNumField.select();
        } else if(!!customerNameField){
            customerNameField.click();
            customerNameField.focus();
            customerNameField.select();
        }
    };

    template.calculateAmounts = function(){
        let orderId = template.selectedOrder.get()._id;

        let orderObj = Orders.findOne({_id: orderId});

        let allOrderItems = orderObj.items;

        let giftCardRedeem = orderObj.payment.giftCards || [];
        let quantityCardRedeem = orderObj.payment.quantityCards || [];

        // var allLoyaltyPurchaseItems = [];

        var _isLoyaltyProgramPurchase = function (programId){
            if(LoyaltyPrograms.findOne({_id: programId})){
                return true;
            } else {return false;}
        };

        var _isProgramQuantityBased = function(program){
            if (program.programType.quantity > 0){
                return true;
            } else { return false;}
        };

        var _isProgramAmountBased = function(program){
            if (program.programType.creditAmount > 0){
                return true;
            } else { return false;}
        };

        //preparing for any take back of purchased loyalty programs
        _.each(allOrderItems, function(item){
            var itemId = item.product._id;
            if (_isLoyaltyProgramPurchase(itemId)){
                var loyaltyProgramObj = LoyaltyPrograms.findOne({_id: itemId});
                if (_isProgramQuantityBased(loyaltyProgramObj)){
                    quantityCardRedeem.push({
                        programId: loyaltyProgramObj._id,
                        redeemedQuantity: -loyaltyProgramObj.programType.quantity * item.quantity
                    });
                } else if (_isProgramAmountBased(loyaltyProgramObj)){
                    giftCardRedeem.push({
                        programId: loyaltyProgramObj._id,
                        redeemedAmount: -loyaltyProgramObj.programType.creditAmount * item.quantity
                    });
                }
            }
        });

        // console.log('gift card redeem info: ', giftCardRedeem);
        // console.log('quantity card redeem info: ', quantityCardRedeem);

        template.giftCardRedeemInfo.set(giftCardRedeem);
        template.quantityCardRedeemInfo.set(quantityCardRedeem);
        template.payBackMoney.set({method: orderObj.payment.method, amount: orderObj.payment.received});
    };

    template.checkOrderStatus = function(orderId, state){
        let order = Orders.findOne({_id: orderId});
        let status = (!!order) ? order.status : null;

        if(status==state){
            return true;
        }
    };

    template.selectOrder = function(order){
        template.initOrderHistory();
        template.selectedOrder.set(order);
        if(!!order.tableId){
            template.selectedTableOrder.set(order);
        } else {
            template.selectedDirectOrder.set(order);
        }
        // if(order.status == "Cancelled"){
            template.calculateAmounts();
        // }

        // console.log(order);
    };

    template.updateTimeElapsed = new ReactiveVar();
    template.updateTimeElapsed.set(true);

    template.viewOrderId = FlowRouter.getParam("orderId");

    this.autorun(function(){
        let businessId = UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID);
        let locationId = UserSession.get(Maestro.UserSessionConstants.LOCATION_ID);
        let limit = template.displayLimit.get();
        Template.instance().subscribe('orders-genericSearch', businessId, locationId, template.orderSearchFilter.get(), limit);
        Template.instance().subscribe("orders-orderId", businessId, template.viewOrderId);
    });

    this.autorun(function(){
        let businessId = UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID);
        let locationId = UserSession.get(Maestro.UserSessionConstants.LOCATION_ID);
        Template.instance().subscribe('tables-location-specific', businessId, locationId);
    });

    this.autorun(function(){
        if(Template.instance().subscriptionsReady()  && !!template.viewOrderId){
            let order = Orders.findOne({_id: template.viewOrderId});
            if(!!order){
                template.selectOrder(order);
                template.viewOrderId = null;
            }
        }
    });
});

Template.OrderHistory.onRendered(function() {
    let template = this;

    $('.modal-trigger').leanModal();
    template.initOrderHistory();

    Meteor.setInterval(function(){
        template.updateTimeElapsed.set(!template.updateTimeElapsed.get());
    }, 1000*60);

});

Template.OrderHistory.helpers({
    isOrderSearchTypeSelected: function(searchType){
        if (searchType == Template.instance().searchType.get()){
            return true;
        }
        return false;
    },

    orderHistory: function(){
        let filterCriteria = {
            status: {$ne: "Created"}
        };
        filterCriteria.locationId = UserSession.get(Maestro.UserSessionConstants.LOCATION_ID);
        filterCriteria = _.extend(filterCriteria, Template.instance().orderSearchFilter.get());
        return Orders.find(filterCriteria, {sort:{createdAt:-1}});
    },

    getSpecificOrder: function(orderId){
        return Orders.findOne({_id: orderId});
    },

    getCustomerName: function(customerId){
        if (customerId){
            return Customers.findOne({_id:customerId}).name;
        }
    },

    formatOrderDate: function(orderDate){
        let dateOfOrder = new Date(orderDate);
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return dateOfOrder.getDate() + "-" + months[dateOfOrder.getMonth()];
    },

    getSelectedDirectOrder: function(){
        return Template.instance().selectedDirectOrder.get();
    },

    getSelectedTableOrder: function(){
        return Template.instance().selectedTableOrder.get();
    },

    isOrderSelected: function(orderId){
        currentOrder = Template.instance().selectedOrder.get();
        if (currentOrder){
            if(orderId == currentOrder._id){
                return 'background-color:lightblue;';
            }
        }
    },

    orderComplete: function(){
        return Template.instance().checkOrderStatus (this._id, "Completed");

    },

    orderCancelled: function(){
        return Template.instance().checkOrderStatus (this._id, "Cancelled");

    },

    orderHold: function(){
        return Template.instance().checkOrderStatus (this._id, "Hold");

    },

    orderWaiting: function(){
        return Template.instance().checkOrderStatus (this._id, "Created");
    },

    orderSplitOut: function(){
        return Template.instance().checkOrderStatus (this._id, "Split");
    },

    itemsWaiting: function(){
        let order = Template.instance().selectedTableOrder.get();
        let itemWaiting = false;
        // console.log(order);
        _.each(order.items, function(item){
            // console.log(item);
            if (!item.sentToKitchen){
                itemWaiting = true;
            }
        });
        return itemWaiting;
    },

    orderNotEditable: function(){
        let order = Template.instance().selectedTableOrder.get();
        if (order.status == "Completed" || order.status == "Cancelled"){
            return true;
        }
        return false;
    },

    getProgramName: function(programId){
        let program = LoyaltyPrograms.findOne({_id: programId});
        if (program) {
            return program.name;
        }
    },

    isAmountCredited: function(amount){
        if (amount >= 0) {
            return true;
        }
        return false;
    },

    getCancelledInfo: function(){
        let giftCards = Template.instance().giftCardRedeemInfo.get();
        let quantityCards = Template.instance().quantityCardRedeemInfo.get();
        let percentageCards = Template.instance().percentageCardRedeemInfo.get();
        let payBack = Template.instance().payBackMoney.get();

        return {
            giftCards: giftCards,
            quantityCards: quantityCards,
            percentageCards: percentageCards,
            payBack: payBack
        };

    },

    getPaymentReceived: function(){
        return Template.instance().payBackMoney.get();
    },

    getGiftCardTotal: function(){
        let giftCards = Template.instance().giftCardRedeemInfo.get();
        var giftCardTotal = 0;
        if(giftCards){
            for (i = 0; i < giftCards.length; i++){
                giftCardTotal += giftCards[i].redeemedAmount;
            }

            if (giftCardTotal > 0){
                return {giftCard: giftCardTotal};
            }
        }

        return null;
    },

    amountIsNotZero: function(amount){
        if (amount != 0 && !!amount){
            return true;
        }
        return false;
    },

    getPaymentMethod: function(method){
        return Maestro.Payment.MethodsEnum.get(method, "label");
    },

    getWaiterName: function(waiterId){
        if(!waiterId){return;}
        let waiter = Employees.findOne({_id: waiterId}, {fields: {name:1}});

        return waiter;
    },

    getTimeElapsed: function(createdAt){
        Template.instance().updateTimeElapsed.get();

        let currentTime = new Date();
        let creationTime = new Date(createdAt);

        let millisecondsPast = currentTime.valueOf() - creationTime.valueOf();
        let hoursPast = Math.floor(millisecondsPast/(1000*60*60));
        let minutesPast = Math.floor((millisecondsPast % (1000*60*60))/(1000*60));

        if(hoursPast > 0){
            return String(hoursPast) + "h " + String(minutesPast) + "m"; 
        } else {
            return String(minutesPast) + "mins";
        }
    },  

    itemIsLoyaltyProgram: function(programId){
        if(!!LoyaltyPrograms.findOne({_id: programId})){
            return true;
        }
        return false;
    },

    getGroupedItems: function(orderItems){
        let seatGroups = _.groupBy(orderItems, function(item){return item.seatNumber;});
        let groupedItems = _.map(seatGroups, function(items, key){
            return{
                seatNum: key,
                seatItems: items
            };
        });
        return groupedItems;
    },

    getOrderType: function(type){ 
        if(type == "EXPRESS"){
            return "Express";
        } else if (type == "DINEIN"){
            return "Dine-In";
        } else if (type == "TAKEOUT"){
            return "Take-Out";
        } else if (type == "DELIVERY"){
            return "Delivery";
        }

        return null;
    },

    getOrderTypeIcon: function(type){
        if(type == "EXPRESS"){
            return null;
        } else if (type == "DINEIN"){
            return "local_dining";
        } else if (type == "TAKEOUT"){
            return "directions_walk";
        } else if (type == "DELIVERY"){
            return "directions_car";
        }

        return null;
    },

    isDineInType: function(type){
        if (type == "DINEIN"){
            return true;
        }
        return false;
    },

    getTableLabel: function(tableId){
        return Maestro.Tables.GetSpecificTableLabel(tableId);
    },

    searchCustomerNameResults: function(){
        let customerName = Template.instance().customerNameSearch.get();
        return Maestro.Customers.SearchCustomerMatch('name', customerName, false, optimize = true);
    }

});

Template.OrderHistory.events({
    'click .selectCustomerSearchField': function(event, template){
        let searchField = $(event.target).data('field');
        template.searchType.set(searchField);
        template.focusOnCustomerSearchField();
    },

    'click .displayNextOrderSet': function(event, template){
        template.displayLimit.set(template.displayLimit.get() + template.setLimit);
    },

    'click .selectHistoricalOrder': function(event, template){
        template.selectOrder(this);
    },

    'keyup #order-number-search': function(event, template){
        let orderNumSearch = Number(document.getElementById('order-number-search').value);
        if(orderNumSearch > 999){
            template.orderSearchFilter.set({uniqueOrderNumber: orderNumSearch});
            template.selectedOrder.set();
        } else {
            template.orderSearchFilter.set({});
        }
        
    },

    'keyup #daily-number-search': function(event, template){
        let dailyNumSearch = Number(document.getElementById('daily-number-search').value);
        if(dailyNumSearch > 0){
            template.orderSearchFilter.set({dailyOrderNumber: dailyNumSearch});
            template.selectedOrder.set();
        } else {
            template.orderSearchFilter.set({});
        }
    },

    'keyup #customer-name-search': function(event, template){
        let nameSearch = document.getElementById('customer-name-search').value;
        if(!!nameSearch){
            template.customerNameSearch.set(nameSearch);
            template.selectedOrder.set();
        } else {
            template.customerNameSearch.set(null);
            template.orderSearchFilter.set({});
        }
    },

    'click .searchThisCustomer': function(event, template){
        template.orderSearchFilter.set({customerId: this._id});
        template.customerNameSearch.set();
    },
    
    'click #emailReceipt': function(event, template){
        let orderId = template.selectedOrder.get()._id;
        let order = Orders.findOne({_id: orderId});

        Meteor.call('emailReceipt', order);
    },

    'click #sendToKitchen': function(event, template){
        let order = this;
        Maestro.Order.SendToKitchen(order);
        template.selectOrder(template.selectedOrder.get());
        // Maestro.Order.PrintKitchenOrder(order);
    },

    'click .sendItemToKitchen': function(event, template){
        // console.log('Sending item to kitchen: ', this);
        let item = this;
        Maestro.Order.SendItemToKitchen(item, template.selectedOrder.get());
        template.selectOrder(template.selectedOrder.get());
    },

    'click #printReceipt':function(event, template){
        // console.log("Printing Reciept for: ", this);
        let order = this;
        Maestro.Order.PrintOrderReceipt(order);
    },

    'click .cancelOrder': function(event, template){
        let orderId = template.selectedOrder.get()._id;
        Maestro.Order.CancelOrder(orderId);
        template.calculateAmounts();
    }

});

