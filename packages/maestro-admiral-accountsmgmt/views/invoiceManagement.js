Maestro.Templates.InvoiceManagement = "InvoiceManagement";

var selectedBusiness = new ReactiveVar();
var selectedLocation = new ReactiveVar();

var locationSales = [];

var draftInvoice = new ReactiveVar();
draftInvoice.set(null);

const DAILY = 'daily', WEEKLY = 'weekly', MONTHLY = 'monthly';

var dashboardMode = new ReactiveVar();

var startDateReact = new ReactiveVar();
var nextPeriod;

var dashboardSummary = new ReactiveVar();
dashboardSummary.set({});

var dashboardTables = new ReactiveVar();
dashboardTables.set({});

var customerTables = new ReactiveVar();
customerTables.set({});

var manualAdjustments = [];

var pricingPlanType = new ReactiveVar();


var initializeMonthlyView = function(){
    dashboardMode.set(MONTHLY);
    
    var monthlyDate = new Date();

    monthlyDate = new Date(monthlyDate.getFullYear(), monthlyDate.getMonth(), monthlyDate.getDate());
    monthlyDate.setDate(1);

    startDateReact.set(monthlyDate);

    nextPeriod = new Date(monthlyDate);
    nextPeriod.setMonth(nextPeriod.getMonth()+1);
    nextPeriod.setDate(nextPeriod.getDate()-1);
};

var getDashboardSummary = function (startDate, endDate){
    if(!selectedBusiness.get()){
        return;
    }

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
            businessId: selectedBusiness.get(),
            locationId: selectedLocation.get(),
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
            dashboardSummary.set(result);
        }
    );

    // console.log('dashboardSummary: ', dashboardSummary.get());
};

var refreshDashboard = function(){
    manualAdjustments = [];
    dashboardSummary.set({});
    getDashboardSummary(startDateReact.get(), nextPeriod);
};

var calculateSalesBasedPricing = function(sales){
    // if(sales < 5000){
    //     return 0.00;
    // } else 
    if (sales < 40000){
        return sales*0.0025;
    } else if (sales < 80000){
        return sales*0.0015 + 40;
    } else if (sales < 120000){
        return sales*0.00125 + 60;
    } else {
        return sales*0.00125 + 60;
    }
};

var roundToTwoDecimals = function(number){
    return Math.round(number*100)/100;
}

var generateInvoiceDraft = function(){
    let invoiceDate = new Date(startDateReact.get());
    let totalSales = roundToTwoDecimals(Maestro.Atlas.Aggregate.TotalSales(dashboardSummary.get().orders));
    let totalOrders = Maestro.Atlas.Aggregate.TotalOrderCount(dashboardSummary.get().orders);

    let invoice = {
        businessId: selectedBusiness.get(),
        billingYear: invoiceDate.getFullYear(),
        billingMonth: invoiceDate.getMonth(),
        status: 'Invoiced',
        sales: totalSales,
        orders: totalOrders,
        paymentDueDate: new Date(invoiceDate.getFullYear(), invoiceDate.getMonth()+1, 15)
    };

    let lineItems = [];

    invoice.pricingPlanType = pricingPlanType.get();
    if(pricingPlanType.get() == "SALES_BASED_PRICE"){
        lineItems.push({
            description: 'Billing For Monthly Total Sales',
            amount: roundToTwoDecimals(calculateSalesBasedPricing(totalSales))
        });

        _.each(manualAdjustments, function(adjustment){
            lineItems.push(adjustment);
        });

        let paymentDue = _.reduce(lineItems, function(memo, item){return memo + item.amount;}, 0.00);

        lineItems.push({
            description: 'Ontario Sales Tax (HST)',
            amount: roundToTwoDecimals(paymentDue*0.13)
        });
    } else if(pricingPlanType.get() =="LOCATION_BASED_PRICE"){
        //for now just do manual line entry until the pricing is stabilized
        _.each(manualAdjustments, function(adjustment){
            lineItems.push(adjustment);
        });
    }

    paymentDue = roundToTwoDecimals(_.reduce(lineItems, function(memo, item){return memo + item.amount;}, 0.00));

    invoice.lineItems = lineItems;
    invoice.paymentDue = paymentDue;

    draftInvoice.set(invoice);
};

var createOrUpdateInvoice = function(){
    let invoiceDate = new Date(startDateReact.get());
    let existingInvoice = Invoices.findOne({businessId: selectedBusiness.get(), billingYear: invoiceDate.getFullYear(), billingMonth: invoiceDate.getMonth()});

    if(!!existingInvoice){
        Invoices.update({_id:existingInvoice._id}, {$set:draftInvoice.get()});
    } else {
        Invoices.insert(draftInvoice.get());
    }
};

Template.InvoiceManagement.onCreated(function(){
    initializeMonthlyView();
    
    Template.instance().subscribe('admiral-business-cores');
    Template.instance().subscribe('admiral-invoices');

    this.autorun(function () {
        let dashboard = dashboardSummary.get();

        if(!!dashboard){
            if(!!dashboard.processedAt){
                generateInvoiceDraft();
            }
        }

    });

});

Template.InvoiceManagement.onRendered(function(){
    refreshDashboard();

    $('.collapsible').collapsible({
        accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
    
    // $('.datepicker').pickadate({
    //     selectMonths: true, // Creates a dropdown to control month
    //     selectYears: 15 // Creates a dropdown of 15 years to control year
    // });

    manualAdjustments = [];
    pricingPlanType.set("LOCATION_BASED_PRICE");
});

Template.InvoiceManagement.helpers({
    getAllBusinesses: function(){
        return Businesses.find({});
    },

    isBusinessSelected: function(){
        if (!!selectedBusiness.get()){
            return true;
        }
        return false;
    },

    getSelectedBusinessInfo: function(){
        if(!!selectedBusiness.get()){
            return Businesses.findOne({_id: selectedBusiness.get()});
        }
    },

    getBusinessInfo: function(businessId){
        return Businesses.findOne({_id: businessId});
    },

    isDashboardReady: function(){
        let dashboard = dashboardSummary.get();

        if(!!dashboard && !!selectedLocation.get()){
            if(!!dashboard.processedAt){
                return true;
            }
        }
        return false;
    },

    isTaxComponentsZero: function(){
        dailyDate = new Date(startDateReact.get());
        let gst = Maestro.Atlas.Aggregate.GSTTaxes(dashboardSummary.get().orders).toFixed(2);
        let hst = Maestro.Atlas.Aggregate.HSTTaxes(dashboardSummary.get().orders).toFixed(2);

        if (gst == 0 && hst ==0){
            return true;
        }
    },

    getOrdersTally : function(){
        dailyDate = new Date(startDateReact.get());
        return Maestro.Atlas.Aggregate.TotalOrderCount(dashboardSummary.get().orders);
    },

    getSalesTally : function(){
        dailyDate = new Date(startDateReact.get());
        return Maestro.Atlas.Aggregate.TotalSales(dashboardSummary.get().orders).toFixed(2);
    },

    getNetSalesTally : function(){
        dailyDate = new Date(startDateReact.get());
        return Maestro.Atlas.Aggregate.TotalNetSales(dashboardSummary.get().orders).toFixed(2);
    },

    getTaxesTotal: function(){
        dailyDate = new Date(startDateReact.get());
        return Maestro.Atlas.Aggregate.TotalTaxes(dashboardSummary.get().orders).toFixed(2);
    },

    getGSTTaxes : function(){
        dailyDate = new Date(startDateReact.get());
        return Maestro.Atlas.Aggregate.GSTTaxes(dashboardSummary.get().orders).toFixed(2);
    },

    getHSTTaxes : function(){
        dailyDate = new Date(startDateReact.get());
        return Maestro.Atlas.Aggregate.HSTTaxes(dashboardSummary.get().orders).toFixed(2);
    },

    getSelectedMonthlyDate : function(){ 
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

        monthlyDate = new Date(startDateReact.get());

        var labelString = months[monthlyDate.getMonth()];

        return labelString;
    },

    getMonthName: function(monthNum){
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[monthNum];
    },

    formatCurrency: function(amount){
        return "$" + amount.toFixed(2);
    },

    formatQuantity: function(quantity){
        return "x" + quantity;
    },

    formatDate: function(dateObj){
        return dateObj.toDateString();
    },

    refreshGraph: function(){
        if(UserSession.get(Maestro.UserSessionConstants.LOCATION_ID) && dashboardSummary.get()){
            if(document.getElementById('barChart')){
                getBarChart('barChart');
            }
            dashboardTables.set(Maestro.Atlas.Aggregate.ParseItemsTable(dashboardSummary.get().products));
            customerTables.set(Maestro.Atlas.Aggregate.CustomersTable(dashboardSummary.get().customers));
        }
        initializeReportTabs();
    },

    getDraftInvoice: function(){
        return draftInvoice.get();
    },

    getAllInvoices: function(){
        // console.log(Invoices.find({businessId: selectedBusiness.get()}, {sort: {billingYear:1, billingMonth:1}}).fetch());
        return Invoices.find({businessId: selectedBusiness.get()}, {sort: {billingYear:1, billingMonth:1}}).fetch();
    },

    isPricingLocationBased: function(){
        if(pricingPlanType.get() == "LOCATION_BASED_PRICE"){
            return true;
        }
        return false;
    },

    isPricingSalesBased: function(){
        if(pricingPlanType.get() == "SALES_BASED_PRICE"){
            return true;
        }
        return false;
    },

    getAllLocationNames: function(){
        return Locations.find({businessId: selectedBusiness.get()}).fetch();
    },

    thisInvoicePricingBySales: function(pricingPlanType){
        return pricingPlanType == "SALES_BASED_PRICE";
    },

    thisInvoicePricingByLocation: function(pricingPlanType){
        return pricingPlanType == "LOCATION_BASED_PRICE";
    }

});

Template.InvoiceManagement.events({
    'click .selectBusiness': function(event, target){
        selectedBusiness.set(this._id);
        refreshDashboard();
    },

    'click #nextPeriod': function(event, target){
        let monthlyDate = new Date(startDateReact.get());

        monthlyDate.setMonth(monthlyDate.getMonth()+1);
        
        nextPeriod = new Date(monthlyDate);
        nextPeriod.setMonth(nextPeriod.getMonth()+1);
        nextPeriod.setDate(nextPeriod.getDate()-1);

        startDateReact.set(monthlyDate);

        refreshDashboard();
        
    },

    'click #previousPeriod': function(event, target){

        let monthlyDate = new Date(startDateReact.get());

        monthlyDate.setMonth(monthlyDate.getMonth()-1);
        
        nextPeriod = new Date(monthlyDate);
        nextPeriod.setMonth(nextPeriod.getMonth()+1);
        nextPeriod.setDate(nextPeriod.getDate()-1);
        
        startDateReact.set(monthlyDate);

        refreshDashboard();
        
    },

    'click .forceRefresh': function(event, target){
        refreshDashboard();
    },

    'click .addManualAdjustment': function(event, target){
        let description = target.find('#adjustmentDescription').value;
        let amount = Number(target.find('#adjustmentAmount').value);

        manualAdjustments.push({
            description: description,
            amount: roundToTwoDecimals(amount)
        });

        generateInvoiceDraft();

        document.getElementById('manualAdjustment').reset();
    },

    'click .createInvoice': function(event, target){
        createOrUpdateInvoice();
        Materialize.toast("Invoice Created", 1000, "rounded green");
    },  

    'click .thisInvoicePaid': function(event, target){
        let invoiceId = this._id;

        Invoices.update({_id: invoiceId}, {$set: {status: 'Paid'}});
    },

    'click .deleteThisInvoice': function(event, target){
        let invoiceId = this._id;

        Invoices.remove({_id: invoiceId});
    },

    'click .emailReminder': function(event, target){
        let invoiceId = this._id;
        Maestro.Invoices.Reminders.Send(invoiceId);
    },

    'click .setPricingPlanToLocationBased': function(event, target){
        pricingPlanType.set("LOCATION_BASED_PRICE");
        generateInvoiceDraft();
    },

    'click .setPricingPlanToSalesBased': function(event, target){
        pricingPlanType.set("SALES_BASED_PRICE");
        generateInvoiceDraft();
    },

    'click #updateDueDate': function(event, target){
        let dueDate_UTC = new Date(document.getElementById("paymentDueDateInput").value);
        let dueDate = new Date(dueDate_UTC.getUTCFullYear(), dueDate_UTC.getUTCMonth(), dueDate_UTC.getUTCDate());

        let invoice = draftInvoice.get();
        invoice.paymentDueDate = dueDate;
        draftInvoice.set(invoice);
    }

});