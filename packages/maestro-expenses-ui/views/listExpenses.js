Maestro.Templates.ListExpenses = "ListExpenses";

Template.ListExpenses.onCreated(function(){
	let template = this;

	template.dateToday = new Date();
	template.currentMonthStart = new Date(template.dateToday.getFullYear(), template.dateToday.getMonth(), 1);
	template.currentMonthEnd = new Date(template.currentMonthStart);
	template.currentMonthEnd.setMonth(template.currentMonthStart.getMonth() + 1);
	template.currentMonthEnd.setDate(template.currentMonthEnd.getDate()-1);

	template.filterStartDate = new ReactiveVar();
	template.filterStartDate.set(template.currentMonthStart);

	template.filterEndDate = new ReactiveVar();
	template.filterEndDate.set(template.currentMonthEnd);

	template.totalAllTaxes = new ReactiveVar();
	template.totalAllAmounts = new ReactiveVar();

	template.displayMode = new ReactiveVar();
	template.displayMode.set('SUMMARY');

	template.dashboardSummary = new ReactiveVar();
	template.dashboardSummary.set({});

	template.getDashboardSummary = function (refDate){
		let startDate = new Date(refDate);
		startDate.setDate(1);

		let endDate = new Date(startDate);
		endDate.setMonth(startDate.getMonth()+1);
		endDate.setDate(endDate.getDate()-1);

	    let fromDateTimeBucket= {
	        year: startDate.getFullYear(),
	        month: startDate.getMonth(),
	        date: startDate.getDate(),
	        hour: startDate.getHours()
	    };

	    let toDateTimeBucket= {
	        year: endDate.getFullYear(),
	        month: endDate.getMonth(),
	        date: endDate.getDate(),
	        hour: 23
	    };    

	    Maestro.Atlas.Dashboard.getDashboardSummary.call(
	        {
	            businessId: Maestro.Business.getBusinessId(),
	            fromDate: startDate,
	            toDate: endDate,
	            fromDateTimeBucket: fromDateTimeBucket,
	            toDateTimeBucket: toDateTimeBucket
	        },
	        (error, result) => {
	            if(error) {
	                console.log("Error: ", error);
	            }

	            // console.log("DASHBOARD SUMMARY:: ", result);
	            template.dashboardSummary.set(result);
	        }
	    );

	    // console.log('template.dashboardSummary: ', template.dashboardSummary.get());
	};

	this.autorun(function(){
        let businessId = UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID);
        let refDate = new Date(template.filterStartDate.get());
        let timeBucket = {year: refDate.getFullYear(), month: refDate.getMonth(), day: refDate.getDate()};
        Template.instance().subscribe('expenses-monthly', businessId, timeBucket);
    });
});

Template.ListExpenses.onRendered(function(){
	let template = this;

	$('ul.tabs').tabs();
	$('ul.tabs').tabs('select_tab', 'summaryView');

	$('.collapsible').collapsible({
    	accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });

	template.getDashboardSummary(template.filterStartDate.get());
});

Template.ListExpenses.helpers({
	isSummaryView: function(){
		if(Template.instance().displayMode.get() == "SUMMARY"){
			return true;
		}
		return false;
	},

	isListView: function(){
		if(Template.instance().displayMode.get() == "LIST"){
			return true;
		}
		return false;
	},

	getStartDate: function(){
		var getDate = Template.instance().currentMonthStart.get();
		return getDate.toLocaleDateString();
	},

	getEndDate: function(){
		var getDate = Template.instance().currentMonthEnd.get();
		return getDate.toLocaleDateString();
	},

	// listExpenses: function(){
	// 	var startDate = new Date(Template.instance().filterStartDate.get());
	// 	var endDate = new Date(Template.instance().filterEndDate.get());

	// 	if((startDate<=new Date(0)) && (endDate<=new Date(0))){
	// 		return Expenses.find({},{sort: {expenseDate:1}});
	// 	} else if (startDate<=new Date(0)){
	// 		return Expenses.find({expenseDate: {$lte:endDate}},{sort: {expenseDate:1}});
	// 	} else if (endDate<=new Date(0)){
	// 		return Expenses.find({expenseDate: {$gte:startDate}},{sort: {expenseDate:1}});	
	// 	} else {
	// 		return Expenses.find({expenseDate: {$gte:startDate, $lte:endDate}},{sort: {expenseDate:1}});
	// 	}

	// }, 

	listExpenses: function(){
		let refDate = new Date(Template.instance().filterStartDate.get());
		return Expenses.find({'timeBucket.year': refDate.getFullYear(), 'timeBucket.month': refDate.getMonth()}, {sort: {expenseDate:1}})
	}, 


    listExpensesByCategory: function(category){
    	let refDate = new Date(Template.instance().filterStartDate.get());
		return Expenses.find({'timeBucket.year': refDate.getFullYear(), 'timeBucket.month': refDate.getMonth(), category: category}, {sort: {expenseDate:1}})
    },

	formatDate: function(expenseDate){
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		return expenseDate.getDate() + " - " + months[expenseDate.getMonth()] + " - " + expenseDate.getFullYear();
	},

	isTaxableFormat: function(isTaxable){
		if(isTaxable){
			return 'check';
		}
	},

	displayMonth: function(){
		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		return months[Template.instance().filterStartDate.get().getMonth()];
	},

	formatTax: function(tax){
		return "$" + tax.toFixed(2);
	},

	formatTotal: function(total){
		return "$" + total.toFixed(2);
	},

	getPaymentMethodIcon: function(method){
        if(method == "out-of-pocket"){
            return "account_circle";
        } else if (method == "out-of-register"){
            return "local_atm";
        } else if (method == "card"){
            return "credit_card";
        } else if (method == "invoiced"){
            return "description";
        }
    },

    getCategoryLabel: function(key){
        return Maestro.Expenses.Categories.Canada.get(key, 'label', key);
    },

    getExpenseSummary: function(){
    	return Maestro.Expenses.Summary.MonthlyCategories(Template.instance().filterStartDate.get());
    },

    getPercentageOfNetSales: function(amount){
    	let monthTotal = Maestro.Atlas.Aggregate.TotalNetSales(Template.instance().dashboardSummary.get().orders);
    	
    	if(monthTotal > 0.00){
    		return (amount / monthTotal * 100).toFixed(1) + " %";
    	} else {
    		return 'N/A';
    	}
    }
});

Template.ListExpenses.events({
	'click .setSummaryView': function(event, template){
		template.displayMode.set('SUMMARY');
		$('ul.tabs').tabs('select_tab', 'summaryView');

	},

	'click .setListView': function(event, template){
		template.displayMode.set('LIST');
		$('ul.tabs').tabs('select_tab', 'listView');
	},

	'click #refreshFilterDates': function(event, template){
		if(document.getElementById('expenseDateStart').value){
			template.filterStartDate.set(new Date(document.getElementById('expenseDateStart').value));
		} else {
			template.filterStartDate.set(0);
		}
		
		if(document.getElementById('expenseDateEnd').value){	
			template.filterEndDate.set(new Date(document.getElementById('expenseDateEnd').value));
		} else {
			template.filterEndDate.set(0);
		}
	},

	'click .removeThisExpense': function(event, template){
		var element = event.target;
		var expenseId = element.dataset.id;

		Maestro.Expenses.RemoveExpense(expenseId);
	},

	'click .previousMonth': function(event, template){
		let refDate = new Date(template.filterStartDate.get());

		refDate.setMonth(refDate.getMonth()-1);

		template.filterStartDate.set(refDate);
		template.getDashboardSummary(refDate);
	},

	'click .nextMonth': function(event, template){
		let refDate = new Date(template.filterStartDate.get());

		refDate.setMonth(refDate.getMonth()+1);

		template.filterStartDate.set(refDate);
		template.getDashboardSummary(refDate);
	}

	
});