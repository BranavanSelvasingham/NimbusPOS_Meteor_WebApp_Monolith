Maestro.Templates.DailyView = "DailyView";

var dailyDateReact = new ReactiveVar();
var dailyDate = new Date();

dailyDate = new Date(dailyDate.getFullYear(), dailyDate.getMonth(), dailyDate.getDate());

var nextDay = new Date(dailyDate);
nextDay.setDate(nextDay.getDate()+1);

dailyDateReact.set(dailyDate);

var dashboardSummary = new ReactiveVar();
dashboardSummary.set({});

var getDailyBarChart = function(divId){
    var pageContainer = document.getElementById(divId);
    if(!pageContainer){return;}
    
    pageContainer.innerHTML="";

    var barChartContainer = document.createElement("div");
    var barChartId = "dailyBarChartContainer";

    barChartContainer.setAttribute("id", barChartId);
    pageContainer.appendChild(barChartContainer);

    var currentDate = new Date(dailyDateReact.get());

    // var ordersObj = Orders.find({createdAt : {$gt: currentDate, $lt: nextDay}}).fetch();
    var ordersObj = Maestro.Atlas.Tally.GetOrders(currentDate, nextDay);

    var dataObj = [];

    var labelText;

    var dailyDate = new Date(dailyDateReact.get());
    var totalOrders = Maestro.Atlas.Tally.TotalOrderSales(dailyDate)

    if(totalOrders == 0){
        Maestro.Atlas.BarChart(barChartId,[{label:"No Orders", total:0}]);
    } else {
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

        var orderHour, orderDate, orderTotal;

        for (i = 0; i < ordersObj.length; i++){
            orderDate = new Date(ordersObj[i].createdAt);
            orderHour = orderDate.getHours();
            orderTotal = ordersObj[i].subtotals.total;
            dataObj[orderHour].total += orderTotal;
        }

        while (dataObj[0].total ==0){
            dataObj.shift();
        }

        while (dataObj[dataObj.length-1].total==0){
            dataObj.pop();
        }
        
        Maestro.Atlas.BarChart(barChartId,dataObj);
    }
};

var getDashboardSummary = function (startDate, endDate){
    // console.log("ORDER SUMMARY RESULTS DASHBOARD::: ");

    // fromDate = moment(startDate).format('YYYY-MM-DD');
    // toDate = moment(endDate).format('YYYY-MM-DD');
    // toDate = null;

    // console.log(fromDate, toDate);

    Maestro.Atlas.Dashboard.getDashboardSummary.call(
        {
            businessId: Maestro.Business.getBusinessId(),
            locationId: Maestro.Business.getLocationId(),
            fromDate: startDate,
            toDate: startDate
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

Template.DailyView.onCreated(function(){
    this.autorun(function(){
        let businessId = UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID);
        let startDate = new Date(dailyDateReact.get());
        let endDate = nextDay;
        Template.instance().subscribe('orders-start-end-date', businessId, startDate, endDate);
    });
});

Template.DailyView.onRendered(function(){
    window.setTimeout(function(){getDailyBarChart('dailyBarChart');},1000);

    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });
});

Template.DailyView.helpers({
    isSubscriptionReady: function(){
        return Template.instance().subscriptionsReady();
    },

    isTaxComponentsZero: function(){
        dailyDate = new Date(dailyDateReact.get());
        let gst = Maestro.Atlas.Tally.TaxComponentTotal('gst', dailyDate);
        let hst = Maestro.Atlas.Tally.TaxComponentTotal('hst', dailyDate);

        if (gst == 0 && hst ==0){
            return true;
        }
    },

    getDailyOrdersTally : function(){
        dailyDate = new Date(dailyDateReact.get());
        return Maestro.Atlas.Tally.TotalOrderCount(dailyDate);
    },

    getDailySalesTally : function(){
        dailyDate = new Date(dailyDateReact.get());
        return Maestro.Atlas.Tally.NetSales(dailyDate).toFixed(2);
    },

    getDailyNetSalesTally : function(){
        dailyDate = new Date(dailyDateReact.get());
        return Maestro.Atlas.Tally.NetSales(dailyDate).toFixed(2);
    },

    getDailyTaxesTotal: function(){
        dailyDate = new Date(dailyDateReact.get());
        return Maestro.Atlas.Tally.TaxComponentTotal('total', dailyDate).toFixed(2);
    },

    getDailyGSTTaxes : function(){
        dailyDate = new Date(dailyDateReact.get());
        return Maestro.Atlas.Tally.TaxComponentTotal('gst', dailyDate).toFixed(2);
    },

    getDailyHSTTaxes : function(){
        dailyDate = new Date(dailyDateReact.get());
        return Maestro.Atlas.Tally.TaxComponentTotal('hst', dailyDate).toFixed(2);
    },

    getSelectedDailyDate : function(){ 
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

        dailyDate = new Date(dailyDateReact.get());

        return weekdays[dailyDate.getDay()]+", " + months[dailyDate.getMonth()] + " " + dailyDate.getDate();
    },

    getDailyProductsTable : function(){
        return Maestro.Atlas.Tally.StartToEndDate.ProductsTable(dailyDateReact.get(), nextDay);
    },

    getDailyCategoryTable : function(){
        return Maestro.Atlas.Tally.StartToEndDate.CategoryTable(dailyDateReact.get(), nextDay);
    },

    formatCurrency: function(amount){
        return "$" + amount.toFixed(2);
    },

    formatQuantity: function(quantity){
        return "x" + quantity;
    },

    refreshDailyGraph: function(){
        if(dailyDateReact.get() || Maestro.Business.getLocationId()){
            if(document.getElementById('dailyBarChart')){
                getDailyBarChart('dailyBarChart');
            }
        }
    },

});

Template.DailyView.events({
    'click #nextDay': function(event, target){
        dailyDate = new Date(dailyDateReact.get());

        dailyDate.setDate(dailyDate.getDate()+1);
        nextDay.setDate(nextDay.getDate()+1);

        dailyDateReact.set(dailyDate);
        getDashboardSummary(dailyDateReact.get(), nextDay);
        // getDailyBarChart('dailyBarChart');
    },

    'click #previousDay': function(event, target){
        dailyDate = new Date(dailyDateReact.get());

        dailyDate.setDate(dailyDate.getDate()-1);
        nextDay.setDate(nextDay.getDate()-1);

        dailyDateReact.set(dailyDate);

        getDashboardSummary(dailyDateReact.get(), nextDay);
        // getDailyBarChart('dailyBarChart');
    },

    'click .forceRefreshDaily': function(event, target){
        getDailyBarChart('dailyBarChart');
        getDashboardSummary(dailyDateReact.get(), nextDay);
    }
    

});