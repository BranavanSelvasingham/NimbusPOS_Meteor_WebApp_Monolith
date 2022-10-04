Maestro.Templates.ReportsHome = "ReportsHome";

Template.ReportsHome.onCreated(function(){
    let template = this;

    template.DailyDateReact = new ReactiveVar();
    template.dailyDate = new Date();

    template.dailyDate = new Date(template.dailyDate.getFullYear(), template.dailyDate.getMonth(), template.dailyDate.getDate());

    template.nextDay = new Date(template.dailyDate);
    template.nextDay.setDate(template.nextDay.getDate()+1);

    template.DailyDateReact.set(template.dailyDate);

    this.autorun(function(){
        let businessId = UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID);
        let locationId = UserSession.get(Maestro.UserSessionConstants.LOCATION_ID);
        let startDate = new Date(template.DailyDateReact.get());
        let endDate = template.nextDay;
        Template.instance().subscribe('orders-start-end-date-location', businessId, locationId, startDate, endDate);
    });
});

Template.ReportsHome.onRendered(function(){
    let template = this;

    if(!Maestro.Business.getLocation()){
        Materialize.toast('Select a Location', 5000);
    }
    
    template.dailyDate = new Date();
    template.dailyDate = new Date(template.dailyDate.getFullYear(), template.dailyDate.getMonth(), template.dailyDate.getDate());

    template.nextDay = new Date(template.dailyDate);
    template.nextDay.setDate(template.nextDay.getDate()+1);

    template.DailyDateReact.set(template.dailyDate);
});

Template.ReportsHome.helpers({
    isSubscriptionReady: function(){
        return Template.instance().subscriptionsReady();
    },

    isTaxComponentsZero: function(){
        Template.instance().dailyDate = new Date(Template.instance().DailyDateReact.get());
        let gst = Maestro.Atlas.Tally.TaxComponentTotal('gst', Template.instance().dailyDate);
        let hst = Maestro.Atlas.Tally.TaxComponentTotal('hst', Template.instance().dailyDate);
        let pst = Maestro.Atlas.Tally.TaxComponentTotal('pst', Template.instance().dailyDate);
        if (gst == 0 && hst ==0 && pst == 0){
            return true;
        }
    },

    getTaxComponentKeysForLocation: function(){
        return Maestro.Tax.GetTaxComponentKeysForLocation();
    },

    getDailyOrdersTally : function(){
        Template.instance().dailyDate = new Date(Template.instance().DailyDateReact.get());
        return Maestro.Atlas.Tally.TotalOrderCount(Template.instance().dailyDate);
    },

    getAssociatedTaxComponentTotal: function(key, gstTax, hstTax, pstTax){
        if(key == "gst"){
            return gstTax;
        } else if (key == "hst"){
            return hstTax;
        } else if (key == "pst"){
            return pstTax;
        }
    },

    getDailySalesTally : function(){
        Template.instance().dailyDate = new Date(Template.instance().DailyDateReact.get());
        return Maestro.Atlas.Tally.TotalOrderSales(Template.instance().dailyDate);
    },

    getDailyNetSalesTally : function(){
        Template.instance().dailyDate = new Date(Template.instance().DailyDateReact.get());
        return Maestro.Atlas.Tally.NetSales(Template.instance().dailyDate);
    },

    getDailyTaxesTotal: function(){
        Template.instance().dailyDate = new Date(Template.instance().DailyDateReact.get());
        return Maestro.Atlas.Tally.TaxComponentTotal('total', Template.instance().dailyDate);
    },

    getDailyGSTTaxes : function(){
        Template.instance().dailyDate = new Date(Template.instance().DailyDateReact.get());
        return Maestro.Atlas.Tally.TaxComponentTotal('gst', Template.instance().dailyDate);
    },

    getDailyHSTTaxes : function(){
        Template.instance().dailyDate = new Date(Template.instance().DailyDateReact.get());
        return Maestro.Atlas.Tally.TaxComponentTotal('hst', Template.instance().dailyDate);
    },

    getDailyTaxComponentTotal: function(taxComponent){
        Template.instance().dailyDate = new Date(Template.instance().DailyDateReact.get());
        return Maestro.Atlas.Tally.TaxComponentTotal(taxComponent, Template.instance().dailyDate);
    },

    getSelectedDailyDate : function(){ 
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

        Template.instance().dailyDate = new Date(Template.instance().DailyDateReact.get());

        return weekdays[Template.instance().dailyDate.getDay()]+", " + months[Template.instance().dailyDate.getMonth()] + " " + Template.instance().dailyDate.getDate() + ", " + Template.instance().dailyDate.getFullYear();
    },

    getDailyProductsTable : function(){
        return Maestro.Atlas.Tally.StartToEndDate.ProductsTable(Template.instance().DailyDateReact.get(), Template.instance().nextDay);
    },

    getDailyCategoryTable : function(){
        return Maestro.Atlas.Tally.StartToEndDate.CategoryTable(Template.instance().DailyDateReact.get(), Template.instance().nextDay);
    },

    formatCurrency: function(amount){
        return "$" + amount.toFixed(2);
    },

    formatQuantity: function(quantity){
        return "x" + quantity;
    },

    getCashSales: function(){
        return Maestro.Atlas.Tally.Daily.CashSales(Template.instance().DailyDateReact.get());
    },

    getCardSales: function(){
        return Maestro.Atlas.Tally.Daily.CreditDebitSales(Template.instance().DailyDateReact.get());
    },

    getGiftCardRedemptions: function(){
        return Maestro.Atlas.Tally.Daily.GiftCardRedemptions(Template.instance().DailyDateReact.get());
    },

    getTipsGiven: function(){
        return Maestro.Atlas.Tally.Daily.TipsGiven(Template.instance().DailyDateReact.get());
    },

    emailNotSet: function(){
        let business = Maestro.Business.getBusiness();
        if(!!business){
            if(!!business.email){
                return false;
            }
        }
        return true;
    },

    isTipsTracked: function(){
        return Maestro.Business.getConfigurations().trackTips || false;
    },

});

Template.ReportsHome.events({
    'click #nextDay': function(event, template){
        template.dailyDate = new Date(template.DailyDateReact.get());

        template.dailyDate.setDate(template.dailyDate.getDate()+1);
        template.nextDay.setDate(template.nextDay.getDate()+1);

        template.DailyDateReact.set(template.dailyDate);
    },

    'click #previousDay': function(event, template){
        template.dailyDate = new Date(template.DailyDateReact.get());

        template.dailyDate.setDate(template.dailyDate.getDate()-1);
        template.nextDay.setDate(template.nextDay.getDate()-1);

        template.DailyDateReact.set(template.dailyDate);
    },

    'click #emailReport': function(event, template){
        template.dailyDate = new Date(template.DailyDateReact.get());
        Maestro.Reports.Daily.Send(template.dailyDate);
    },

    'click #printReport': function(event, template){
        template.dailyDate = new Date(template.DailyDateReact.get());
        Maestro.Reports.Daily.Print(template.dailyDate);
    },
    
});