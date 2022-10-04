Maestro.Templates.DashboardHome = "DashboardHome";

const DAILY = 'daily', WEEKLY = 'weekly', MONTHLY = 'monthly';

Template.DashboardHome.onCreated(function(){
    let template = this;

    template.dashboardMode = new ReactiveVar();
    template.startDateReact = new ReactiveVar();
    template.nextPeriod;

    template.dashboardSummary = new ReactiveVar();
    template.dashboardSummary.set({});

    template.dashboardTables = new ReactiveVar();
    template.dashboardTables.set({});

    template.customerTables = new ReactiveVar();
    template.customerTables.set({});

    template.allLocationsMode = new ReactiveVar();
    template.allLocationsMode.set(false);

    template.initializeDailyView = function(){
        template.dashboardMode.set(DAILY);

        let todayDate = new Date();
        todayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());

        template.nextPeriod = new Date(todayDate);
        // template.nextPeriod.setDate(template.nextPeriod.getDate()+1);

        template.startDateReact.set(todayDate);
    };

    template.initializeWeeklyView = function(){
        template.dashboardMode.set(WEEKLY);

        let weeklyDate = new Date();

        weeklyDate = new Date(weeklyDate.getFullYear(), weeklyDate.getMonth(), weeklyDate.getDate());
        weeklyDate.setDate(weeklyDate.getDate()-weeklyDate.getDay());

        template.startDateReact.set(weeklyDate);

        template.nextPeriod = new Date(weeklyDate);
        template.nextPeriod.setDate(template.nextPeriod.getDate()+6);
    };

    template.initializeMonthlyView = function(){
        template.dashboardMode.set(MONTHLY);
        
        var monthlyDate = new Date();

        monthlyDate = new Date(monthlyDate.getFullYear(), monthlyDate.getMonth(), monthlyDate.getDate());
        monthlyDate.setDate(1);

        template.startDateReact.set(monthlyDate);

        template.nextPeriod = new Date(monthlyDate);
        template.nextPeriod.setMonth(template.nextPeriod.getMonth()+1);
        template.nextPeriod.setDate(template.nextPeriod.getDate()-1);
    };

    template.getBarChart = function(divId){
        var pageContainer = document.getElementById(divId);
        if(!pageContainer){return;}

        pageContainer.innerHTML="";

        var barChartContainer = document.createElement("div");
        var barChartId = "barChartContainer";

        barChartContainer.setAttribute("id", barChartId);
        pageContainer.appendChild(barChartContainer);

        var currentDate = new Date(template.startDateReact.get());

        // var ordersObj = Orders.find({createdAt : {$gt: currentDate, $lt: template.nextPeriod}}).fetch();
        // var ordersObj = Maestro.Atlas.Tally.GetOrders(currentDate, template.nextPeriod);

        var ordersObj = template.dashboardSummary.get().orders;
        if(!ordersObj || ordersObj.length == 0){return;}

        var dataObj = [];

        var labelText;

        // var dailyDate = new Date(template.startDateReact.get());
        // var totalOrders = Maestro.Atlas.Tally.TotalOrderSales(dailyDate)

        if(ordersObj.length == 0){
            Maestro.Atlas.BarChart(barChartId,[{label:"No Orders", total:0}]);
        } else {
            if(template.dashboardMode.get()== DAILY){
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
                    orderTotal = ordersObj[i].total - ordersObj[i].giftCardTotal;
                    dataObj[orderHour].total += orderTotal;
                }

                while (dataObj[0].total ==0){
                    dataObj.shift();
                }

                while (dataObj[dataObj.length-1].total==0){
                    dataObj.pop();
                }
            } else if (template.dashboardMode.get()== WEEKLY){
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
                    orderTotal = ordersObj[i].total - ordersObj[i].giftCardTotal;

                    dataObj[orderDay].total += orderTotal;
                }
            } else if (template.dashboardMode.get()== MONTHLY) {
                let maxDaysInMonth = new Date(template.startDateReact.get().getFullYear(), template.startDateReact.get().getMonth()+1, 0).getDate();

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
                    orderTotal = ordersObj[i].total - ordersObj[i].giftCardTotal;
                    dataObj[orderDay-1].total += orderTotal;
                }
            }
            
            Maestro.Atlas.BarChart(barChartId,dataObj);
        }
    };

    template.getDashboardSummary = function (startDate, endDate){
        console.log('GETTING DASHBOARD SUMMARY');
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

        let filterCriteria = 
        {
            businessId: Maestro.Business.getBusinessId(),
            fromDate: startDateUTC,
            toDate: endDateUTC,
            fromDateTimeBucket: fromDateTimeBucket,
            toDateTimeBucket: toDateTimeBucket
        };

        // console.log("from: ", startDateUTC, "to: ", endDateUTC);

        if(template.allLocationsMode.get() === false) {
            filterCriteria.locationId = Maestro.Business.getLocationId();
        }

        Maestro.Atlas.Dashboard.getDashboardSummary.call(filterCriteria,
            (error, result) => {
                if(error) {
                    console.log("Error: ", error);
                }

                console.log("DASHBOARD SUMMARY:: ", result);
                template.dashboardSummary.set(result);
            }
        );

        console.log('template.dashboardSummary: ', template.dashboardSummary.get());
    };

    template.refreshDashboard = function(){
        template.dashboardSummary.set({});
        template.getDashboardSummary(template.startDateReact.get(), template.nextPeriod);
        template.getBarChart('barChart');
        template.initializeReportTabs();
    };

    template.initializeReportTabs = function(){
        if(document.getElementById("productsTable")){
            $('ul.tabs').tabs();
            template.getBarChart('barChart');
        } else {
            Meteor.defer(function(){template.initializeReportTabs();});
        }
    };

    template.initializeDailyView();
});

Template.DashboardHome.onRendered(function(){
    let template = this;

    template.refreshDashboard();
    
    // $('.datepicker').pickadate({
    //     selectMonths: true, // Creates a dropdown to control month
    //     selectYears: 15 // Creates a dropdown of 15 years to control year
    // });
});

Template.DashboardHome.helpers({
	DailyView: function(){
		if (Template.instance().dashboardMode.get()== DAILY){
			return true;
		}
		return false;
	},

	WeeklyView: function(){
		if (Template.instance().dashboardMode.get()== WEEKLY){
			return true;
		}
		return false;
	},

	MonthlyView: function(){
		if (Template.instance().dashboardMode.get()== MONTHLY){
			return true;
		}
		return false;
	},

    isDashboardReady: function(){
        let dashboard = Template.instance().dashboardSummary.get();

        if(!!dashboard){
            if(!!dashboard.processedAt){
                return true;
            }
        }
        return false;
    },

    isTaxComponentsZero: function(){
        dailyDate = new Date(Template.instance().startDateReact.get());
        let gst = Maestro.Atlas.Aggregate.GSTTaxes(Template.instance().dashboardSummary.get().orders).toFixed(2);
        let hst = Maestro.Atlas.Aggregate.HSTTaxes(Template.instance().dashboardSummary.get().orders).toFixed(2);

        if (gst == 0 && hst ==0){
            return true;
        }
    },

    getOrdersTally : function(){
        dailyDate = new Date(Template.instance().startDateReact.get());

        // console.log(Template.instance().dashboardSummary.get());

        return Maestro.Atlas.Aggregate.TotalOrderCount(Template.instance().dashboardSummary.get().orders);
    },

    getSalesTally : function(){
        dailyDate = new Date(Template.instance().startDateReact.get());
        return Maestro.Atlas.Aggregate.TotalSales(Template.instance().dashboardSummary.get().orders).toFixed(2);
    },

    getNetSalesTally : function(){
        dailyDate = new Date(Template.instance().startDateReact.get());
        return Maestro.Atlas.Aggregate.TotalNetSales(Template.instance().dashboardSummary.get().orders).toFixed(2);
    },

    getTaxesTotal: function(){
        dailyDate = new Date(Template.instance().startDateReact.get());
        return Maestro.Atlas.Aggregate.TotalTaxes(Template.instance().dashboardSummary.get().orders).toFixed(2);
    },

    getGSTTaxes : function(){
        dailyDate = new Date(Template.instance().startDateReact.get());
        return Maestro.Atlas.Aggregate.GSTTaxes(Template.instance().dashboardSummary.get().orders).toFixed(2);
    },

    getHSTTaxes : function(){
        dailyDate = new Date(Template.instance().startDateReact.get());
        return Maestro.Atlas.Aggregate.HSTTaxes(Template.instance().dashboardSummary.get().orders).toFixed(2);
    },

    getTaxComponentKeysForLocation: function(){
        if(Template.instance().allLocationsMode.get()==true){
            return Maestro.Tax.GetTaxComponentKeysForAllLocations();
        } else {
            return Maestro.Tax.GetTaxComponentKeysForLocation();
        }
    },

    singleTaxComponent: function(){
        if((Maestro.Tax.GetTaxComponentKeysForLocation() || []).length == 1) {
            return true;
        }
    },

    getTaxComponentTotals: function(key) {
        if(key == 'gst') {
            return Maestro.Atlas.Aggregate.GSTTaxes(Template.instance().dashboardSummary.get().orders).toFixed(2);
        } else if (key == 'hst') {
            return Maestro.Atlas.Aggregate.HSTTaxes(Template.instance().dashboardSummary.get().orders).toFixed(2);
        } else if (key == 'pst') {
            return Maestro.Atlas.Aggregate.PSTTaxes(Template.instance().dashboardSummary.get().orders).toFixed(2);
        }
    },

    getSelectedDate : function(){ 
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

        dailyDate = new Date(Template.instance().startDateReact.get());

        return weekdays[dailyDate.getDay()]+", " + months[dailyDate.getMonth()] + " " + dailyDate.getDate();
    },

    getSelectedWeeklyDate : function(){ 
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

        weeklyDate = new Date(Template.instance().startDateReact.get());

        var nextWeeklyDateTemp = new Date(Template.instance().nextPeriod);
        nextWeeklyDateTemp.setDate(nextWeeklyDateTemp.getDate());

        var labelString = weekdays[weeklyDate.getDay()]+", " + months[weeklyDate.getMonth()] + " " + weeklyDate.getDate() + " to " +
            weekdays[nextWeeklyDateTemp.getDay()]+", " + months[nextWeeklyDateTemp.getMonth()] + " " + nextWeeklyDateTemp.getDate() ;

        return labelString;
    },

    getSelectedMonthlyDate : function(){ 
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

        monthlyDate = new Date(Template.instance().startDateReact.get());

        var labelString = months[monthlyDate.getMonth()];

        return labelString;
    },

    getProductsTable : function(){
        // console.log(Template.instance().dashboardTables.get().products);
        return Template.instance().dashboardTables.get().products;
    },

    getLoyaltyProgramsTable: function(){
        return Template.instance().dashboardTables.get().loyaltyPrograms;
    },

    getProductRedeemTable: function(){
        return Template.instance().dashboardTables.get().productRedeems;
    },

    getCategoryTable : function(){
        return Template.instance().dashboardTables.get().categories;
    },

    getCustomerTable: function(){
        if(Template.instance().customerTables.get()){
            return Template.instance().customerTables.get().top30;
        }
    },

    totalGiftCardRedeemed: function(){
        return Maestro.Atlas.Aggregate.TotalGiftCardRedeemed(Template.instance().dashboardSummary.get().orders).toFixed(2);
    },

    formatCurrency: function(amount){
        return "$" + amount.toFixed(2);
    },

    formatQuantity: function(quantity){
        return "x" + quantity;
    },

    refreshGraph: function(){
        if(UserSession.get(Maestro.UserSessionConstants.LOCATION_ID) && Template.instance().dashboardSummary.get()){
            if(document.getElementById('barChart')){
                Template.instance().getBarChart('barChart');
            }
            Template.instance().dashboardTables.set(Maestro.Atlas.Aggregate.ParseItemsTable(Template.instance().dashboardSummary.get().products));
            Template.instance().customerTables.set(Maestro.Atlas.Aggregate.CustomersTable(Template.instance().dashboardSummary.get().customers));
        }
        Template.instance().initializeReportTabs();
    },

    moreThanOneLocation: function(){
        if(Locations.find({}).fetch().length>1){
            return true;
        }
        return false;
    },

    getLoyaltyTotalChip: function(){
        let loyaltyTotal = _.reduce(Template.instance().dashboardTables.get().loyaltyPrograms, function(memo, program){
            return memo + program.total;
        },0.00);

        let loyaltyQuantity = _.reduce(Template.instance().dashboardTables.get().loyaltyPrograms, function(memo, program){
            return memo + program.quantity;
        },0);

        if (loyaltyTotal == 0.00){
            return null;
        }

        return {total: loyaltyTotal, quantity: loyaltyQuantity};
    },

    inAllLocationsMode: function(){
        return Template.instance().allLocationsMode.get();
    }

});

Template.DashboardHome.events({
    'click .toggleAllLocationMode': function(event, template){
        if(template.allLocationsMode.get() === false){
            template.allLocationsMode.set(true);
        } else {
            template.allLocationsMode.set(false);
        }
        template.refreshDashboard();
    },

    'click #nextPeriod': function(event, template){
        if (template.dashboardMode.get()== DAILY){
            let dailyDate = new Date(template.startDateReact.get());

            dailyDate.setDate(dailyDate.getDate()+1);
            template.nextPeriod.setDate(template.nextPeriod.getDate()+1);

            template.startDateReact.set(dailyDate);
        } else if (template.dashboardMode.get()== WEEKLY){
            let weeklyDate = new Date(template.startDateReact.get());

            weeklyDate.setDate(weeklyDate.getDate()+7);
            template.nextPeriod.setDate(template.nextPeriod.getDate()+7);

            template.startDateReact.set(weeklyDate);
        } else if (template.dashboardMode.get()== MONTHLY){
            let monthlyDate = new Date(template.startDateReact.get());

            monthlyDate.setMonth(monthlyDate.getMonth()+1);
            
            template.nextPeriod = new Date(monthlyDate);
            template.nextPeriod.setMonth(template.nextPeriod.getMonth()+1);
            template.nextPeriod.setDate(template.nextPeriod.getDate()-1);

            template.startDateReact.set(monthlyDate);
        }

        template.dashboardSummary.set({});
        template.getDashboardSummary(template.startDateReact.get(), template.nextPeriod);
        
        // template.getBarChart('barChart');
    },

    'click #previousPeriod': function(event, template){
        if (template.dashboardMode.get()== DAILY){
            let dailyDate = new Date(template.startDateReact.get());

            dailyDate.setDate(dailyDate.getDate()-1);
            template.nextPeriod.setDate(template.nextPeriod.getDate()-1);

            template.startDateReact.set(dailyDate);
        } else if (template.dashboardMode.get()== WEEKLY){
            let weeklyDate = new Date(template.startDateReact.get());

            weeklyDate.setDate(weeklyDate.getDate()-7);
            template.nextPeriod.setDate(template.nextPeriod.getDate()-7);

            template.startDateReact.set(weeklyDate);
        } else if (template.dashboardMode.get()== MONTHLY){
            let monthlyDate = new Date(template.startDateReact.get());

            monthlyDate.setMonth(monthlyDate.getMonth()-1);
            
            template.nextPeriod = new Date(monthlyDate);
            template.nextPeriod.setMonth(template.nextPeriod.getMonth()+1);
            template.nextPeriod.setDate(template.nextPeriod.getDate()-1);
            
            template.startDateReact.set(monthlyDate);
        }

        template.dashboardSummary.set({});
        template.getDashboardSummary(template.startDateReact.get(), template.nextPeriod);
        
        // template.getBarChart('barChart');
    },

    'click .forceRefresh': function(event, template){
        template.refreshDashboard();
    },

    'click .setDailyView': function(event, template){
        template.initializeDailyView();
        template.refreshDashboard();
    },

    'click .setWeeklyView': function(event, template){
        template.initializeWeeklyView();
        template.refreshDashboard();
    },
    
    'click .setMonthlyView': function(event, template){
        template.initializeMonthlyView();
        template.refreshDashboard();
    },

});