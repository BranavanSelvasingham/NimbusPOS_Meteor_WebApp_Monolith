Maestro.Templates.ListCustomers = "ListCustomers";

Template.ListCustomers.onCreated(function () {
    let template = this;
    
    template.selectedCustomer = new ReactiveVar();

    template.customerSearchTerm = new ReactiveVar();
    // template.customerSearchTerm.set('Alphabet:All');

    template.customerList = new ReactiveVar();
    template.editDetailsMode = new ReactiveVar();
    template.editDetailsMode.set(false);

    template.addProgramMode = new ReactiveVar();
    template.addProgramMode.set(false);

    template.orderLoyaltyType = new ReactiveVar();
    template.orderLoyaltyType.set('All');

    template.addLoyaltyProgram = new ReactiveVar();

    template.existingCustomerPrograms = new ReactiveVar();

    template.createCustomerMode = new ReactiveVar();
    template.createCustomerMode.set(false);

    template.newCustomerId = new ReactiveVar();

    template.focusOnCustomerSearchField = function(){
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

    template.getCustomerMatch = function(matchField, matchTerm, showAll, optimize){
        template.customerList.set(Maestro.Customers.SearchCustomerMatch(matchField, matchTerm, showAll, optimize));
    };

    template.autorun(function(){
        let businessId = Maestro.Business.getBusinessId();
        if(!!template.selectedCustomer.get()){
            Template.instance().subscribe('orders-genericSearch', businessId, null, {customerId: (template.selectedCustomer.get() || {})._id }, null);
        }
    });

});

Template.ListCustomers.onRendered(function () {
    let template = this;

	$('#listCustomers').collapsible({
      accordion : true
  	});

    this.autorun(function(){
        if(template.newCustomerId.get()){
            let customerId = template.newCustomerId.get();
            if(customerId) {
                template.selectedCustomer.set(Customers.findOne({_id: customerId}));
            }
            template.newCustomerId.set(null);
        }
    });

    // Tracker.afterFlush(function(){template.focusOnCustomerSearchField();});
});

Template.ListCustomers.helpers({
	customers: function(){
        return Template.instance().customerList.get();
	},

	getSelectedCustomer: function(){
        let customer = Template.instance().selectedCustomer.get();
        if (!!customer){
            return Customers.findOne({_id: customer._id});
        }		
	},

	isSelectedCustomer: function(customerId){
		let chosenCustomer = Template.instance().selectedCustomer.get();
        if (chosenCustomer){
            let chosenCustomerId = chosenCustomer._id;

            if (customerId == chosenCustomerId){
                return 'background-color:lightblue;';
            }
        }
	},

    getCustomerOrderHistory: function(){
        let filterCriteria = {
            status: {$ne: "Created"}
        };
        filterCriteria.customerId = (Template.instance().selectedCustomer.get() || {})._id;
        return Orders.find(filterCriteria, {sort:{createdAt:-1}}).fetch();
    },

    getCutomerTotalSpend: function(){
        let filterCriteria = {
            status: {$ne: "Created"}
        };
        filterCriteria.customerId = (Template.instance().selectedCustomer.get() || {})._id;
        let allOrders = Orders.find(filterCriteria, {sort:{createdAt:-1}}).fetch();

        return _.reduce(allOrders, function(memo, order){return order.subtotals.total + memo;}, 0);
    },

    getCustomer30DaySpend: function(){
        let refDate = new Date();
        refDate.setDate(refDate.getDate() - 30);

        let filterCriteria = {
            status: {$ne: "Created"},
            createdAt: {$gt: refDate}
        };
        filterCriteria.customerId = (Template.instance().selectedCustomer.get() || {})._id;
        let allOrders = Orders.find(filterCriteria, {sort:{createdAt:-1}}).fetch();

        return _.reduce(allOrders, function(memo, order){return order.subtotals.total + memo;}, 0);
    },

    getActivePrograms: function(customerId){
        // return _.reject(Customers.findOne({_id: customerId}).loyaltyPrograms, function(program){return program.expired;});
        return Maestro.LoyaltyCards.getCustomerActiveCards(customerId);
    },

    getInactivePrograms: function(customerId){
        // return _.filter(Customers.findOne({_id: customerId}).loyaltyPrograms, function(program){return program.expired;});
        return Maestro.LoyaltyCards.getCustomerExpiredCards(customerId);
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

    getLoyaltyBalanceAmount: function(remainingQuantity, remainingAmount){
        return remainingQuantity || remainingAmount;
    },

    getLoyaltyExpiration: function(programId, boughtOn){
        let purchasedOn= new Date();
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

    inEditCustomerDetailsMode: function(){
        return Template.instance().editDetailsMode.get();
    },

    inAddProgramMode: function(){
        return Template.instance().addProgramMode.get();
    },

    loyaltyProgram: function(){
        let selectedProgramType = Template.instance().orderLoyaltyType.get();

        // let customer = Customers.findOne({_id: Template.instance().selectedCustomer.get()._id});

        // let existingPrograms = customer.loyaltyPrograms;

        let existingPrograms = Maestro.LoyaltyCards.getAllCustomerCards(Template.instance().selectedCustomer.get()._id);

        let existingProgramIds = _.pluck(existingPrograms, 'programId');

        let unSelectedPrograms = _.filter(LoyaltyPrograms.find({status:'Active'}).fetch(), function(program){
                return !_.contains(existingProgramIds, program._id);
            });

        if (selectedProgramType == 'All'){
            return unSelectedPrograms;
        } else {
            let filteredList = _.filter(unSelectedPrograms, function(program){
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

    getDefaultBalance: function(programType){
        return programType.creditAmount || programType.quantity || programType.creditPercentage;
    },

    isBalanceEditable: function(programId, type){
        if(Template.instance().addLoyaltyProgram.get()){
            if (Template.instance().addLoyaltyProgram.get()._id == programId){
                if(type != "Percentage"){
                    return true;
                }
            }
        }
        return false;
    },

    isProgramNonPercent: function(programId){
        let program = LoyaltyPrograms.findOne({_id: programId});
        let type = program.programType.type;
        if(type != "Percentage"){
            return true;
        }

        return false;
    },

    isSelectedAddProgram: function(programId){
        if(Template.instance().addLoyaltyProgram.get()){
            if (Template.instance().addLoyaltyProgram.get()._id == programId){
                return true;
            }
        }
        return false;    
    },

    newCustomerMode: function(){
        return Template.instance().createCustomerMode.get();
    },

    phoneFormat: function(phone){
        var phoneNumber = String(phone);

        if (!phone){
            return "No phone on record";
        } else if (phoneNumber.length==10){         
            var formatPhone = "(";
            for (i=0; i<phoneNumber.length; i++){
                formatPhone += phoneNumber[i];
                if (i==2){
                    formatPhone += ") ";
                } else if (i==5){
                    formatPhone += "-";
                }
            }
            return formatPhone;
        } else {
            return "Partial / Unrecognized: " + phoneNumber;
        }
    },

    getTallyPrograms: function(customerId){
        return Maestro.LoyaltyCards.getAllTallyCards(customerId);
    },

    isCustomerSearchTypeSelected: function(field){
        if(field == UserSession.get(Maestro.UserSessionConstants.CUSTOMER_SEARCH_TYPE)){
            return true;
        }
    },

    getArrayCount: function(arrayObj){
        return (arrayObj || []).length;
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

    formatOrderDate: function(orderDate){
        let dateOfOrder = new Date(orderDate);
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return dateOfOrder.getDate() + "-" + months[dateOfOrder.getMonth()];
    },
});


Template.ListCustomers.events({
    'click .selectCustomerSearchField': function(event, template){
        let searchField = $(event.target).data('field');
        UserSession.set(Maestro.UserSessionConstants.CUSTOMER_SEARCH_TYPE, searchField);
        template.focusOnCustomerSearchField();
    },  

	'click .customerSelected': function(event, template) {
        template.createCustomerMode.set(false);
	 	template.addProgramMode.set(false);
        let customerId = this._id;
	 	template.selectedCustomer.set(Customers.findOne({_id: customerId}));
	},

    'keyup #customer-name-search': function (event, template) {
        let searchName = $(event.currentTarget).val();

        template.getCustomerMatch('name', searchName, false, optimize = false);

    },

    'keyup #customer-phone-search': function (event, template) {
        let searchPhone = $(event.currentTarget).val();

        let formattedPhone = Maestro.Customers.Tools.FormatPhoneNumber(searchPhone);

        template.getCustomerMatch('phone', formattedPhone);
    },

    'keyup #customer-email-search': function (event, template) {
        let searchEmail = $(event.currentTarget).val();
                
        template.getCustomerMatch('email', searchEmail);
    },

    'click #showAllCustomers': function(event, template){
        template.getCustomerMatch(null, null, showAll = true, optimize = true);
    },

	'click #add-Customer':function(event, template){
        template.selectedCustomer.set(null);
        template.addProgramMode.set(false);
        template.createCustomerMode.set(true);
	},

    'click .enterEditDetailsMode': function(event, template){
        template.editDetailsMode.set(true);
    },

    'click .exitEditDetailsMode': function(event, template){
        template.editDetailsMode.set(false);
    },

    // 'keydown #customerPreference': function(event, template){
    //     var saveButton = document.getElementById('saveCustomerNotesButton');
    //     if (saveButton.style.display === 'none') {
    //         saveButton.style.display = 'block';
    //     } 
    // },

    'blur #customerPreference': function(event, template){
        let notes = $('#customerPreference').val();
        let customerId = template.selectedCustomer.get()._id;
        Maestro.Customers.UpdateCustomerNotes(customerId, notes); 
    },

	'click #save-edit-customer': function(event, template){
        let customerId = template.selectedCustomer.get()._id;
        let customerName = template.find("#customer-edit-name").value;
        let email = template.find("#customer-email").value;
        let unformattedPhone = template.find('#customer-edit-phone').value;
        
        let updated = Maestro.Customers.SubmitCustomerEditInfo(customerId, customerName, email, unformattedPhone);

        if(updated){
            Materialize.toast("Updated customer", 4000);
            $('#save-error-message').text("");
            template.editDetailsMode.set(false);
        } else {

        }
	},

    'click .enterAddProgramMode': function(event, template){
        template.addProgramMode.set(true);
    },

    'click .exitAddProgramMode': function(event, template){
        template.addProgramMode.set(false);
    },

    'click .selectLoyaltyType': function(event, template){
        let programType = $(event.target).data("programtype");
        template.orderLoyaltyType.set(programType);
    },

    'click .selectLoyaltyProgram': function(event, template){
        // console.log(this);
        template.addLoyaltyProgram.set(this);
    },

    'click .addThisProgram': function(event, template){
        let program = this;

        let loyaltyObject = {
            boughtOn: new Date(),
            expired: false,
            programId: program._id,
            remainingAmount: 0,
            remainingQuantity: 0,
            creditPercent: 0,
        };

        if(program.programType.type != "Percentage"){
            let addBalance = template.find("#existingBalance").value;

            if(!addBalance && !(typeof addBalance === 'number')){
                Materialize.toast('Enter an existing balance to add', 2000);
                return;
            }

            if(program.programType.type == "Amount"){
                if(addBalance <= 0){
                    Materialize.toast("Balance amount should be greater than 0", 2000);
                    return;
                }

                loyaltyObject.remainingAmount = addBalance;
            
            } else if (program.programType.type == "Quantity"){
                if(addBalance % 1 === 0 && addBalance >0){
                    loyaltyObject.remainingQuantity = addBalance;
                } else {
                    Materialize.toast('Remaining items needs to be a positive whole number', 2000);
                    return;
                }
            }
        } else {
            loyaltyObject.creditPercent = program.programType.creditPercentage;
        }

        Maestro.LoyaltyCards.BuyCard(template.selectedCustomer.get()._id, loyaltyObject);
    },

    'click .updateBalanceForProgram': function(event, template){
        let updateCard = this;
        let updateBalance = Number(document.getElementById('updateBalancefor-' + updateCard.programId).value);
        
        if(updateBalance < 0){
            Materialize.toast("Balance can not be less than or equal to 0", 1500, 'red');
            return;
        }
        if(!updateBalance) {return;}

        Maestro.LoyaltyCards.UpdateCardBalance(updateCard, updateBalance);
    },

    'click .deactivateProgram': function(event, template){
        let updateCard = this;
        let updateBalance = Number((document.getElementById('updateBalancefor-' + updateCard.programId) || {}).value);

        Maestro.LoyaltyCards.UpdateCardBalance(updateCard, updateBalance, expired = true);
    },

    'click .reactivateProgram': function(event, template){
        let updateCard = this;
        let balanceField = document.getElementById('reactivate-' + updateCard.programId);
        let updateBalance;

        if(!!balanceField){
            updateBalance = Number(balanceField.value);

            if(updateBalance <= 0){
                Materialize.toast("Balance can not be less than or equal to 0", 1500, 'red');
                return;
            }
        }        

        Maestro.LoyaltyCards.UpdateCardBalance(updateCard, updateBalance, expired = false);
    },

    'click #deleteCustomer': function(event, template){
        Meteor.call('deleteCustomer', this._id, function(error, result){
            if(error){
                console.log(error);
            } else {
                console.log('deleted');
            }
        });

        template.selectedCustomer.set();
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

    'click #cancel-create-customer': function(event, template){
        document.getElementById('create-customer').reset();
        template.createCustomerMode.set(false);
    },

    'click #submit-create-customer': function(event, template) {
        event.preventDefault();

        var customerName = template.find("#customer-name").value,
            email = template.find("#email").value,
            unformattedPhone = template.find('#customerPhone').value;

        let newCustId = Maestro.Customers.SubmitCustomerCreateInfo(customerName, email, unformattedPhone);

        if(!!newCustId){
            template.createCustomerMode.set(false);
            Materialize.toast("Created a customer", 4000);
            document.getElementById('create-customer').reset();
            template.newCustomerId.set(newCustId);
        } else {
            // console.log('error creating customer');
        }

    },

    'click .expandActiveCards': function(event, template){
        var container = document.getElementById('customerActiveCards');
        $('#expandActiveCards').toggleClass('rotateUp');
        if (container.style.display === 'none') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    },

    'click .expandInactiveCards': function(event, template){
        var container = document.getElementById('customerInactiveCards');
        $('#expandInactiveCards').toggleClass('rotateUp');
        if (container.style.display === 'none') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    },

    'click .expandTallyCards': function(event, template){
        var container = document.getElementById('customerTallyCards');
        $('#expandTallyCards').toggleClass('rotateUp');
        if (container.style.display === 'none') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    },

    'click .expandOrderHistory': function(event, template){
        var container = document.getElementById('customerOrderHistory');
        $('#expandOrderHistory').toggleClass('rotateUp');
        if (container.style.display === 'none') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    },

    'click .goToOrder': function(event, template){
        let order = this;

        FlowRouter.go("/orders/history/select/" + order._id);
    }
});

