Maestro.Templates.CreateExpense = "CreateExpense";

var paymentMethod;

Template.CreateExpense.onRendered(function(){
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });

    $('select').material_select();

    $('.collapsible').collapsible({
      accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });

});

Template.CreateExpense.helpers({
    getVendorList: function(){
        let allEntries = _.pluck(Expenses.find({},{fields: {vendor:1}}).fetch(), 'vendor'); 
        let uniqueEntries = _.uniq(allEntries);
        let entriesList = [];

        for (i = 0; i<uniqueEntries.length; i++){
            entriesList.push({vendor:uniqueEntries[i]});
        }

        return entriesList;
    },

    getCategoryList: function(){
        let allEntries = _.pluck(Expenses.find({},{fields: {category:1}}).fetch(), 'category'); 
        let uniqueEntries = _.uniq(allEntries);
        let entriesList = [];

        for (i = 0; i<uniqueEntries.length; i++){
            entriesList.push({category:uniqueEntries[i]});
        }

        return entriesList;
    },

    getExpenseCategoriesKeys: function(){
        return Maestro.Expenses.Categories.Canada.keys();
    },

    getCategoryLabel: function(key){
        return Maestro.Expenses.Categories.Canada.get(key, 'label');
    },

    getCategoryDescription: function(key){
        return Maestro.Expenses.Categories.Canada.get(key, 'description');
    },

    getCategoryLines: function(key){
        return Maestro.Expenses.Categories.Canada.get(key, 'line');
    }

});

Template.CreateExpense.events({
    'click .choosePaymentMethod': function(event, target){
        paymentMethod = $(event.target).data('method');
        console.log(paymentMethod);
    },

	'click #createExpense': function(event, target){
		event.preventDefault();

		$('#errorMessages').text("");

		let expenseVendor = document.getElementById('expenseVendor').value;
		// let expenseCategory = document.getElementById('expenseCategory').value;
        // let isTaxable = Boolean(document.getElementById('isTaxableCheckBox').checked);
        let expenseDetails = document.getElementById('expenseDetails').value;
        let expenseTotal = Number(document.getElementById('expenseTotal').value);
        let expenseTaxes = Number(document.getElementById('expenseTaxes').value);
        let expenseDate = new Date(document.getElementById('expenseDate').value);

        let businessId = Maestro.Business.getBusinessId();

        let newExpense = {businessId: businessId};  

        let expenseSelect = document.getElementById('expenseCategory');
        let expenseCategory = expenseSelect.options[expenseSelect.selectedIndex].value;
    
		if (!expenseVendor.length){
            $('#errorMessages').text('Enter a vendor name');
            return;
        }

        newExpense.vendor = expenseVendor;

		if (!expenseCategory.length){
            $('#errorMessages').text('Choose an expense category');
            return;
        }

        if (!(expenseTaxes =>0)){
            $('#errorMessages').text('Enter Taxes Paid or a 0 if not applicable');
            return;
        }

        if (!(expenseTotal =>0)){
            $('#errorMessages').text('Enter total expense amount');
            return;
        }

        if (!paymentMethod){
            $('#errorMessages').text('Choose payment method');
            return;
        }

        newExpense.category = expenseCategory;

        // newExpense.taxable = isTaxable;

        newExpense.details = expenseDetails;

        newExpense.amount = expenseTotal;

        newExpense.tax = expenseTaxes;

        newExpense.paymentMethod = paymentMethod;

        if (!document.getElementById('expenseDate').value){
            let todayDate = new Date();
            newExpense.expenseDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
        } else {
            newExpense.expenseDate = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), expenseDate.getDate());
        }

        let timeBucket = {
            year: newExpense.expenseDate.getFullYear(), 
            month: newExpense.expenseDate.getMonth(),
            day: newExpense.expenseDate.getDate(),
            hour: newExpense.expenseDate.getHours()
        };

        newExpense.timeBucket = timeBucket;

        let newExpenseId = Maestro.Expenses.CreateNewExpense(newExpense);

        if(!!newExpenseId){
            Materialize.toast("Created a new expense", 4000);
            document.getElementById('enterExpenseInfo').reset();
            paymentMethod = null;
        }

        // Meteor.call("createNewExpense", newExpense, function(error, result) {
        //     if(error) {
        //         console.log(error);
        //     } else {
        //         Materialize.toast("Created a new expense", 4000);
        //         document.getElementById('enterExpenseInfo').reset();
        //         paymentMethod = null;
        //     }
        // });
	},

	'click #cancelCreateExpense': function(event, target){
		document.getElementById('enterExpenseInfo').reset();
        window.history.back();
		
	}

});