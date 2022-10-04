Maestro.Templates.OpenOrders = "OpenOrders";

Template.OpenOrders.onCreated(function(){
    let template = this;

    template.selectedOrder = new ReactiveVar();
    template.selectedDirectOrder = new ReactiveVar();
    template.selectedTableOrder = new ReactiveVar();
    template.giftCardRedeemInfo = new ReactiveVar();
    template.quantityCardRedeemInfo = new ReactiveVar();
    template.payBackMoney = new ReactiveVar();
    template.displayLimit = new ReactiveVar();
    template.setLimit = 10;

    template.displayLimit.set(template.setLimit);

    template.orderNumberSearch = new ReactiveVar();

    template.initActiveOrders = function(){
        template.selectedOrder.set();
        template.selectedDirectOrder.set();
        template.selectedTableOrder.set();
        template.giftCardRedeemInfo.set();
        template.quantityCardRedeemInfo.set();
        template.payBackMoney.set();
    };

    template.calculateAmounts = function(){
        let orderId = template.selectedOrder.get()._id;

        let orderObj = Orders.findOne({_id: orderId});

        let allOrderItems = orderObj.items;

        let giftCardRedeem = orderObj.payment.giftCards || [];
        let quantityCardRedeem = orderObj.payment.quantityCards || [];

        var allLoyaltyPurchaseItems = [];

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
        for (item = 0; item < allOrderItems.length; item ++){
            var itemId = allOrderItems[item].product._id;
            if (_isLoyaltyProgramPurchase(itemId)){
                var loyaltyProgramObj = LoyaltyPrograms.findOne({_id: itemId});
                if (_isProgramQuantityBased(loyaltyProgramObj)){
                    quantityCardRedeem.push({
                        programId: loyaltyProgramObj._id,
                        redeemedQuantity: -loyaltyProgramObj.programType.quantity
                    });
                } else if (_isProgramAmountBased(loyaltyProgramObj)){
                    giftCardRedeem.push({
                        programId: loyaltyProgramObj._id,
                        redeemedAmount: -loyaltyProgramObj.programType.creditAmount
                    });
                }
            }
        }

        // console.log('gift card redeem info: ', giftCardRedeem);
        // console.log('quantity card redeem info: ', quantityCardRedeem);
        // console.log('allLoyaltyPurchaseItems: ', allLoyaltyPurchaseItems);

        let customerId = orderObj.customerId;
        
        if(customerId){
            var customerPrograms = Maestro.LoyaltyCards.getCustomerActiveCards(customerId);

            // console.log('current customer programs: ', customerPrograms);

            if(customerPrograms){
                //credit back gift cards
                for (card = 0; card < giftCardRedeem.length; card ++){
                    var programIndex = _.indexOf(customerPrograms, _.find(customerPrograms, function(program){return program.programId == giftCardRedeem[card].programId;}));
                    customerPrograms[programIndex].remainingAmount += giftCardRedeem[card].redeemedAmount;
                    customerPrograms[programIndex].expired = false;
                }

                //credit back quantity cards
                for (card = 0; card < quantityCardRedeem.length; card ++){
                    var programIndex = _.indexOf(customerPrograms, _.find(customerPrograms, function(program){return program.programId == quantityCardRedeem[card].programId;}));
                    customerPrograms[programIndex].remainingQuantity += quantityCardRedeem[card].redeemedQuantity;
                    customerPrograms[programIndex].expired = false;
                }
            }
        }

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

    template.scrollToItemAndHighlight = function(orderId){
        Tracker.afterFlush(function(){
            if(!!document.getElementById(orderId)){
                document.getElementById(orderId).scrollIntoView();
            }
            $('#'+orderId).addClass('fadeOut');
            window.setTimeout(function(){
                $('#'+orderId).removeClass('fadeOut').addClass('fadeIn');
            }, 500);

        });
    };

    template.updateTimeElapsed = new ReactiveVar();
    template.updateTimeElapsed.set(true);

    template.viewOrderId = FlowRouter.getParam("orderId");

    this.autorun(function(){
        let businessId = UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID);
        let locationId = UserSession.get(Maestro.UserSessionConstants.LOCATION_ID);

        Template.instance().subscribe('orders-incomplete-atLocation-today', businessId, locationId);
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
                // template.selectOrder(order);
                template.viewOrderId = null;
            }
        }
    });
});

Template.OpenOrders.onRendered(function() {
    let template = this;

    $('.modal-trigger').leanModal();
    template.initActiveOrders();

    Meteor.setInterval(function(){
        template.updateTimeElapsed.set(!template.updateTimeElapsed.get());}, 1000*60);

});

Template.OpenOrders.helpers({
    getAllActiveOrders: function(){
        let filterCriteria = {
            status: "Created"
        };
        if(!!Template.instance().orderNumberSearch.get()){
            filterCriteria.uniqueOrderNumber = Number(Template.instance().orderNumberSearch.get());
        }
        filterCriteria.locationId = UserSession.get(Maestro.UserSessionConstants.LOCATION_ID);
        return Orders.find(filterCriteria, {sort:{createdAt:-1}});
    },

    getOpenOrdersCount: function(){
        return Orders.find({status: "Created"}).count();
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

    orderHold: function(){
        return Template.instance().checkOrderStatus (this._id, "Hold");

    },

    orderWaiting: function(){
        return Template.instance().checkOrderStatus (this._id, "Created");
    },

    itemsWaiting: function(){
        let order = this;
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
        let order = this;
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
        var giftCards = Template.instance().giftCardRedeemInfo.get();
        var quantityCards = Template.instance().quantityCardRedeemInfo.get();
        var payBack = Template.instance().payBackMoney.get();

        return {
            giftCards: giftCards,
            quantityCards: quantityCards,
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
        // console.log(_.values(_.groupBy(orderItems, function(item){return item.seatNumber;})));
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
    }

});

Template.OpenOrders.events({
    'click .displayNextOrderSet': function(event, template){
        if(template.orderNumberSearch.get()){
            template.orderNumberSearch.set();
        } else {
            template.displayLimit.set(template.displayLimit.get() + template.setLimit);
        }
    },

    // 'click .selectHistoricalOrder': function(event, template){
    //     template.selectOrder(this);
    // },

    'keyup #order_number': function(event, template){
        template.orderNumberSearch.set(Number(document.getElementById('order_number').value));
    },

    'click #sendToKitchen': function(event, template){
        let order = this;
        Maestro.Order.SendToKitchen(order);
    },

    'click .sendItemToKitchen': function(event, template){
        let item = this;
        let orderId = $(event.target).data("orderid");
        Maestro.Order.SendItemToKitchen(item, Orders.findOne({_id: orderId}));
    },

    'click .cancelOrder': function(event, template){
        let orderId = this._id;
        Maestro.Order.CancelOrder(orderId);
    }

});

