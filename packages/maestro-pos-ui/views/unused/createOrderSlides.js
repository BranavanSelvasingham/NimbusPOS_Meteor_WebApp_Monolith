Maestro.Templates.CreateOrderSlides = "CreateOrderSlides";

// let PRODUCTS = "Products";
// initialize filters
// var ordersSelectedCategoryFilter = new ReactiveVar();
// ordersSelectedCategoryFilter.set('All');

// var ordersSelectedAlphabetFilter = new ReactiveVar();
// ordersSelectedAlphabetFilter.set('All');

var newCustomerId = new ReactiveVar();

Template.CreateOrderSlides.onCreated(function() {
    var template = this;

    initializeOrder(this);
});

Template.CreateOrderSlides.onRendered(function() {
    var template = this;
    
    let modalOptions = {
        dismissible: false,
        opacity: .6,
        in_duration: 100,
        out_duration: 100,
        complete: function () {
            //$('.lean-overlay').remove();
        }
    };

    // $('#order-slides-select').pushpin({ offset: $('header').offset().top + $('header').height()});
    // $.scrollSpy('.order-slide', {pageOffset: $('#order-slides-select').offset().top });

    $('#product-search-category').material_select();

    $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });

    $('#begin-checkout').leanModal(_.extend(modalOptions, {
        ready: function () {
            template.paymentMethod.set("cash");
        },
        complete: function () {
            template.paymentMethod.set("cash");
        }
    }));

    // $('#begin-checkout-bottom').leanModal(_.extend(modalOptions, {
    //     ready: function () {
    //         template.paymentMethod.set("cash");
    //     },
    //     complete: function () {
    //         template.paymentMethod.set("cash");
    //     }
    // }));

    $('#checkout-tabs').tabs();
    $('#checkout-tabs-bottom').tabs();
    
    if(Meteor.isCordova){
        $('#product-customer-loyalty-tabs-header').tabs();
    } else {
        $('#product-customer-loyalty-tabs').tabs();
    }
    
    $("#order-checout-balance-tabs").tabs();

    $("#search-add-customers-tabs").tabs();

    // $('#select-addon-options').leanModal();

    // this.autorun(function () {
    //     if(this.selectedProduct && this.selectedProduct.get()) {
    //         $('#select-product-options').leanModal(modalOptions);
    //     }
    // });

    this.autorun(function(){
        if(newCustomerId.get()){
            let customerId = newCustomerId.get();
            Template.instance().orderCustomer.set(Customers.findOne({_id: customerId}));
            newCustomerId.set();
        }
    });

});

Template.CreateOrderSlides.helpers(_.extend(orderHelpers, {
    'candidateOrderItem': function () {
        return Template.instance().candidateOrderItem.get();
    },

    'selectedCandidateSize': function () {
        let candidateOrderItem = Template.instance().candidateOrderItem.get();
        let candidateOrderItemSize = candidateOrderItem.size;
        if(candidateOrderItemSize && candidateOrderItemSize.code) {
            return this.code === candidateOrderItemSize.code;
        }
        return false;
    },

    'alphabet': function(){
        var upperAlphabetArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U','V','W','X','Y','Z'];
        var upperAlphabet = [];

        for (i = 0; i<26; i++){
            upperAlphabet.push({letter: upperAlphabetArray[i]});
        }

        return upperAlphabet;
    },

    isAlphabetSelected: function(letter){
        if(letter == Template.instance().ordersSelectedAlphabetFilter.get()){
            return 'background-color:lightblue;';
        }
    },

    isLocationSelected: function(){
        let locationID = Maestro.Client.locationId();
        if (!locationID){
            Materialize.toast("Select Location", 4000);
        }
    },

    displaySizeLine: function(item){
        if(item){
            if(item.quantity == 1 && item.addOns.length==0 && item.product.sizes.length ==1){
                return false;
            }
        }
        return true;
    },

}));

Template.CreateOrderSlides.events(_.extend(orderEvents, {
    'click .beginCheckout': function(event, target){
        $('ul.tabs').tabs('select_tab', 'checkoutTab'); 
    },

    'click .goToOrderTab': function(event, target){
        $('ul.tabs').tabs('select_tab', 'orderTab');
        $('ul.tabs').tabs('select_tab', 'order-products');
    },

    'click .selectAlphabet': function(event, target){
        let alphabetLetter = $(event.target).data('alphabet');
        target.ordersSelectedAlphabetFilter.set(alphabetLetter);
    },

    'click .decrease-quantity': function (event, template) {
        event.preventDefault();

        let candidateOrderItem = template.candidateOrderItem.get();
        candidateOrderItem.quantity = candidateOrderItem.quantity - 1;

        if(candidateOrderItem.quantity < 0) {
            candidateOrderItem.quantity = 0;
        }

        template.candidateOrderItem.set(candidateOrderItem);
        checkOrderForLoyaltyCreditItems(template);
    },

    'click .increase-quantity': function (event, template) {
        event.preventDefault();

        let candidateOrderItem = template.candidateOrderItem.get();
        candidateOrderItem.quantity = candidateOrderItem.quantity + 1;

        template.candidateOrderItem.set(candidateOrderItem);
        checkOrderForLoyaltyCreditItems(template);
    },

    'click .increase-item-quantity':function(event, template){
        let orderItem = this;
        let productId = $(event.target).data("productid");
        let sizeCode = $(event.target).data("sizecode");

        let key = sizeCode + "-" + productId + getAddOnKey(orderItem.addOns);

        let productItem = template.orderItems.get(key);

        productItem.quantity += 1;

        template.orderItems.set(key, productItem);
        checkOrderForLoyaltyCreditItems(template);
    },

    'click .decrease-item-quantity': function(event, template){
        let orderItem = this;
        let productId = $(event.target).data("productid");
        let sizeCode = $(event.target).data("sizecode");
        let key = sizeCode + "-" + productId + getAddOnKey(orderItem.addOns);

        let productItem = template.orderItems.get(key);

        if (productItem.quantity >1){
            productItem.quantity -= 1;
        }

        template.orderItems.set(key, productItem);
        checkOrderForLoyaltyCreditItems(template);
    },

    'click .group-item-select': function(event, template){
        template.selectedCandidateGroup.set(this);
    },

    'click .deselect-group-item': function(event, template){
        template.selectedCandidateGroup.set();
    },

    'click .product-collapse': function(event, template){
        template.expandedProduct.set();
    },

    'click .product-item-select': function (event, template) {
        event.preventDefault();
        let candidateProductId = $(event.target).data('productid');
        // let candidateProduct = _.find(template.lists.get(PRODUCTS), function(prod){ return prod._id == candidateProductId});
        let candidateProduct = Products.findOne({_id: this._id});
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
        // console.log('selected item: ', candidateOrderItem);
        //open modal if more than one size
        // if (candidateProduct.sizes.length === 1 && anyAddOns.length===0) {
        if (candidateProduct.sizes.length === 1) {
            // let candidateOrderItem = template.candidateOrderItem.get();
            if(candidateOrderItem && candidateOrderItem.size) {
                selectProduct(candidateOrderItem.product, candidateOrderItem.size.code, candidateOrderItem.quantity, null, template);
                checkOrderForLoyaltyCreditItems(template);
            }
            template.expandedProduct.set();
        } else {
            template.expandedProduct.set(candidateProduct);
            // if(candidateProduct.group){
            //     $('#select-product-options').openModal();
            // }
        }
    },

    'click .product-size-select': function (event, template) {
        let candidateOrderItem = template.candidateOrderItem.get();
        candidateOrderItem.size = this;

        let key = candidateOrderItem.size.code + "-" + candidateOrderItem.product._id;
        let existingOrderItem = template.orderItems.get(key);

        if(existingOrderItem) {
            let oldCandidateItemQuantity = candidateOrderItem.quantity;
            candidateOrderItem = existingOrderItem;
            candidateOrderItem.quantity = oldCandidateItemQuantity;
        }

        template.candidateOrderItem.set(candidateOrderItem);

        // var noAddons = true;
        // if (candidateOrderItem) { 
        //     if (candidateOrderItem.product.addOns) { 
        //         if (candidateOrderItem.product.addOns.length > 0) {
        //             noAddons = false;
        // }}}

        // if(candidateOrderItem && candidateOrderItem.size && noAddons) {
        if(candidateOrderItem && candidateOrderItem.size) {
            selectProduct(candidateOrderItem.product, candidateOrderItem.size.code, candidateOrderItem.quantity, null, template);
            checkOrderForLoyaltyCreditItems(template);
            // $('#select-product-options').closeModal();
        }
        
        // if (candidateOrderItem.product.addOns.length === 0) {
        //     $('#select-product-options').closeModal();
        // }

    },

    'click .selectCustomerSearchBox': function(event, template){
        if(!template.orderCustomer.get()){
            document.getElementById('customer-search').focus();
            document.getElementById('customer-search').select();
            // console.log('focus set');
        }
    },

    'blur #customer-name': function(event, template) {
        $('#customer-name').removeClass("invalid");

        Meteor.call("customerNameExists", template.find("#customer-name").value, function(error, result) {
            if(!error) {
                // console.log(result);
                if (result){
                    $('#error-message-name').text('An identical customer name already exists');
                    $('#customer-name').addClass("invalid");
                } else {
                    $('#error-message-name').text('');
                }
            }
        });
    },

    'blur #email': function(event, template) {
        $('#email').removeClass("invalid");

        Meteor.call("customerEmailExists", template.find("#email").value, function(error, result) {
            if(!error) {
                if(result){
                    $('#error-message-email').text('An identical email already exists');
                    $('#email').addClass("invalid");
                } else {
                    $('#error-message-email').text('');
                }
            }
        });
    },

    'click #cancel-create-customer': function(event, target){
        document.getElementById('create-customer').reset();
    },

    'submit #create-customer': function(event, template) {
        event.preventDefault();

        var customerName = template.find("#customer-name").value,
                email = template.find("#email").value,
                unformattedPhone = template.find('#customerPhone').value;

        customerName = Maestro.UtilityMethods.ConvertStringCaps(customerName);

        // var inputErrors = $('#customer-name').hasClass('invalid') || $('#email').hasClass('invalid') || !customerName;

        var inputErrorName = Customers.findOne({name: customerName});
        var inputErrorEmail = Customers.findOne({email: email});

        // console.log(inputErrorName, inputErrorEmail);

        if (!!inputErrorName){
            Materialize.toast("Identical Name Exists", 2000);
            return;
        }

        if(!!inputErrorEmail){
            Materialize.toast("Identical Email Exists", 2000);
            return;
        }

        var doesCustomerNameExist;
        var doesEmailExist;

        var businessId = Maestro.Business.getBusinessId();

        var customerInfo = {
            name: customerName,
            email: email,
            businessId: businessId
        };

        var formattedPhone = "";

        for (i=0; i < unformattedPhone.length; i++){
            if (unformattedPhone[i] > -1){
                formattedPhone += unformattedPhone[i];
            }
        }

        if(formattedPhone.length){
            customerInfo.phone = Number(formattedPhone);
        }
        
        // Meteor.call("createCustomer", customerInfo, function(error, result, template) {
        //     if(error) {
        //         console.log(error);
        //     } else {
        //         Materialize.toast("Created a customer", 4000);
        //         document.getElementById('create-customer').reset();
        //         newCustomerId.set(result);
        //         $('ul.tabs').tabs('select_tab', 'order-loyalty');
        //     }
        // });

        let newCustId = Maestro.Customers.CreateCustomer(customerInfo);

        if(!!newCustId){
            Materialize.toast("Created a customer", 4000);
            document.getElementById('create-customer').reset();
            $('ul.tabs').tabs('select_tab', 'searchCustomer');
            clearCustomerInfo(template);
            newCustomerId.set(newCustId);
            $('ul.tabs').tabs('select_tab', 'order-loyalty');
        } else {
            console.log("error creating new customer");
        }
    },

    'click #save-changes-customer': function(event, template) {

        let customerId = template.orderCustomer.get()._id;
        
        var customerName = template.find("#edit-customer-name").value,
                email = template.find("#edit-email").value,
                unformattedPhone = template.find('#edit-customerPhone').value;

        customerName = Maestro.UtilityMethods.ConvertStringCaps(customerName);

        // var inputErrors = $('#customer-name').hasClass('invalid') || $('#email').hasClass('invalid') || !customerName;

        var inputErrorName = Customers.findOne({_id: {$ne: customerId}, name: customerName});
        var inputErrorEmail = Customers.findOne({_id: {$ne: customerId}, email: email});

        // console.log(inputErrorName, inputErrorEmail);

        if (!!inputErrorName){
            Materialize.toast("Identical Name Exists", 2000);
            return;
        }

        if(!!inputErrorEmail){
            Materialize.toast("Identical Email Exists", 2000);
            return;
        }

        var doesCustomerNameExist;
        var doesEmailExist;

        var businessId = Maestro.Business.getBusinessId();

        var customerInfo = {
            name: customerName,
            email: email,
            businessId: businessId
        };

        var formattedPhone = "";

        for (i=0; i < unformattedPhone.length; i++){
            if (unformattedPhone[i] > -1){
                formattedPhone += unformattedPhone[i];
            }
        }

        if(formattedPhone.length){
            customerInfo.phone = Number(formattedPhone);
        }
        
        // Meteor.call("createCustomer", customerInfo, function(error, result, template) {
        //     if(error) {
        //         console.log(error);
        //     } else {
        //         Materialize.toast("Created a customer", 4000);
        //         document.getElementById('create-customer').reset();
        //         newCustomerId.set(result);
        //         $('ul.tabs').tabs('select_tab', 'order-loyalty');
        //     }
        // });

        Maestro.Customers.EditCustomer(customerId, customerInfo);

        // console.log(customerInfo);

        Materialize.toast("Updated Details", 2000);

        $('ul.tabs').tabs('select_tab', 'searchCustomer');
        clearCustomerInfo(template);
        let customer = Customers.findOne({_id: customerId});
        Template.instance().orderCustomer.set(customer);
        getExistingCustomerLoyaltyPrograms(customer, template);
    },

    'click .product-add-on-select': function(event, template){
        let candidateOrderItem = template.thisOrderItem.get();
        
        var currentAddOns = candidateOrderItem.addOns || [];

        currentAddOns.push(this);

        candidateOrderItem.addOns = currentAddOns;

        removeProductItem(candidateOrderItem.currentKey, template);
        deleteIfAnyRedeemProduct(candidateOrderItem.currentKey, template);

        resumeCounter = template.itemIdCounter.get();
        template.itemIdCounter.set(candidateOrderItem.itemNumber);

        selectProduct(candidateOrderItem.product, candidateOrderItem.size.code, candidateOrderItem.quantity, candidateOrderItem.addOns, template);
        checkOrderForLoyaltyCreditItems(template);

        template.itemIdCounter.set(resumeCounter);

        candidateOrderItem.currentKey = fullItemKey(candidateOrderItem);
        template.thisOrderItem.set(candidateOrderItem);

        // if(candidateOrderItem && candidateOrderItem.size) {
        //     selectProduct(candidateOrderItem.product, candidateOrderItem.size.code, candidateOrderItem.quantity, candidateOrderItem.addOns, template);
        //     checkOrderForLoyaltyCreditItems(template);
        // }
    },

    'click .closeSelectedAddOnChip': function(event, template){
        let candidateOrderItem = template.thisOrderItem.get();

        var currentAddOns = candidateOrderItem.addOns || [];

        currentAddOns.splice(currentAddOns.indexOf(this),1);

        candidateOrderItem.addOns = currentAddOns;

        removeProductItem(candidateOrderItem.currentKey, template);
        deleteIfAnyRedeemProduct(candidateOrderItem.currentKey, template);

        resumeCounter = template.itemIdCounter.get();
        template.itemIdCounter.set(candidateOrderItem.itemNumber);

        selectProduct(candidateOrderItem.product, candidateOrderItem.size.code, candidateOrderItem.quantity, candidateOrderItem.addOns, template);
        checkOrderForLoyaltyCreditItems(template);

        template.itemIdCounter.set(resumeCounter);

        candidateOrderItem.currentKey = fullItemKey(candidateOrderItem);
        template.thisOrderItem.set(candidateOrderItem);
    },

    // 'click #complete-addon-selection': function (event, template) {
    //     let candidateOrderItem = template.thisOrderItem.get();

    //     let selectedSizeCode = candidateOrderItem.size.code;
    //     let selectedProductId = candidateOrderItem.product._id;
    //     let selectedAddOns = candidateOrderItem.addOns;

    //     let key = selectedSizeCode + "-" + selectedProductId + getAddOnKey(selectedAddOns);

    //     if(candidateOrderItem && candidateOrderItem.size) {
    //         selectProduct(candidateOrderItem.product, candidateOrderItem.size.code, candidateOrderItem.quantity, candidateOrderItem.addOns, template);
    //         checkOrderForLoyaltyCreditItems(template);
    //         $('#select-product-options').closeModal();
    //     }
    // },

    // 'scroll .order-slide, scroll #create-order-slides-content *': function (event, template) {
    //     event.preventDefault();
    //     event.preventBubble();
    //     event.stopPropagation();
    //     event.stopImmediatePropagation();
    // }

}));