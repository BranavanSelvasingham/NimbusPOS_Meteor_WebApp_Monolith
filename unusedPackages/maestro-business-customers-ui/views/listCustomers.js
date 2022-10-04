Maestro.Templates.ListCustomers = "ListCustomers";

var selectedCustomer = new ReactiveVar();

var customerSearchTerm = new ReactiveVar();
customerSearchTerm.set('Alphabet:All');

var customerList = new ReactiveVar();

var _getCustomerList = function(){
    var searchTerm = customerSearchTerm.get();
    var searchKey = searchTerm.split(':');

    if ((searchKey[0] == "Alphabet") && (searchKey[1]=="All")){
        searchTerm = "";
    }

    Meteor.call("searchCustomers", searchTerm, function(error, result){
        customerList.set(result);
    });
};

Template.ListCustomers.onRendered(function () {
	$('#listCustomers').collapsible({
      accordion : true
  	});

    _getCustomerList();
});

Template.ListCustomers.helpers({
	customers: function(){
        return customerList.get();
	},

	getSelectedCustomer: function(){
		return selectedCustomer.get();
	},

	isSelectedCustomer: function(customerId){
		let chosenCustomer = selectedCustomer.get();
        if (chosenCustomer){
            let chosenCustomerId = chosenCustomer._id;

            if (customerId == chosenCustomerId){
                return 'background-color:lightblue;'
            } else {
                return;
            }
        } else {return;}
	},

	getCustomerSpend: function(customerId){
		var customerOrders = Orders.find({customerId: customerId}).fetch();
		var customerTally = 0;
		
		for (i = 0; i < customerOrders.length; i++){
			customerTally += customerOrders[i].subtotals.total;
		}

		return customerTally.toFixed(2);
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
    	let currentLetter = 'Alphabet:'+letter;

        if(currentLetter == customerSearchTerm.get()){
            return 'background-color:lightblue;';
        }
    },

    getActivePrograms: function(customerId){
        return _.reject(Customers.findOne({_id: customerId}).loyaltyPrograms, function(program){return program.expired;});
    },

    getInactivePrograms: function(customerId){
        return _.filter(Customers.findOne({_id: customerId}).loyaltyPrograms, function(program){return program.expired;});
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
    }

});


Template.ListCustomers.events({
	'click .customerSelected': function(event, target) {
	 	let customerId = $(event.target).data("customerid");
	 	selectedCustomer.set(Customers.findOne({_id: customerId}));
	},

	'click .selectAlphabet': function(event, target){
        let alphabetLetter = $(event.target).data('alphabet');
        customerSearchTerm.set('Alphabet:'+alphabetLetter);
        _getCustomerList();
    },

    'keyup #customer-name-search': function (event, template) {
        let searchTerm = $(event.currentTarget).val();
        customerSearchTerm.set(searchTerm);
        _getCustomerList();
    },

	'click #add-Customer':function(event, target){
		$('#addNewCustomerModal').openModal();
	},

	'click #cancel-create-customer':function(event, target){
		$('#addNewCustomerModal').closeModal();
        _getCustomerList();
	},

	'click #save-edit-customer': function(event, template){
		event.preventDefault();

        let customerName = template.find("#customer-edit-name").value;
        let customerEmail = template.find("#customer-email").value;
        
        let customer = selectedCustomer.get();
        let customerId = customer._id;
       
        var errorMessage;
        var inputErrors;

        let customerNameCheck = Customers.find({name: customerName}).fetch();
        let customerEmailCheck = Customers.find({email: customerEmail}).fetch();

        if (customerNameCheck.length > 1){
        	inputErrors = true;
        	errorMessage = "Identical name already exists1";
        } else if (customerNameCheck.length == 1) {
        	if(customerNameCheck[0]._id != customerId){
        		inputErrors = true;
        		errorMessage = "Identical name already exists2";
        	}
        }

        if (customerEmailCheck.length > 1){
        	inputErrors = true;
        	errorMessage = "Identical email already exists1";
        } else if (customerEmailCheck.length == 1) {
        	if(customerEmailCheck[0]._id != customerId){
        		inputErrors = true;
        		errorMessage = "Identical email already exists2";
        	}
        }

        if (!inputErrors){
            var customerInfo = {
                name: customerName,
                email: customerEmail
            };

            Meteor.call("editCustomer", customerId, customerInfo, function(error, result) {
                if(error) {
                    console.log(error);
                } else {
                    Materialize.toast("Updated customer", 4000);
                    $('#save-error-message').text("");
                }
            });
        } else {       
        	$('#save-error-message').text(errorMessage);
        }
	},

    'click #deleteCustomer': function(event, target){
        Meteor.call('deleteCustomer', this._id, function(error, result){
            if(error){
                console.log(error);
            } else {
                console.log('deleted');
            }
        });
        _getCustomerList();
        selectedCustomer.set();
    },
});

