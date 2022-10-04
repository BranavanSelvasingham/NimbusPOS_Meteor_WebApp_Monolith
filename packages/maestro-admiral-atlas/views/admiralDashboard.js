Maestro.Templates.AdmiralDashboard = "AdmiralDashboard";

var selectedBusiness = new ReactiveVar();
var selectedLocation = new ReactiveVar();

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

var initializeDailyView = function(){
    dashboardMode.set(DAILY);

    let todayDate = new Date();
    todayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());

    nextPeriod = new Date(todayDate);
    // nextPeriod.setDate(nextPeriod.getDate()+1);

    startDateReact.set(todayDate);
};

var initializeWeeklyView = function(){
    dashboardMode.set(WEEKLY);

    let weeklyDate = new Date();

    weeklyDate = new Date(weeklyDate.getFullYear(), weeklyDate.getMonth(), weeklyDate.getDate());
    weeklyDate.setDate(weeklyDate.getDate()-weeklyDate.getDay());

    startDateReact.set(weeklyDate);

    nextPeriod = new Date(weeklyDate);
    nextPeriod.setDate(nextPeriod.getDate()+6);
};

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

var getBarChart = function(divId){
    var pageContainer = document.getElementById(divId);
    if(!pageContainer){return;}

    pageContainer.innerHTML="";

    var barChartContainer = document.createElement("div");
    var barChartId = "barChartContainer";

    barChartContainer.setAttribute("id", barChartId);
    pageContainer.appendChild(barChartContainer);

    var currentDate = new Date(startDateReact.get());

    // var ordersObj = Orders.find({createdAt : {$gt: currentDate, $lt: nextPeriod}}).fetch();
    // var ordersObj = Maestro.Atlas.Tally.GetOrders(currentDate, nextPeriod);

    var ordersObj = dashboardSummary.get().orders;
    if(!ordersObj || ordersObj.length == 0){return;}
    // console.log(ordersObj);

    var dataObj = [];

    var labelText;

    // var dailyDate = new Date(startDateReact.get());
    // var totalOrders = Maestro.Atlas.Tally.TotalOrderSales(dailyDate)

    if(ordersObj.length == 0){
        Maestro.Atlas.BarChart(barChartId,[{label:"No Orders", total:0}]);
    } else {
        if(dashboardMode.get()== DAILY){
            for (i=0; i < 24; i++){
                if (i==0){
                    labelText = "12 am";
                } else if(i<12){
                    labelText = String(i) + " am";
                } else if (i == 12){
                    labelText = String(i) + " pm";
                } else {
                    labelText = String(i-12) + " pm";
                }

                dataObj.push(
                        {label: labelText, total: 0}
                    );
            }

            let orderHour, orderDate, orderTotal;
            let localTime = new Date();

            for (i = 0; i < ordersObj.length; i++){
                // orderDate = new Date();
                // orderDate.setUTCFullYear(ordersObj[i]._id.year);
                // orderDate.setUTCMonth(ordersObj[i]._id.month);
                // orderDate.setUTCDate(ordersObj[i]._id.day);
                // orderDate.setUTCHours(ordersObj[i]._id.hour);
                // orderHour = orderDate.getHours();
                orderHour = ordersObj[i]._id.hour;
                orderTotal = ordersObj[i].total;
                dataObj[orderHour].total += orderTotal;
            }

            while (dataObj[0].total ==0){
                dataObj.shift();
            }

            while (dataObj[dataObj.length-1].total==0){
                dataObj.pop();
            }
        } else if (dashboardMode.get()== WEEKLY){
            let weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
            
            for (i=0; i < 7; i++){
                dataObj.push(
                        {label: weekdays[i], total: 0.0}
                    );
            }

            let orderDay, orderDate, orderTotal;

            for (i = 0; i < ordersObj.length; i++){
                orderDate = new Date();
                orderDate.setFullYear(ordersObj[i]._id.year);
                orderDate.setMonth(ordersObj[i]._id.month);
                orderDate.setDate(ordersObj[i]._id.day);

                orderDay = orderDate.getDay();
                orderTotal = ordersObj[i].total;

                dataObj[orderDay].total += orderTotal;
            }
        } else if (dashboardMode.get()== MONTHLY) {
            let maxDaysInMonth = new Date(startDateReact.get().getFullYear(), startDateReact.get().getMonth()+1, 0).getDate();

            for (i=0; i < maxDaysInMonth; i++){
                dataObj.push(
                        {label: i+1, total: 0.0}
                    );
            }

            let orderDay, orderDate, orderTotal;

            for (i = 0; i < ordersObj.length; i++){
                // orderDate = new Date(ordersObj[i].createdAt);
                // orderDate = new Date();
                // orderDate.setUTCFullYear(ordersObj[i]._id.year);
                // orderDate.setUTCMonth(ordersObj[i]._id.month);
                // orderDate.setUTCDate(ordersObj[i]._id.day);
                // orderDate.setUTCHours(ordersObj[i]._id.hour);
                // orderDay = orderDate.getDate();
                orderDay = ordersObj[i]._id.day;
                orderTotal = ordersObj[i].total;
                dataObj[orderDay-1].total += orderTotal;
            }
        }
        
        Maestro.Atlas.BarChart(barChartId,dataObj);
    }
};

var getDashboardSummary = function (startDate, endDate){
    console.log("GETTING DASHBOARD SUMMARY");
    if(!selectedBusiness.get() || !selectedLocation.get()){
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
    
    let startDate_startOfDay = moment(startDate);
    startDate_startOfDay = new Date(startDate_startOfDay.startOf('day').toDate());

    let endDate_endOfDay = moment(endDate);
    endDate_endOfDay = new Date(endDate_endOfDay.endOf('day').toDate());

    let startDateUTC = new Date(Maestro.UtilityMethods.ConvertDateToUTCConstant(startDate_startOfDay));
    let endDateUTC = new Date(Maestro.UtilityMethods.ConvertDateToUTCConstant(endDate_endOfDay));

    // console.log("from: ", startDateUTC, "to: ", endDateUTC);

    Maestro.Atlas.Dashboard.getDashboardSummary.call(
        {
            businessId: selectedBusiness.get(),
            locationId: selectedLocation.get(),
            fromDate: startDateUTC,
            toDate: endDateUTC,
            fromDateTimeBucket: fromDateTimeBucket,
            toDateTimeBucket: toDateTimeBucket
        },
        (error, result) => {
            if(error) {
                console.log("Error: ", error);
            }

            console.log("DASHBOARD SUMMARY:: ", result);
            dashboardSummary.set(result);
        }
    );

    console.log('dashboardSummary: ', dashboardSummary.get());
};

var refreshDashboard = function(){
    dashboardSummary.set({});
    getDashboardSummary(startDateReact.get(), nextPeriod);
    getBarChart('barChart');
    initializeReportTabs();
};

var initializeReportTabs = function(){
    if(document.getElementById("productsTable")){
        $('ul.tabs').tabs();
        getBarChart('barChart');
    } else {
        Meteor.defer(function(){initializeReportTabs();});
    }
};

Template.AdmiralDashboard.onCreated(function(){
    initializeDailyView();

    Template.instance().subscribe('admiral-business-cores');
    Template.instance().subscribe('admiral-customers');
    Template.instance().subscribe('admiral-loyalty-programs');
    Template.instance().subscribe('admiral-products');
});

Template.AdmiralDashboard.onRendered(function(){
    refreshDashboard();

    $('.collapsible').collapsible({
        accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
    
    // $('.datepicker').pickadate({
    //     selectMonths: true, // Creates a dropdown to control month
    //     selectYears: 15 // Creates a dropdown of 15 years to control year
    // });
});

Template.AdmiralDashboard.helpers({
    getAllBusinesses: function(){
        return Businesses.find({});
    },

    getAllLocations: function(){
        if(!!selectedBusiness.get()){
            return Locations.find({businessId: selectedBusiness.get()}).fetch();
        }
        return [];
    },

    isBusinessSelected: function(){
        if (!!selectedBusiness.get()){
            return true;
        }
        return false;
    },

    isLocationSelected: function(){
        if (!!selectedLocation.get()){
            return true;
        }
        return false;
    },

    getSelectedBusinessInfo: function(){
        if(!!selectedBusiness.get()){
            return Businesses.findOne({_id: selectedBusiness.get()});
        }
    },

    getSelectedLocationInfo: function(){
        if(!!selectedLocation.get()){
            return Locations.findOne({_id: selectedLocation.get()});
        }
    },

    isLocationSelected: function(){
        if (!!selectedLocation.get()){
            return true;
        }
        return false;
    },

	DailyView: function(){
		if (dashboardMode.get()== DAILY){
			return true;
		}
		return false;
	},

	WeeklyView: function(){
		if (dashboardMode.get()== WEEKLY){
			return true;
		}
		return false;
	},

	MonthlyView: function(){
		if (dashboardMode.get()== MONTHLY){
			return true;
		}
		return false;
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

    getSelectedDate : function(){ 
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

        dailyDate = new Date(startDateReact.get());

        return weekdays[dailyDate.getDay()]+", " + months[dailyDate.getMonth()] + " " + dailyDate.getDate();
    },

    getSelectedWeeklyDate : function(){ 
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

        weeklyDate = new Date(startDateReact.get());

        var nextWeeklyDateTemp = new Date(nextPeriod);
        nextWeeklyDateTemp.setDate(nextWeeklyDateTemp.getDate());

        var labelString = weekdays[weeklyDate.getDay()]+", " + months[weeklyDate.getMonth()] + " " + weeklyDate.getDate() + " to " +
            weekdays[nextWeeklyDateTemp.getDay()]+", " + months[nextWeeklyDateTemp.getMonth()] + " " + nextWeeklyDateTemp.getDate() ;

        return labelString;
    },

    getSelectedMonthlyDate : function(){ 
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

        monthlyDate = new Date(startDateReact.get());

        var labelString = months[monthlyDate.getMonth()];

        return labelString;
    },

    getProductsTable : function(){
        // console.log(dashboardTables.get().products);
        return dashboardTables.get().products;
    },

    getLoyaltyProgramsTable: function(){
        return dashboardTables.get().loyaltyPrograms;
    },

    getProductRedeemTable: function(){
        return dashboardTables.get().productRedeems;
    },

    getCategoryTable : function(){
        return dashboardTables.get().categories;
    },

    getCustomerTable: function(){
        if(customerTables.get()){
            return customerTables.get().top30;
        }
    },

    formatCurrency: function(amount){
        return "$" + amount.toFixed(2);
    },

    formatQuantity: function(quantity){
        return "x" + quantity;
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

});

Template.AdmiralDashboard.events({
    'click .selectBusiness': function(event, target){
        selectedBusiness.set(this._id);
        selectedLocation.set();
    },

    'click .selectLocation': function(event, target){
        selectedLocation.set(this._id);
        refreshDashboard();
    },

    'click #nextPeriod': function(event, target){
        if (dashboardMode.get()== DAILY){
            let dailyDate = new Date(startDateReact.get());

            dailyDate.setDate(dailyDate.getDate()+1);
            nextPeriod.setDate(nextPeriod.getDate()+1);

            startDateReact.set(dailyDate);
        } else if (dashboardMode.get()== WEEKLY){
            let weeklyDate = new Date(startDateReact.get());

            weeklyDate.setDate(weeklyDate.getDate()+7);
            nextPeriod.setDate(nextPeriod.getDate()+7);

            startDateReact.set(weeklyDate);
        } else if (dashboardMode.get()== MONTHLY){
            let monthlyDate = new Date(startDateReact.get());

            monthlyDate.setMonth(monthlyDate.getMonth()+1);
            
            nextPeriod = new Date(monthlyDate);
            nextPeriod.setMonth(nextPeriod.getMonth()+1);
            nextPeriod.setDate(nextPeriod.getDate()-1);

            startDateReact.set(monthlyDate);
        }

        dashboardSummary.set({});
        getDashboardSummary(startDateReact.get(), nextPeriod);
        
        // getBarChart('barChart');
    },

    'click #previousPeriod': function(event, target){
        if (dashboardMode.get()== DAILY){
            let dailyDate = new Date(startDateReact.get());

            dailyDate.setDate(dailyDate.getDate()-1);
            nextPeriod.setDate(nextPeriod.getDate()-1);

            startDateReact.set(dailyDate);
        } else if (dashboardMode.get()== WEEKLY){
            let weeklyDate = new Date(startDateReact.get());

            weeklyDate.setDate(weeklyDate.getDate()-7);
            nextPeriod.setDate(nextPeriod.getDate()-7);

            startDateReact.set(weeklyDate);
        } else if (dashboardMode.get()== MONTHLY){
            let monthlyDate = new Date(startDateReact.get());

            monthlyDate.setMonth(monthlyDate.getMonth()-1);
            
            nextPeriod = new Date(monthlyDate);
            nextPeriod.setMonth(nextPeriod.getMonth()+1);
            nextPeriod.setDate(nextPeriod.getDate()-1);
            
            startDateReact.set(monthlyDate);
        }

        dashboardSummary.set({});
        getDashboardSummary(startDateReact.get(), nextPeriod);
        
        // getBarChart('barChart');
    },

    'click .forceRefresh': function(event, target){
        refreshDashboard();
    },

    'click .setDailyView': function(event, target){
        initializeDailyView();
        refreshDashboard();
    },

    'click .setWeeklyView': function(event, target){
        initializeWeeklyView();
        refreshDashboard();
    },
    
    'click .setMonthlyView': function(event, target){
        initializeMonthlyView();
        refreshDashboard();
    },

});