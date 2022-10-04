Maestro.Templates.AccountingMain = "AccountingMain";

const DAILY = 'daily', WEEKLY = 'weekly', MONTHLY = 'monthly';

Template.AccountingMain.onCreated(function(){
    let template = this;

    template.startDateReact = new ReactiveVar();
    template.nextPeriod;

    template.accountingData = new ReactiveVar();
    template.accountingData.set({});

    template.allLocationsMode = new ReactiveVar();
    template.allLocationsMode.set(false);

    template.showDataTable = new ReactiveVar();
    template.showDataTable.set(false);

    template.showOrdersLimit = new ReactiveVar();
    template.showOrdersLimit.set(100);

    template.showOrdersIncremment = 100;


    template.initializeMonthlyView = function(){
        var monthlyDate = new Date();

        monthlyDate = new Date(monthlyDate.getFullYear(), monthlyDate.getMonth(), monthlyDate.getDate());
        monthlyDate.setDate(1);

        template.startDateReact.set(monthlyDate);

        template.nextPeriod = new Date(monthlyDate);
        template.nextPeriod.setMonth(template.nextPeriod.getMonth()+1);
        template.nextPeriod.setDate(template.nextPeriod.getDate()-1);
    };

    template.getDashboardSummary = function (startDate, endDate){
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

        let filterCriteria = 
        {
            businessId: Maestro.Business.getBusinessId(),
            fromDate: startDate,
            toDate: endDate,
            fromDateTimeBucket: fromDateTimeBucket,
            toDateTimeBucket: toDateTimeBucket
        };

        if(template.allLocationsMode.get() === false) {
            filterCriteria.locationId = Maestro.Business.getLocationId();
        }

        Maestro.Atlas.Accounting.getAccountingData.call(filterCriteria,
            (error, result) => {
                if(error) {
                    console.log("Error: ", error);
                }

                // console.log("DASHBOARD SUMMARY:: ", result);
                // console.log(result);
                template.accountingData.set(result);
            }
        );

        // console.log('template.accountingData: ', template.accountingData.get());
    };

    template.refreshDashboard = function(){
        template.accountingData.set({});
        template.getDashboardSummary(template.startDateReact.get(), template.nextPeriod);
        template.showOrdersLimit.set(100);
        template.showDataTable.set(false);
        // document.getElementById('message-BePatient').style.visibility = "hidden";
    };


    template.convertArrayOfObjectsToCSV = function(args) {  
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    };

    template.generateOrderDownloadData = function(){
        let rawData = template.accountingData.get().orders;

        let downloadableData = _.map(rawData, function(rawOrder){
            let cleansedOrder = {
                date: String(rawOrder.month+1) + "/" + rawOrder.day + "/" + rawOrder.year,
                orderNum: rawOrder.uniqueOrderNumber,
                // gst: rawOrder.subtotals.taxComponents.gst,
                // hst: rawOrder.subtotals.taxComponents.hst,
                // total: rawOrder.subtotals.total,
            };

            if(template.allLocationsMode.get() == true ){
                _.each(Maestro.Tax.GetTaxComponentKeysForAllLocations(), function(taxComponent){
                    cleansedOrder[taxComponent.label] = rawOrder.subtotals.taxComponents[taxComponent.key];
                });
            } else {
                _.each(Maestro.Tax.GetTaxComponentKeysForLocation(), function(taxComponent){
                    cleansedOrder[taxComponent.label] = rawOrder.subtotals.taxComponents[taxComponent.key];
                });   
            }

            cleansedOrder.total = rawOrder.subtotals.total;

            if(rawOrder.payment.method =="cash"){
                cleansedOrder.cashReceived = rawOrder.payment.received;
                cleansedOrder.cardReceived = 0.00;
            } else if (rawOrder.payment.method == "card"){
                cleansedOrder.cashReceived = 0.00;
                cleansedOrder.cardReceived = rawOrder.payment.received;
            }

            cleansedOrder.giftCardPayment = rawOrder.payment.giftCardTotal || 0.00;

            cleansedOrder.status = rawOrder.status;

            if(template.multipleLocationBusiness()){
                cleansedOrder.location = Locations.findOne({_id: rawOrder.locationId}).name;
            }

            return cleansedOrder;
        });

        // console.log(downloadableData);

        return downloadableData;
    };


    template.generateDailyTotalsDownloadData = function(){
        let allOrders = template.generateOrderDownloadData();

        allOrders = _.filter(allOrders, function(order){
            return order.status == "Completed";
        });

        // console.log(allOrders);

        let dailyTotals = [];

        let allUniqueDates = _.uniq(_.pluck(allOrders, 'date'));

        _.each(allUniqueDates, function(thisDate){

            let thisDayOrders = _.filter(allOrders, function(order){
                return order.date === thisDate;
            });

            let dayTotal = {};

            dayTotal.date = thisDate;

            if(template.allLocationsMode.get() == true ){
                _.each(Maestro.Tax.GetTaxComponentKeysForAllLocations(), function(taxComponent){
                    dayTotal[taxComponent.label] = _.reduce(thisDayOrders, function(memo, order){
                        return memo + order[taxComponent.label];
                    }, 0);
                });
            } else {
                _.each(Maestro.Tax.GetTaxComponentKeysForLocation(), function(taxComponent){
                    dayTotal[taxComponent.label] = _.reduce(thisDayOrders, function(memo, order){
                        return memo + order[taxComponent.label];
                    }, 0);
                });   
            }

            dayTotal.total = _.reduce(thisDayOrders, function(memo, order){
                return memo + order.total;
            }, 0);

            dayTotal.cashReceived = _.reduce(thisDayOrders, function(memo, order){
                return memo + order.cashReceived;
            }, 0);

            dayTotal.cardReceived = _.reduce(thisDayOrders, function(memo, order){
                return memo + order.cardReceived;
            }, 0);


            dayTotal.giftCardPayment = _.reduce(thisDayOrders, function(memo, order){
                return memo + order.giftCardPayment;
            }, 0);

            dayTotal.total -= dayTotal.giftCardPayment; // need to take out gift card payments from total, since the totals already accounted for gift cards at time of purchase.

            dailyTotals.push(dayTotal);

        });

        // console.log(dailyTotals);

        return dailyTotals;
    };



    template.downloadCSV = function() {  
        var data, filename, link;
        var csv = template.convertArrayOfObjectsToCSV({
            data: template.generateOrderDownloadData()
        });

        if (csv == null) return;

        filename = 'ORDERS-' + template.selectedMonthlyLabel() + '-' + template.locationName() + '-export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    };

    template.generateExpensesDownloadData = function(){
        let rawData = Maestro.Expenses.Summary.AllExpensesForMonth(template.startDateReact.get());
        let downloadableData = _.map(rawData, function(rawExpense){
            let cleansedExpense = {
                date: (rawExpense.timeBucket.month + 1) + "/" + rawExpense.timeBucket.day + "/" + rawExpense.timeBucket.year,
                category: rawExpense.category,
                vendor: rawExpense.vendor,
                details: rawExpense.details,
                totalAmount: rawExpense.amount,
                tax: rawExpense.tax,
                paymentMethod: rawExpense.paymentMethod
            };  

            return cleansedExpense;
        });

        // console.log(downloadableData);

        return downloadableData;
    };

    template.downloadDailyTotalsCSV = function(){
        var data, filename, link;
        var csv = template.convertArrayOfObjectsToCSV({
            data: template.generateDailyTotalsDownloadData()
        });

        if (csv == null) return;

        filename = 'DailyTotals-' + template.selectedMonthlyLabel() + '-' + template.locationName() + '-export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    };

    template.downloadExpensesCSV = function(){
        var data, filename, link;
        var csv = template.convertArrayOfObjectsToCSV({
            data: template.generateExpensesDownloadData()
        });

        if (csv == null) return;

        filename = "EXPENSES-" + template.selectedMonthlyLabel() + '-' + template.locationName() + '-export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    };

    template.generateLoyaltyCardsDownloadData = function(){
        let rawData = Maestro.LoyaltyCards.Summary.GetAllLoyaltyAndTallyCards();

        let downloadableData = _.map(rawData, function(rawCard){
            let cleansedCards = {
                boughtOn: (new Date(rawCard.boughtOn)).toLocaleDateString(),
                program: String(Maestro.Loyalty.GetProgramName(rawCard.programId)).replace(","," "),
                customer: String(Maestro.Customers.GetName(rawCard.customerId)).replace(","," "),
                updatedOn: rawCard.updatedOn ? new Date(rawCard.updatedOn).toLocaleDateString() : "N/A",
                programType: rawCard.programType,
                remainingQuantity: rawCard.programType == "Quantity" ? rawCard.remainingQuantity : "",
                remainingAmount: rawCard.programType == "Amount" ? rawCard.remainingAmount  : "",
                creditPercent: rawCard.programType == "Percentage" ? rawCard.creditPercent  : "",
                tally: rawCard.tally,
                expired: rawCard.expired ? "Expired" : "Active",
            };  

            return cleansedCards;
        });

        // console.log(downloadableData);

        return downloadableData;
    };

    template.downloadLoyaltyCardsCSV = function(){
        var data, filename, link;
        var csv = template.convertArrayOfObjectsToCSV({
            data: template.generateLoyaltyCardsDownloadData()
        });

        if (csv == null) return;

        filename = "LoyaltyCards-as-of-" + template.selectedMonthlyLabel() + "-export.csv";

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    };


    template.generateCustomersDownloadData = function(){
        let rawData = Maestro.Customers.SearchCustomerNames("", true);

        let downloadableData = _.map(rawData, function(rawCustomer){
            let cleansedCustomers = {
                name: String(rawCustomer.name).replace(",", ""),
                email: String(rawCustomer.email || "Not Given").replace(",",""),
                phone: String(rawCustomer.phone || "Not Given").replace(",",""),
            };  

            return cleansedCustomers;
        });

        // console.log(downloadableData);

        return downloadableData;
    };

    template.downloadCustomersCSV = function(){
        var data, filename, link;
        var csv = template.convertArrayOfObjectsToCSV({
            data: template.generateCustomersDownloadData()
        });

        if (csv == null) return;

        filename = "Customers-as-of" + template.selectedMonthlyLabel() + "-export.csv";

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    };

    template.generateTimeEntriesDownloadData = function(){
        let rawData = Maestro.Client.getAllEmployeeTimeEntriesForMonth(template.startDateReact.get());

        let downloadableData = _.map(rawData, function(rawEntry){
            let cleansedEntry = {
                date: String(rawEntry.date.getMonth() + 1) + "/" + rawEntry.date.getDate() + "/" + rawEntry.date.getFullYear(),
                name: rawEntry.employeeName,
            };  

            if(rawEntry.clockIn){
                cleansedEntry.clockIn = rawEntry.clockIn.getHours() + ":" + rawEntry.clockIn.getMinutes();
            } else {
                cleansedEntry.clockIn = "N/A";
            }
                
            if(rawEntry.clockOut){
                cleansedEntry.clockOut = rawEntry.clockOut.getHours() + ":" + rawEntry.clockOut.getMinutes();
            } else {
                cleansedEntry.clockOut = "N/A";
            }

            cleansedEntry.hours = rawEntry.hours || 0;
            cleansedEntry.pay = rawEntry.pay || 0;
                
            return cleansedEntry;
        });

        // console.log(downloadableData);

        return downloadableData;
    };

    template.downloadTimeEntriesCSV = function(){
        var data, filename, link;
        var csv = template.convertArrayOfObjectsToCSV({
            data: template.generateTimeEntriesDownloadData()
        });

        if (csv == null) return;

        filename = "TIMEENTRIES-" + template.selectedMonthlyLabel() + '-' + template.locationName() + '-export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    };

    template.selectedMonthlyLabel = function(){    
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

        monthlyDate = new Date(template.startDateReact.get());

        var labelString = months[monthlyDate.getMonth()];

        return labelString;
    };

    template.locationName = function(){
        if (template.allLocationsMode.get()){
            return "All Locations";
        } else {
            return Maestro.Business.getLocationName();
        }
    };

    template.multipleLocationBusiness = function(){
        if(Locations.find({}).fetch().length>1){
            return true;
        }
        return false;
    };

    template.initializeMonthlyView();

    this.autorun(function(){
        let businessId = UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID);
        let refDate = new Date(template.startDateReact.get());
        let timeBucket = {year: refDate.getFullYear(), month: refDate.getMonth(), day: refDate.getDate()};
        Template.instance().subscribe('expenses-monthly', businessId, timeBucket);
    });

});

Template.AccountingMain.onRendered(function(){
    let template = this;
    
    template.refreshDashboard();
    
    // $('.datepicker').pickadate({
    //     selectMonths: true, // Creates a dropdown to control month
    //     selectYears: 15 // Creates a dropdown of 15 years to control year
    // });
});

Template.AccountingMain.helpers({
    isDashboardReady: function(){
        let dashboard = Template.instance().accountingData.get();

        if(!!dashboard && Template.instance().subscriptionsReady()){
            if(!!dashboard.processedAt){
                return true;
            }
        }
        return false;
    },

    getSelectedMonthlyDate : function(){ 
        return Template.instance().selectedMonthlyLabel();
    },

    getAccountingOrders: function(){
        let allOrders = Template.instance().generateOrderDownloadData();

        return allOrders.slice(Template.instance().showOrdersLimit.get() - Template.instance().showOrdersIncremment, Template.instance().showOrdersLimit.get());
    },

    getAccountingOrdersCount: function(){
        return Template.instance().generateOrderDownloadData().length;
    },

    getAccountingDailyTotalsCount: function(){
        return Template.instance().generateDailyTotalsDownloadData().length;
    },

    formatCurrency: function(amount){
        return "$" + amount.toFixed(2);
    },

    formatQuantity: function(quantity){
        return "x" + quantity;
    },

    moreThanOneLocation: function(){
        return Template.instance().multipleLocationBusiness();
    },

    inAllLocationsMode: function(){
        return Template.instance().allLocationsMode.get();
    },

    ordersAvailableForMonth: function(){
        if(Template.instance().accountingData.get().orders.length){
            return true;
        }
        return false;
    },

    expensesAvailableForMonth: function(){
        let monthlyExpenses = Maestro.Expenses.Summary.AllExpensesForMonth(Template.instance().startDateReact.get());
        if(monthlyExpenses.length > 0){
            return true;
        }
        return false;
    },

    getAccountingExpensesCount: function(){
        let monthlyExpenses = Maestro.Expenses.Summary.AllExpensesForMonth(Template.instance().startDateReact.get()) || [];
        return monthlyExpenses.length;
    },

    timeEntriesAvailableForMonth: function(){
        let entries = Maestro.Client.getAllEmployeeTimeEntriesForMonth(Template.instance().startDateReact.get()) || [];
        if (entries.length > 0){
            return true;
        }
        return false;
    },

    getAccountingTimeSheetCount: function(){
        let entries = Maestro.Client.getAllEmployeeTimeEntriesForMonth(Template.instance().startDateReact.get()) || [];
        return entries.length;
    },

    loyaltyCardsAvailableForMonth: function(){
        let cards = Maestro.LoyaltyCards.Summary.GetAllLoyaltyAndTallyCards() || [];
        if (cards.length > 0){
            return true;
        }
        return false;
    },

    getAccountingLoyaltyCardsCount: function(){
        let cards = Maestro.LoyaltyCards.Summary.GetAllLoyaltyAndTallyCards() || [];
        return cards.length;
    },

    customersAvailableForMonth: function(){
        let cards = Maestro.Customers.SearchCustomerNames("", true) || [];
        if (cards.length > 0){
            return true;
        }
        return false;
    },

    getAccountingCustomersCount: function(){
        let cards = Maestro.Customers.SearchCustomerNames("", true) || [];
        return cards.length;
    },

    renderDataTable: function(){
        return Template.instance().showDataTable.get();
    },

    getShowOrdersIncrement: function(){
        return Template.instance().showOrdersIncremment;
    },

    getShowOrdersRange: function(){
        if(Template.instance().showOrdersLimit.get()<Template.instance().generateOrderDownloadData().length){
            return "" + (Template.instance().showOrdersLimit.get() - Template.instance().showOrdersIncremment) + " - " + Template.instance().showOrdersLimit.get();
        } else {
            return "" + (Template.instance().showOrdersLimit.get() - Template.instance().showOrdersIncremment) + " - " + Template.instance().generateOrderDownloadData().length;
        }
    },

    getLocationName: function(){
        return Template.instance().locationName();
    },

});

Template.AccountingMain.events({
    'click .toggleAllLocationMode': function(event, template){
        if(template.allLocationsMode.get() === false){
            template.allLocationsMode.set(true);
        } else {
            template.allLocationsMode.set(false);
        }
        template.refreshDashboard();
    },

    'click #showHideTable': function(event, template){
        // document.getElementById('message-BePatient').style.visibility = "visible";
        $( document ).ready(function() {
            if(template.showDataTable.get()){
                template.showDataTable.set(false);
            } else {
                template.showDataTable.set(true);
            }
        });
    },

    'click #increaseShowOrdersLimit': function(event, template){
        if(template.showOrdersLimit.get() < template.generateOrderDownloadData().length){
            template.showOrdersLimit.set(template.showOrdersLimit.get() + template.showOrdersIncremment);
        }
    },

    'click #decreaseShowOrdersLimit': function(event, template){
        template.showOrdersLimit.set( template.showOrdersLimit.get() - template.showOrdersIncremment);
        if (template.showOrdersLimit.get() < template.showOrdersIncremment){
            template.showOrdersLimit.set(template.showOrdersIncremment);
        }
    }, 

    'click #nextPeriod': function(event, template){

        let monthlyDate = new Date(template.startDateReact.get());

        monthlyDate.setMonth(monthlyDate.getMonth()+1);
        
        template.nextPeriod = new Date(monthlyDate);
        template.nextPeriod.setMonth(template.nextPeriod.getMonth()+1);
        template.nextPeriod.setDate(template.nextPeriod.getDate()-1);

        template.startDateReact.set(monthlyDate);

        template.accountingData.set({});
        template.getDashboardSummary(template.startDateReact.get(), template.nextPeriod);
        template.showDataTable.set(false);
    },

    'click #previousPeriod': function(event, template){

        let monthlyDate = new Date(template.startDateReact.get());

        monthlyDate.setMonth(monthlyDate.getMonth()-1);
        
        template.nextPeriod = new Date(monthlyDate);
        template.nextPeriod.setMonth(template.nextPeriod.getMonth()+1);
        template.nextPeriod.setDate(template.nextPeriod.getDate()-1);
        
        template.startDateReact.set(monthlyDate);

        template.accountingData.set({});
        template.getDashboardSummary(template.startDateReact.get(), template.nextPeriod);
        template.showDataTable.set(false);
    },

    'click .forceRefresh': function(event, template){
        template.refreshDashboard();
    },

    'click #downloadOrdersCSV': function(event, template){
        template.downloadCSV();
    },

    'click #downloadDailyTotalsCSV': function(event, template){
        template.downloadDailyTotalsCSV();
    },

    'click #downloadExpensesCSV': function(event ,template){
        template.downloadExpensesCSV();
    },

    'click #downloadTimeEntriesCSV': function(event, template){
        template.downloadTimeEntriesCSV();
    },

    'click #downloadLoyaltyCardsCSV': function(event, template){
        template.downloadLoyaltyCardsCSV();
    },

    'click #downloadCustomersCSV': function(event, template){
        template.downloadCustomersCSV();
    }

});